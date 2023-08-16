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
	): Permission | null => {
		if (!obj['id'] || !obj['name'] || !obj['description'])
			return null;

		return new Permission(obj['id'], obj['name'], obj['description']);
	};

	public static fromCollection = (
		collection: Array<Record<string, any>>
	): Array<Permission> => {
		return collection
			.map((permission) => Permission.fromObject(permission))
			.filter((s): s is Permission => Boolean(s));
	};
}
