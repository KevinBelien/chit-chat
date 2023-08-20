import { Component } from '@angular/core';
import { AuthService } from 'chit-chat/src/lib/auth';

@Component({
	selector: 'chit-chat-conversation-list',
	templateUrl: './conversation-list.component.html',
	styleUrls: ['./conversation-list.component.scss'],
})
export class ConversationListComponent {
	constructor(private auth: AuthService) {
		setTimeout(() => console.log(this.auth.getCurrentUser()), 5000);
	}
}
