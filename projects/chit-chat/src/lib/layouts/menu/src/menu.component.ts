import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	TabComponent,
	TabsComponent,
} from 'chit-chat/src/lib/components/tabs';
import { UsersListComponent } from 'chit-chat/src/lib/components/users-list';
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
})
export class MenuComponent {
	@Input()
	menuItems: MenuItem[] = menuItems;

	@Input()
	selectedIndex: number = 0;

	constructor() {}

	onTabChanged = (e: {
		component: TabComponent;
		currentIndex: number;
	}) => {
		this.selectedIndex = e.currentIndex;
	};
}
