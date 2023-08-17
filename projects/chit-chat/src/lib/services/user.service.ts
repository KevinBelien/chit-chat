import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	collection,
	doc,
	getFirestore,
	setDoc,
} from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { LibConfig, LibConfigService } from '../chit-chat.module';
import { FireStoreCollection } from '../enums';
import {
	FsPermission,
	FsUserRole,
} from '../interfaces/fs-collections';
import { User } from '../models';
import { UserStatus } from './../types/user-status.type';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(
		@Inject(LibConfigService) private config: LibConfig,
		private afs: AngularFirestore
	) {
		// this.createUser(
		// 	new User(
		// 		'Test-1234',
		// 		'Test again',
		// 		new UserRole('test-role', 'test role', Date.now(), []),
		// 		new Date(),
		// 		null,
		// 		'available',
		// 		true
		// 	)
		// );
	}

	getUsers = () => {
		return this.afs
			.collection<User>(FireStoreCollection.USERS)
			.snapshotChanges()
			.pipe(
				map((changes) =>
					changes.map((c) => ({
						key: c.payload.doc.id,
						...(c.payload.doc.data() as any),
					}))
				)
			);
	};

	setUserStatus = async (
		documentID: string,
		status: UserStatus
	): Promise<void> => {
		return this.afs
			.collection(FireStoreCollection.USERS)
			.doc(documentID)
			.update({ onlineStatus: status });
	};

	createUser = async (data: User): Promise<void> => {
		const fireStore = getFirestore();
		const usersRef = collection(fireStore, FireStoreCollection.USERS);

		try {
			return await setDoc(
				doc(usersRef, data.uid),
				JSON.parse(JSON.stringify(data))
			);
		} catch (e: any) {
			throw Error(
				`Something went wrong when creating user with uid ${data.uid}. ${e}`
			);
		}
	};

	getPermissions = (roleId: string): Observable<FsPermission[]> => {
		const query = this.afs
			.collection<FsUserRole>(FireStoreCollection.ROLES)
			.doc(roleId)
			.collection<FsPermission>(FireStoreCollection.PERMISSIONS);
		return query
			.get()
			.pipe(
				map((data) =>
					data.docs.map((doc) =>
						Object.assign(doc.data(), { id: doc.ref.id })
					)
				)
			);
	};
}
