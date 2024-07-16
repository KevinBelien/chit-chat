import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'chit-chat/src/lib/auth';
import { ButtonComponent } from 'chit-chat/src/lib/components/button';
import { EmojiPickerComponent } from 'chit-chat/src/lib/components/emoji-picker';
import { SplitPaneComponent } from 'chit-chat/src/lib/components/split-pane';
import { ConversationContext } from 'chit-chat/src/lib/conversations';
import { ChatComponent } from 'chit-chat/src/lib/layouts/chat';
import {
	MenuComponent,
	MenuItem,
} from 'chit-chat/src/lib/layouts/menu';
import { User } from 'chit-chat/src/lib/users';
import { SmartDatePipe } from 'chit-chat/src/lib/utils';

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
		EmojiPickerComponent,
		SmartDatePipe,
		ButtonComponent,
	],

	templateUrl: './chit-chat.component.html',
	styleUrls: ['./chit-chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChitChatComponent {
	@ViewChild(MenuComponent)
	menuComponent?: MenuComponent;

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

	conversationContext: ConversationContext | null = null;

	isSplitPaneSplitted: boolean = false;

	constructor(private authService: AuthService) {}

	protected handleUserClicked = (user: User) => {
		const loggedinUser = this.authService.getCurrentUser();

		if (
			(!!this.conversationContext &&
				!this.conversationContext.isGroup &&
				this.conversationContext.user.uid === user.uid) ||
			!loggedinUser
		)
			return;

		this.conversationContext = {
			isGroup: false,
			user: user,
			participantIds: [loggedinUser.userInfo.uid, user.uid],
		};
		this.sidePaneVisible = false;
	};

	protected handleSplittedChanged = (e: {
		breakPoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		value: boolean;
	}) => {
		this.isSplitPaneSplitted = e.value;
	};

	protected handleBackButtonClicked = () => {
		this.menuComponent?.resetSelections();
		this.sidePaneVisible = true;
		this.conversationContext = null;
	};
}
