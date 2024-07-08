import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { TouchHoldEvent } from 'chit-chat/src/lib/utils';
import {
	Emoji,
	EmojiClickEvent,
	EmojiTouchHoldEvent,
} from '../../interfaces';

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

	@Output()
	onTouchHold = new EventEmitter<EmojiTouchHoldEvent>();

	@Output()
	onClick = new EventEmitter<EmojiClickEvent>();

	constructor() {}

	protected handleEmojiClick = (e: MouseEvent, emoji: Emoji) => {
		if (this.touchHoldTriggered) {
			this.touchHoldTriggered = false;

			return;
		}

		this.onClick.emit({ event: e, emoji });
	};

	protected handleTouchHold = (e: TouchHoldEvent, emoji: Emoji) => {
		this.touchHoldTriggered =
			e.eventType === 'mouse' &&
			!!emoji.skinTones &&
			emoji.skinTones.length > 0;

		this.onTouchHold.emit({ event: e, emoji });
	};
}
