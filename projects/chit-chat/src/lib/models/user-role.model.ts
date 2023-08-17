import { MapResult } from '../interfaces';
import { FsPermission } from '../interfaces/fs-collections';
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

	public static fromFsSubcollection = (
		permissions: FsPermission[]
	) => {
		const role = permissions.map((permission) => permission.role)[0];
		return UserRole.fromObject(
			Object.assign({}, role, { permissions: permissions })
		);
	};

	public static fromObject = (
		obj: Record<string, any>
	): MapResult<UserRole> => {
		if (!obj['id'] || !obj['name'] || !obj['creationDateMs'])
			return {
				data: null,
				error: new Error(
					`Mapping error: Couldn't map ${obj} to a valid UserRole object`
				),
			};

		const permissions = Permission.fromCollection(obj['permissions']);

		if (permissions.errors.length > 0)
			return { data: null, error: permissions.errors[0].error };

		return {
			data: new UserRole(
				obj['id'],
				obj['name'],
				obj['creationDateMs'],
				permissions.data,
				obj['description']
			),
		};
	};
}
