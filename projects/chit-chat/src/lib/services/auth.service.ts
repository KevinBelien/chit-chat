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
import { MapResult } from './../interfaces/map-result.interface';

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
import { DtoUser } from '../dto';
import { FireStoreCollection } from '../enums';
import { User } from '../models';
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
			.subscribe(async (user: MapResult<User>) => {
				this.user.next(user.data);
				if (!!user.error) {
					throw user.error;
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
				map((data) => {
					if (!!data.userRole.error) {
						return { data: null, error: data.userRole.error };
					}

					return User.fromDto(data.user, data.userRole);
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
