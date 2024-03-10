import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessageBoardComponent } from 'chit-chat/src/lib/components/message-board';
import { MessageInputComponent } from 'chit-chat/src/lib/components/message-input';
import { ConversationContext } from 'chit-chat/src/lib/conversations';
import { ChatHeaderComponent } from './chat-header/chat-header.component';

@Component({
	selector: 'ch-chat',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		MessageBoardComponent,
		MessageInputComponent,
		ChatHeaderComponent,
	],
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChatComponent implements OnInit {
	@Input()
	conversationContext: ConversationContext | null = null;

	@Input()
	maxWidth: number = 900;

	@Input()
	backButtonEnabled: boolean = false;

	@Output()
	onBackButtonClicked = new EventEmitter<void>();

	constructor() {}

	ngOnInit(): void {}

	protected handleBackButtonClicked = () => {
		this.onBackButtonClicked.emit();
	};
}
