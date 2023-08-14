export interface AddSchema {
	/** Name of the project to target. */
	project: string;

	/** Dont add package.json dependencies. */
	skipDependencies: boolean;

	/** Dont run npm install. */
	skipNpmInstall: boolean;

	/** Dont add anything to angular.json style section. */
	skipStyles: boolean;
}
