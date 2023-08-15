import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { FireStoreCollection } from '../enums';
import { User } from '../models';
import { UserStatus } from './../types/user-status.type';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private afs: AngularFirestore) {}

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
}
