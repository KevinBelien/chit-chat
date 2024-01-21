import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChatComponent } from 'chit-chat/src/lib/components/chat';
import { SplitPaneComponent } from 'chit-chat/src/lib/components/split-pane';
import {
	MenuComponent,
	MenuItem,
} from 'chit-chat/src/lib/layouts/menu';
import { User } from 'chit-chat/src/lib/users';
import { ScreenService } from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-chit-chat',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		MenuComponent,
		ChatComponent,
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
	@Input()
	menuItems: MenuItem[] = [
		'chats',
		'users',
		'groups',
		'calls',
		'settings',
	];
	sidePaneVisible: boolean = true;

	isSmallScreen: boolean = false;

	chatContext: { isGroup: boolean; participantId: string } | null =
		null;

	constructor(private screenService: ScreenService) {
		this.isSmallScreen = this.screenService.sizes['sm'];

		this.screenService.breakPointChanged.subscribe(() => {
			this.isSmallScreen = this.screenService.sizes['sm'];
		});
	}

	onUserClicked = (user: User) => {
		this.chatContext = { isGroup: false, participantId: user.uid };
		this.sidePaneVisible = false;
	};
}
