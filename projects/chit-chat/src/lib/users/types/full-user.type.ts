import { User, UserRole } from '../models';

export type FullUser = {
	userInfo: User;
	role: UserRole;
};
