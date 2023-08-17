import { MapResult } from '../interfaces';
import { FsPermission, FsUser } from '../interfaces/fs-collections';
import { UserStatus, userStatuses } from '../types';
import { UserRole } from './user-role.model';

export class User implements Omit<FsUser, 'roleId'> {
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

	public static fromFs = (
		user: FsUser,
		permissions: FsPermission[]
	): MapResult<User> => {
		const mappedUserRole = UserRole.fromFsSubcollection(permissions);
		if (!!mappedUserRole.error)
			return { data: null, error: mappedUserRole.error };

		if (!User.isUserValid(user['uid'], user, mappedUserRole.data))
			return {
				data: null,
				error: new Error(
					`Mapping error: Couldn't map ${user} to a valid user object`
				),
			};

		const avatar = !!user['avatar'] ? user['avatar'] : null;

		const isActivated = !!user['isActivated']
			? user['isActivated']
			: false;

		return {
			data: new User(
				user['uid'],
				user['name'],
				mappedUserRole.data!,
				user['creationDate'],
				avatar,
				user['onlineStatus'],
				isActivated
			),
		};
	};

	public static isUserValid = (
		uid: string,
		data: Record<string, any>,
		role: UserRole | null
	) => {
		if (
			!uid ||
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
