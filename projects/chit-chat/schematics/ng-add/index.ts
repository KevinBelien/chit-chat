import {
	chain,
	noop,
	Rule,
	SchematicContext,
	SchematicsException,
	Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
	addSymbolToNgModuleMetadata,
	insertImport,
} from '@schematics/angular/utility/ast-utils';

import { applyToUpdateRecorder } from '@schematics/angular/utility/change';

import {
	addPackageJsonDependency,
	NodeDependency,
	NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

import * as ts from 'typescript';
import { Workspace } from '../common/models';
import { getWorkspace } from '../common/utils';
import { AddSchema } from './add-shema';

export function ngAdd(options: AddSchema): Rule {
	return (tree: Tree) => {
		const workspace = getWorkspace(tree);

		return chain([
			options.skipDependencies
				? noop()
				: addDependencies(options.skipNpmInstall),
			addImports(),
			options.skipStyles
				? noop()
				: addStyles(workspace, options.project),
		]);
	};
}

function addDependencies(skipInstall: boolean): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const dependencies: NodeDependency[] = [
			{
				type: NodeDependencyType.Default,
				version: '^7.6.1',
				name: '@angular/fire',
			},
			{
				type: NodeDependencyType.Default,
				version: '~9.2.0',
				name: '@ctrl/ngx-emoji-mart',
			},
		];
		dependencies.forEach((dependency) => {
			context.logger.log('info', dependency.name);
			addPackageJsonDependency(tree, dependency);
		});
		context.logger.log(
			'info',
			`✅️ Added ${dependencies.length} packages into dependencies section`
		);

		if (!skipInstall) {
			context.addTask(new NodePackageInstallTask());
			context.logger.log('info', `🔍 Installing packages...`);
		}

		return tree;
	};
}

function addStyles(workspace: Workspace, project: string): Rule {
	return (tree: Tree, context: SchematicContext) => {
		const styleEntries = [
			'node_modules/@ctrl/ngx-emoji-mart/picker.css',
		];

		const projectname =
			!!project && project !== 'projectName'
				? project
				: Object.keys(workspace.projects)[0];

		if (!projectname || !workspace.projects[projectname]) {
			throw Error(`Cant Find project by name ${projectname}`);
		}

		const styles: any[] =
			workspace.projects[projectname].architect['build']['options'][
				'styles'
			];

		styleEntries.reverse().forEach((path) => {
			if (styles.indexOf(path) === -1) {
				styles.unshift(path);
			}
		});

		context.logger.log('info', `✅️ Added styles into angular.json`);

		tree.overwrite(
			'angular.json',
			JSON.stringify(workspace, null, 2)
		);
	};
}

function addImports() {
	return (tree: Tree, context: SchematicContext) => {
		context.logger.info('Adding library Module to the app...');
		const modulePath = '/src/app/app.module.ts';
		if (!tree.exists(modulePath)) {
			throw new SchematicsException(
				`The file ${modulePath} doesn't exist`
			);
		}
		const recorder = tree.beginUpdate(modulePath);

		const text = tree.read(modulePath);
		if (text === null)
			throw new SchematicsException(
				`No content found in ${modulePath}`
			);

		const source = ts.createSourceFile(
			modulePath,
			text.toString(),
			ts.ScriptTarget.Latest,
			true
		);

		const headerImport = insertImport(
			source,
			modulePath,
			'ChitChatModule',
			'chit-chat'
		);

		const changes = [
			headerImport,
			...addSymbolToNgModuleMetadata(
				source,
				modulePath,
				'imports',
				'ChitChatModule.forRoot({firebaseConfig: environment.firebaseConfig})'
			),
		];

		applyToUpdateRecorder(recorder, changes);

		tree.commitUpdate(recorder);
		return tree;
	};
}
