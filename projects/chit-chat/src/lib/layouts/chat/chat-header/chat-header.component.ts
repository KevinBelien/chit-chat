import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { ConversationContext } from 'chit-chat/src/lib/conversations';

@Component({
	selector: 'ch-chat-header',
	standalone: true,
	imports: [CommonModule, IonicModule, UserAvatarComponent],
	templateUrl: './chat-header.component.html',
	styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
	@Input()
	conversationContext: ConversationContext | null = null;

	@Input()
	backButtonEnabled: boolean = false;

	constructor() {}
}
