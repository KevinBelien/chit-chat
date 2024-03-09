import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { SplitPaneComponent } from 'chit-chat/src/lib/components/split-pane';
import { ConversationContext } from 'chit-chat/src/lib/conversations';
import { ChatComponent } from 'chit-chat/src/lib/layouts/chat';
import {
	MenuComponent,
	MenuItem,
} from 'chit-chat/src/lib/layouts/menu';
import { User } from 'chit-chat/src/lib/users';
import {
	ScreenService,
	SmartDatePipe,
} from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-chit-chat',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		MenuComponent,
		ChatComponent,
		SplitPaneComponent,
		SmartDatePipe,
	],

	templateUrl: './chit-chat.component.html',
	styleUrls: ['./chit-chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChitChatComponent {
	currentDate = new Date();

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

	conversationContext: ConversationContext | null = null;

	constructor(
		private screenService: ScreenService,
		private authService: AuthService
	) {
		this.isSmallScreen = this.screenService.sizes['sm'];

		this.screenService.breakPointChanged.subscribe(() => {
			this.isSmallScreen = this.screenService.sizes['sm'];
		});
	}

	protected handleUserClicked = (user: User) => {
		// if (
		// 	!this.conversationContext ||
		// 	this.conversationContext.isGroup ||
		// 	this.conversationContext.participantIds !== user.uid
		// ) {
		// 	this.conversationContext = null;
		// 	this.conversationContext = { isGroup: false, participantId: user.uid };
		// }
		const loggedinUser = this.authService.getCurrentUser();

		if (!loggedinUser) return;

		this.conversationContext = {
			isGroup: false,
			user: user,
			participantIds: [loggedinUser.userInfo.uid, user.uid],
		};
		this.sidePaneVisible = false;
	};
}
