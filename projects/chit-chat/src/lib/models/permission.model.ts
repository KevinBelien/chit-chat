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

	public static fromObject = (
		obj: Record<string, any>
	): MapResult<Permission> => {
		if (!obj['id'] || !obj['name'] || !obj['description'])
			return {
				data: null,
				error: new Error(
					`Mapping error: Couldn't map ${obj} to a valid Permission object`
				),
			};

		return {
			data: new Permission(
				obj['id'],
				obj['name'],
				obj['description']
			),
		};
	};

	public static fromCollection = (
		collection: Array<Record<string, any>>
	): MapResultCollection<Permission> => {
		const mapResult = collection.map((permission) =>
			Permission.fromObject(permission)
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
