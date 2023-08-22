import { MapResult } from 'chit-chat/src/lib/utils';
import { DtoUser } from '../dto';
import { UserStatus, userStatuses } from '../types';
import { UserRole } from './';

export class User implements Omit<DtoUser, 'roleId'> {
	uid: string;
	name: string;
	role: UserRole;
	creationDateMs: number;
	avatar: string | null;
	onlineStatus: UserStatus;
	color: string;
	isActivated: boolean;

	constructor(
		uid: string,
		name: string,
		role: UserRole,
		creationDateMs: number,
		avatar: string | null,
		onlineStatus: UserStatus,
		color: string,

		isActivated: boolean
	) {
		this.uid = uid;
		this.name = name;
		this.role = role;
		this.creationDateMs = creationDateMs;
		this.avatar = avatar;
		this.onlineStatus = onlineStatus;
		this.color = color;
		this.isActivated = isActivated;
	}

	public static fromDto = (
		dto: DtoUser,
		userRole: MapResult<UserRole>
	): MapResult<User> => {
		if (!!userRole.error)
			return { data: null, error: userRole.error };

		if (!User.isValid(dto.uid, dto, userRole.data))
			return {
				data: null,
				error: new Error(
					`Mapping error: Couldn't map ${dto} to a valid user object\n${JSON.stringify(
						dto
					)}`
				),
			};

		const avatar = !!dto.avatar ? dto.avatar : null;
		const isActivated = !!dto.isActivated ? dto.isActivated : false;
		console.log(dto.onlineStatus);
		return {
			data: new User(
				dto.uid,
				dto.name,
				userRole.data!,
				dto.creationDateMs,
				avatar,
				dto.onlineStatus,
				dto.color,
				isActivated
			),
		};
	};

	public static isValid = (
		uid: string,
		data: Record<string, any>,
		role: UserRole | null
	): boolean => {
		if (
			!uid ||
			!data['name'] ||
			!data['creationDateMs'] ||
			!role ||
			!userStatuses.includes(data['onlineStatus'])
		) {
			return false;
		}

		return true;
	};
}
