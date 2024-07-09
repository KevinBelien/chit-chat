import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
} from '@angular/core';
import { Emoji } from '../../interfaces';

@Component({
	selector: 'ch-emoji-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './emoji-button.component.html',
	styleUrl: './emoji-button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class EmojiButtonComponent {
	@Input()
	emoji?: Emoji;

	private touchHoldTriggered: boolean = false;

	constructor() {}

	protected handleEmojiClick = (e: MouseEvent, emoji: Emoji) => {
		if (this.touchHoldTriggered) {
			this.touchHoldTriggered = false;

			return;
		}
	};
}
