import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SplitPaneComponent } from 'chit-chat/src/lib/components/split-pane';
import { MenuComponent } from 'chit-chat/src/lib/layouts/menu';
import { User } from 'chit-chat/src/lib/users';
import { ScreenService } from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-chit-chat',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		MenuComponent,
		SplitPaneComponent,
	],
	templateUrl: './chit-chat.component.html',
	styleUrls: ['./chit-chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChitChatComponent {
	sidePaneVisible: boolean = true;

	isSmallScreen: boolean = false;

	constructor(private screenService: ScreenService) {
		this.isSmallScreen = this.screenService.sizes['sm'];

		this.screenService.breakPointChanged.subscribe(() => {
			this.isSmallScreen = this.screenService.sizes['sm'];
		});
	}

	onUserClicked = (user: User) => {
		console.log('user clicked', user);
		this.sidePaneVisible = false;
	};
}
