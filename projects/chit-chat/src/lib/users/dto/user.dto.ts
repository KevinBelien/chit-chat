export interface DtoUser {
	uid: string;
	name: string;
	roleId: string;
	creationDateMs: number;
	avatar: string | null;
	onlineStatus: string;
	color: string | null;
	isActivated: boolean;
}
