import { Injectable } from '@angular/core';
import {
	Auth,
	User as FirebaseUser,
	UserCredential,
	authState,
	signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	BehaviorSubject,
	Observable,
	catchError,
	first,
	from,
	map,
	of,
	switchMap,
} from 'rxjs';
import { FireStoreCollection } from '../enums';
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
					return !!user ? this.getUserByFireBaseUser(user) : of(null);
				}),
				catchError((error) => {
					console.log(error);
					return of(null);
				})
			)
			.subscribe(async (user: User | null) => {
				if (!!user) {
					console.log('user logged in', user);
				} else {
					console.log('user logged out', user);
				}
				this.user.next(user);
			});
	}

	getCurrentFireBaseUser(): FirebaseUser | null {
		return this.auth.currentUser;
	}

	getUserByFireBaseUser = (
		user: FirebaseUser
	): Observable<User | null> => {
		return this.afs
			.collection<User>(FireStoreCollection.USERS, (ref) =>
				ref
					.where('uid', '==', user.uid)
					.where('isActivated', '==', true)
					.where('isDeleted', '==', false)
			)
			.snapshotChanges()
			.pipe(
				map((user) =>
					!!user[0] ? User.fromFireStore(user[0]) : null
				),
				catchError((error) => {
					console.log(error);
					return of(null);
				}),
				first()
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
