import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Message } from 'chit-chat/src/lib/messages';

@Component({
	selector: 'ch-message-bubble',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IonicModule],
	templateUrl: './message-bubble.component.html',
	styleUrl: './message-bubble.component.scss',
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element ch-message-bubble-element',
	},
})
export class MessageBubbleComponent {
	@Input()
	message?: Message | null;

	@Input()
	maxWidth: number | string = '100%';

	@Input()
	cssClass?: string | string[];

	constructor() {}
}
