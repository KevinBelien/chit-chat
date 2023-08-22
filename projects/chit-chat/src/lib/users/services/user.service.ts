import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import {
	FireStoreCollection,
	MapResult,
} from 'chit-chat/src/lib/utils';

import {
	collection,
	doc,
	getFirestore,
	setDoc,
} from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { DtoPermission, DtoUser, DtoUserRole } from '../dto';
import { UserRole } from '../models';
import { UserStatus } from '../types';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private afs: AngularFirestore) {
		// const user: DtoUser = {
		// 	uid: 'zX3f1LIbs1XceEcOMKkIh9vMYkz1',
		// 	name: 'Test again',
		// 	roleId: 'admin',
		// 	creationDate: new Date(),
		// 	avatar: null,
		// 	onlineStatus: 'available',
		// 	isActivated: true,
		// };
		// this.createUser(user);
	}

	getUsers = () => {
		return this.afs
			.collection<DtoUser>(FireStoreCollection.USERS)
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

	createUser = async (data: DtoUser): Promise<void> => {
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

	getUserRoleWithPermissions = (
		roleId: string
	): Observable<MapResult<UserRole>> => {
		const query = this.afs
			.collection<DtoUserRole>(FireStoreCollection.ROLES)
			.doc(roleId)
			.collection<DtoPermission>(
				FireStoreCollection.ROLES_PERMISSIONS
			);
		return query.get().pipe(
			map((result) => {
				const permissions: (DtoPermission & { id: string })[] =
					result.docs.map((permission) =>
						Object.assign(permission.data(), {
							id: permission.ref.id,
						})
					);

				return UserRole.fromPermissionDto(permissions);
			})
		);
	};
}
