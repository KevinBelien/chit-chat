import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
	selector: 'chit-chat',
	template: `<div><emoji-mart></emoji-mart></div>`,
	styles: [],
})
export class ChitChatComponent {
	constructor(private test: ChatService) {
		this.test.fetch().subscribe((result: any) => {
			console.log('data', result);
		});
	}
}
