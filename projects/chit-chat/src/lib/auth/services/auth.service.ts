import { Injectable } from '@angular/core';
import {
	Auth,
	User as FirebaseUser,
	UserCredential,
	authState,
	signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { isEqual } from 'lodash-es';

import {
	FireStoreCollection,
	MapResult,
} from 'chit-chat/src/lib/utils';

// import {
// 	LibConfig,
// 	LibConfigService,
// } from 'chit-chat/src/lib/lib-config';
import {
	DtoUser,
	FullUser,
	User,
	UserService,
} from 'chit-chat/src/lib/users';

import {
	BehaviorSubject,
	Observable,
	forkJoin,
	from,
	of,
} from 'rxjs';
import {
	catchError,
	distinctUntilChanged,
	map,
	switchMap,
} from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	readonly isLoggedInIntoFirebase$ = authState(this.auth);

	user: BehaviorSubject<FullUser | null> =
		new BehaviorSubject<FullUser | null>(null);

	constructor(
		private afs: AngularFirestore,
		private auth: Auth,
		private userService: UserService // @Inject(LibConfigService) private config: LibConfig
	) {
		// console.log(config);
		this.isLoggedInIntoFirebase$
			.pipe(
				switchMap((user: FirebaseUser | null) => {
					//Set online status of user depending if user logged in/off
					const previousUser = this.user.getValue();

					if (!!user)
						from(
							this.userService.setUserStatus(user.uid, 'available')
						);
					else if (!!previousUser)
						from(
							this.userService.setUserStatus(
								previousUser.userInfo.uid,
								'offline'
							)
						);

					return of(user);
				}),
				switchMap((user) => {
					return !!user
						? this.getUserByFireBaseUser(user)
						: of({ data: null });
				}),
				catchError((error) => {
					return of({ data: null, error: new Error(error) });
				})
			)
			.subscribe(async (user: MapResult<FullUser | null>) => {
				this.user.next(user.data);
				if (!!user.error) {
					throw user.error;
				}
			});
	}

	getCurrentUser = (): FullUser | null => {
		return this.user.getValue();
	};

	getCurrentFireBaseUser = (): FirebaseUser | null => {
		return this.auth.currentUser;
	};

	getUserByFireBaseUser = (
		user: FirebaseUser
	): Observable<MapResult<FullUser | null>> => {
		return this.afs
			.collection<DtoUser>(FireStoreCollection.USERS, (ref: any) =>
				ref
					.where('uid', '==', user.uid)
					.where('isActivated', '==', true)
			)
			.valueChanges(user.uid)
			.pipe(
				distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
				switchMap((users) => {
					const userRole$ =
						this.userService.getUserRoleWithPermissions(
							users[0].roleId
						);
					return forkJoin({
						user: of(users[0]),
						userRole: userRole$,
					});
				}),
				map((fullUser) => {
					if (!!fullUser.userRole.error) {
						return { data: null, error: fullUser.userRole.error };
					}

					const mappedUser: MapResult<User> = User.fromDto(
						fullUser.user
					);

					if (!!mappedUser.error)
						return { data: null, error: mappedUser.error };

					if (!mappedUser.data || !fullUser.userRole.data)
						return {
							data: null,
							error: new Error(
								`${!mappedUser.data ? 'User' : 'UserRole'} is null`
							),
						};

					return {
						data: {
							userInfo: mappedUser.data,
							role: fullUser.userRole.data,
						},
					};
				}),
				catchError((error) => {
					return of({ data: null, error: new Error(error) });
				})
			);
	};

	signIn = async (credentials: {
		email: string;
		password: string;
	}): Promise<UserCredential> => {
		return signInWithEmailAndPassword(
			this.auth,
			credentials.email,
			credentials.password
		);
	};

	signOut = async (): Promise<void> => {
		const user = this.getCurrentFireBaseUser();
		if (!user) return;

		return this.auth.signOut();
	};
}
