import { DtoUser } from '../dto';
import { MapResult } from '../interfaces';
import { UserStatus, userStatuses } from '../types';

export class ChatUser implements DtoUser {
	uid: string;
	name: string;
	roleId: string;
	creationDateMs: number;
	avatar: string | null;
	onlineStatus: UserStatus;
	isActivated: boolean;

	constructor(
		uid: string,
		name: string,
		roleId: string,
		creationDateMs: number,
		avatar: string | null,
		onlineStatus: UserStatus,
		isActivated: boolean
	) {
		this.uid = uid;
		this.name = name;
		this.roleId = roleId;
		this.creationDateMs = creationDateMs;
		this.avatar = avatar;
		this.onlineStatus = onlineStatus;
		this.isActivated = isActivated;
	}

	public static fromDto = (dto: DtoUser): MapResult<ChatUser> => {
		if (!ChatUser.isValid(dto.uid, dto))
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

		return {
			data: new ChatUser(
				dto.uid,
				dto.name,
				dto.roleId,
				dto.creationDateMs,
				avatar,
				dto.onlineStatus,
				isActivated
			),
		};
	};

	public static isValid = (
		uid: string,
		data: Record<string, any>
	): boolean => {
		if (
			!uid ||
			!data['name'] ||
			!data['creationDate'] ||
			!data['roleId'] ||
			!userStatuses.includes(data['onlineStatus'])
		) {
			return false;
		}

		return true;
	};
}
