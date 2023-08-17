import { FsUserRole } from './fs-userRole.interface';

export interface FsPermission {
	id: string;
	name: string;
	description: string;
	role: FsUserRole;
}
