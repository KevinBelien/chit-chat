import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { UserStatus, userStatuses } from '../types';
import { UserRole } from './user-role.model';

export class User {
	uid: string;
	role: UserRole;
	creationDate: Date;
	avatar: string | null;
	onlineStatus: UserStatus;
	isActivated: boolean;
	isDeleted: boolean;

	constructor(
		uid: string,
		role: UserRole,
		creationDate: Date,
		avatar: string | null,
		onlineStatus: UserStatus,
		isActivated: boolean,
		isDeleted: boolean
	) {
		this.uid = uid;
		this.role = role;
		this.creationDate = creationDate;
		this.avatar = avatar;
		this.onlineStatus = onlineStatus;
		this.isActivated = isActivated;
		this.isDeleted = isDeleted;
	}

	public static fromFireStore = (
		obj: DocumentChangeAction<User>
	): User | null => {
		const uid = obj.payload.doc.id;
		const data = obj.payload.doc.data();
		const role = UserRole.fromObject(data.role);
		console.log(data);

		if (
			!uid ||
			!data['creationDate'] ||
			!role ||
			!userStatuses.includes(data.onlineStatus)
		) {
			return null;
		}

		const avatar = !!data['avatar'] ? data['avatar'] : null;
		const isActivated = !!data['isActivated']
			? data['isActivated']
			: false;
		const isDeleted = !!data['isDeleted'] ? data['isDeleted'] : false;

		return new User(
			uid,
			role,
			data['creationDate'],
			avatar,
			data['onlineStatus'],
			isActivated,
			isDeleted
		);
	};
}
