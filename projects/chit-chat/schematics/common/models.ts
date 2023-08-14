export interface Workspace {
	projects: { [name: string]: Project };
	defaultProject: string;
}

export interface Project {
	[x: string]: any;
	architect: {
		build?: any;
		serve?: any;
	};
	schematics?: any;
	sourceRoot?: string;
	root?: string;
}

export interface PackageJson {
	dependencies?: any;
	devDependencies?: any;
}
