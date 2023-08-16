import {
	SchematicsException,
	Tree,
} from '@angular-devkit/schematics';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import { PackageJson, Project, Workspace } from './models';

export function getWorkspace(tree: Tree): Workspace {
	if (!tree.exists('angular.json')) {
		throw new SchematicsException(
			'Could not find Angular workspace configuration'
		);
	}

	try {
		return JSON.parse(
			tree.read(`angular.json`)!.toString()
		) as Workspace;
	} catch (e) {
		throw new SchematicsException('Error parsing Workspace');
	}
}

export function getProject(
	workspace: Workspace,
	name: string
): Project {
	const projects = workspace.projects;

	if (!Object.keys(projects).includes(name)) {
		throw new SchematicsException('Project not found');
	}

	return projects[name];
}

export function getProjectSrcRoot(project: Project): string {
	return project.sourceRoot
		? `/${project.sourceRoot}`
		: `/${project.root}/src`;
}

export function getProjectStylesExt(project: Project) {
	if (
		project.schematics &&
		project.schematics['@schematics/angular:component']
	) {
		return (
			project.schematics['@schematics/angular:component'].style ||
			project.schematics['@schematics/angular:component'].styleext ||
			'css'
		);
	}
	return 'css';
}

export function getPackageJson(tree: Tree) {
	if (!tree.exists('package.json')) {
		throw new SchematicsException('package.json not found.');
	}

	try {
		return JSON.parse(
			tree.read('package.json')!.toString()
		) as PackageJson;
	} catch (e) {
		throw new SchematicsException('Error parsing packageJson');
	}
}

export function addImport(
	sourceFile: ts.SourceFile,
	tree: Tree,
	filePath: string,
	symbolName: string,
	moduleName: string
): void {
	const change = insertImport(
		sourceFile,
		filePath,
		symbolName,
		moduleName
	);

	if (change) {
		const recorder = tree.beginUpdate(filePath);
		applyToUpdateRecorder(recorder, [change]);
		tree.commitUpdate(recorder);
	}
}
