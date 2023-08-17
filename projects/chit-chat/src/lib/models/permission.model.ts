import { DtoPermission } from '../dto';
import { MapResult, MapResultCollection } from '../interfaces';

export class Permission {
	id: string;
	name: string;
	description: string;

	constructor(id: string, name: string, description: string) {
		this.id = id;
		this.name = name;
		this.description = description;
	}

	public static fromDto = (
		id: string,
		obj: DtoPermission
	): MapResult<Permission> => {
		if (!obj.name || !obj.description)
			return {
				data: null,
				error: new Error(
					`Mapping error: Couldn't map ${obj} to a valid Permission object`
				),
			};

		return {
			data: new Permission(id, obj.name, obj.description),
		};
	};

	public static fromDtoCollection = (
		collection: (DtoPermission & { id: string })[]
	): MapResultCollection<Permission> => {
		const mapResult = collection.map((permission) =>
			Permission.fromDto(permission.id, permission)
		);

		const permissions = mapResult
			.map((result) => result.data)
			.filter((permission): permission is Permission =>
				Boolean(permission)
			);

		const errors = mapResult.filter((result) =>
			Boolean(result.error)
		);

		return { data: permissions, errors: errors };
	};
}
