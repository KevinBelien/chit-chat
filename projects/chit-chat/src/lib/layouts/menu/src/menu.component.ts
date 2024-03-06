import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	TabComponent,
	TabsComponent,
} from 'chit-chat/src/lib/components/tabs';
import { UsersListComponent } from 'chit-chat/src/lib/components/users-list';
import { User } from 'chit-chat/src/lib/users';
import { MenuHeaderComponent } from '../menu-header/menu-header.component';
import { MenuItem, menuItems } from './../types/menu-item.type';

@Component({
	selector: 'ch-menu',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		TabsComponent,
		TabComponent,
		MenuHeaderComponent,
		UsersListComponent,
	],
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class MenuComponent {
	@Input()
	menuItems: MenuItem[] = [...menuItems];

	@Input()
	animationsEnabled: boolean = false;

	@Input()
	selectedIndex: number = 0;

	@Output()
	onUserClicked = new EventEmitter<User>();

	selectedUser: User | null = null;

	constructor() {} //

	protected handleTabChanged = (e: {
		component: TabComponent;
		currentIndex: number;
	}) => {
		this.selectedIndex = e.currentIndex;
	};

	protected handleUserClick = (user: User) => {
		this.selectedUser = user;
		this.onUserClicked.emit(user);
	};
}
