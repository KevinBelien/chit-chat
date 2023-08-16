import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { UserStatus, userStatuses } from '../types';
import { UserRole } from './user-role.model';

export class User {
	uid: string;
	name: string;
	role: UserRole;
	creationDate: Date;
	avatar: string | null;
	onlineStatus: UserStatus;
	isActivated: boolean;

	constructor(
		uid: string,
		name: string,
		role: UserRole,
		creationDate: Date,
		avatar: string | null,
		onlineStatus: UserStatus,
		isActivated: boolean
	) {
		this.uid = uid;
		this.name = name;
		this.role = role;
		this.creationDate = creationDate;
		this.avatar = avatar;
		this.onlineStatus = onlineStatus;
		this.isActivated = isActivated;
	}

	public static fromDocumentChange = (
		obj: DocumentChangeAction<User>
	): User | null => {
		const uid = obj.payload.doc.id;
		const data = obj.payload.doc.data();
		const role = UserRole.fromObject(data.role);

		if (!User.isUserValid(uid, data, role)) return null;

		const avatar = !!data['avatar'] ? data['avatar'] : null;
		const isActivated = !!data['isActivated']
			? data['isActivated']
			: false;

		return new User(
			uid,
			data['name'],
			role!,
			data['creationDate'],
			avatar,
			data['onlineStatus'],
			isActivated
		);
	};

	public static fromObject = (obj: Record<string, any>) => {
		const role = UserRole.fromObject(obj['role']);

		if (!User.isUserValid(obj['uid'], obj, role)) return null;

		const avatar = !!obj['avatar'] ? obj['avatar'] : null;

		const isActivated = !!obj['isActivated']
			? obj['isActivated']
			: false;

		return new User(
			obj['uid'],
			obj['name'],
			role!,
			obj['creationDate'],
			avatar,
			obj['onlineStatus'],
			isActivated
		);
	};

	public static fromCollection = (
		collection: Record<string, any>[]
	): User[] => {
		return collection
			.map((user) => User.fromObject(user))
			.filter((s): s is User => Boolean(s));
	};

	public static isUserValid = (
		uid: string,
		data: Record<string, any>,
		role: UserRole | null
	) => {
		if (
			uid ||
			!data['name'] ||
			!data['creationDate'] ||
			!role ||
			!userStatuses.includes(data['onlineStatus'])
		) {
			return false;
		}

		return true;
	};
}
