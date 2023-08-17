import { Injectable } from '@angular/core';
import {
	Auth,
	User as FirebaseUser,
	UserCredential,
	authState,
	signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { isEqual } from 'lodash';

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
import { FireStoreCollection } from '../enums';
import { MapResult } from '../interfaces';
import { FsPermission, FsUser } from '../interfaces/fs-collections';
import { User } from './../models/user.model';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	readonly isLoggedInIntoFirebase$ = authState(this.auth);

	user: BehaviorSubject<User | null> =
		new BehaviorSubject<User | null>(null);

	constructor(
		private afs: AngularFirestore,
		private auth: Auth,
		private userService: UserService
	) {
		this.isLoggedInIntoFirebase$
			.pipe(
				switchMap((user) => {
					//Set online status of user depending if user logged in/off
					const previousUser = this.user.getValue();

					if (!!user)
						from(
							this.userService.setUserStatus(user.uid, 'available')
						);
					else if (!!previousUser)
						from(
							this.userService.setUserStatus(
								previousUser.uid,
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
			.subscribe(async (result: MapResult<User>) => {
				this.user.next(result.data);

				if (!!result.error) {
					throw result.error;
				}
			});
	}

	getCurrentFireBaseUser(): FirebaseUser | null {
		return this.auth.currentUser;
	}

	getUserByFireBaseUser = (
		user: FirebaseUser
	): Observable<MapResult<User>> => {
		return this.afs
			.collection<FsUser>(FireStoreCollection.USERS, (ref: any) =>
				ref
					.where('uid', '==', user.uid)
					.where('isActivated', '==', true)
					.where('isDeleted', '==', false)
			)
			.valueChanges(user.uid)
			.pipe(
				distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
				switchMap((users: FsUser[]) => {
					const permissions$ = this.userService.getPermissions(
						users[0].roleId
					);
					return forkJoin({
						user: of(users[0]),
						permissions: permissions$,
					});
				}),
				map((data: { user: FsUser; permissions: FsPermission[] }) =>
					User.fromFs(data.user, data.permissions)
				),
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
