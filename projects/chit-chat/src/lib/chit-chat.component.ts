import { AfterViewInit, Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
	selector: 'chit-chat',
	template: ` <p>chit-chat works!</p> `,
	styles: [],
})
export class ChitChatComponent implements AfterViewInit {
	constructor(private test: ChatService) {
		this.test.fetch().subscribe((result: any) => {
			console.log('data', result);
		});
	}

	async ngAfterViewInit() {}
}
