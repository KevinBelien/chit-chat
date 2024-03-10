import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserAvatarComponent } from 'chit-chat/src/lib/components/user-avatar';
import { ConversationContext } from 'chit-chat/src/lib/conversations';

@Component({
	selector: 'ch-chat-header',
	standalone: true,
	imports: [CommonModule, IonicModule, UserAvatarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './chat-header.component.html',
	styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
	@Input()
	conversationContext: ConversationContext | null = null;

	@Input()
	backButtonEnabled: boolean = false;

	@Output()
	onBackButtonClicked = new EventEmitter<void>();

	constructor() {}

	protected handleBackButtonClicked = () => {
		this.onBackButtonClicked.emit();
	};
}
