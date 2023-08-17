import { DtoUserRole } from './userRole.dto';

export interface DtoPermission {
	name: string;
	description: string;
	role: DtoUserRole & { id: string };
}
