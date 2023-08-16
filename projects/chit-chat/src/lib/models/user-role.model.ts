import { Permission } from './permission.model';

export class UserRole {
	id: string;
	name: string;
	description?: string;
	creationDateMs: number;
	permissions: Array<Permission>;

	constructor(
		id: string,
		name: string,
		creationDateMs: number,
		permissions: Array<Permission>,
		description?: string
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.creationDateMs = creationDateMs;
		this.permissions = permissions;
	}

	public static fromObject = (
		obj: Record<string, any>
	): UserRole | null => {
		if (!obj['id'] || !obj['name'] || !obj['creationDateMs'])
			return null;

		const permissions = !!obj['permissions']
			? Permission.fromCollection(obj['permissions'])
			: [];

		return new UserRole(
			obj['id'],
			obj['name'],
			obj['creationDateMs'],
			permissions,
			obj['description']
		);
	};
}
