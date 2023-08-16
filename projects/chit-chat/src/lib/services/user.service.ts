import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	collection,
	doc,
	getFirestore,
	setDoc,
} from 'firebase/firestore';
import { map } from 'rxjs';
import { LibConfig, LibConfigService } from '../chit-chat.module';
import { FireStoreCollection } from '../enums';
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
			.collection<User>('users')
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
}
