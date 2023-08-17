import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'chit-chat',
	template: `<div><emoji-mart></emoji-mart></div>`,
	styles: [],
})
export class ChitChatComponent {
	constructor(private test: AuthService) {}
}
