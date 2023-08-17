export interface FsUser {
	uid: string;
	name: string;
	roleId: string;
	creationDate: Date;
	avatar: string | null;
	onlineStatus: string;
	isActivated: boolean;
}
