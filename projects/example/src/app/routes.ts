import { Routes } from '@angular/router';
import { ChitChatModule } from './../../../chit-chat/src/lib/chit-chat.module';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('../../../chit-chat/src/lib/chit-chat.component').then(m => ChitChatModule)
	},
	{
		path: 'home',
		loadComponent: () =>
			import('./pages/home/home.component').then(
				(c) => c.HomeComponent
			),
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: 'home',
	},
];
