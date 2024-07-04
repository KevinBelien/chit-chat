import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	TouchHoldDirective,
	TouchHoldEvent,
} from 'chit-chat/src/lib/utils';
import {
	Emoji,
	EmojiClickEvent,
	EmojiTouchHoldEvent,
} from '../../interfaces';

@Component({
	selector: 'ch-emoji-button',
	standalone: true,
	imports: [CommonModule, TouchHoldDirective],
	templateUrl: './emoji-button.component.html',
	styleUrl: './emoji-button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiButtonComponent implements OnChanges {
	@Input()
	emoji?: Emoji;

	@Input()
	emojiSize: number = 24;

	private touchHoldTriggered: boolean = false;

	@Output()
	onTouchHold = new EventEmitter<EmojiTouchHoldEvent>();

	@Output()
	onClick = new EventEmitter<EmojiClickEvent>();

	@HostBinding('style.--emoji-size')
	emoSize: string = `${this.emojiSize}px`;

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['emojiSize']) {
			this.emoSize = `${changes['emojiSize'].currentValue}px`;
		}
	}

	handleEmojiClick = (e: MouseEvent, emoji: Emoji) => {
		if (this.touchHoldTriggered) {
			this.touchHoldTriggered = false;

			return;
		}

		this.onClick.emit({ event: e, emoji });
	};

	handleTouchHold = (e: TouchHoldEvent, emoji: Emoji) => {
		this.touchHoldTriggered =
			e.eventType === 'mouse' &&
			!!emoji.skinTones &&
			emoji.skinTones.length > 0;

		this.onTouchHold.emit({ event: e, emoji });
	};
}
