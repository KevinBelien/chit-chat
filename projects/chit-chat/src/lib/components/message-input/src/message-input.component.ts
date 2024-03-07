import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { IonicModule } from '@ionic/angular';
import {
	KeysPressedDirective,
	ScreenService,
} from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-message-input',
	standalone: true,
	imports: [
		CommonModule,
		KeysPressedDirective,
		IonicModule,
		PickerComponent,
	],
	templateUrl: './message-input.component.html',
	styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent implements OnChanges {
	@ViewChild('messageInput') messageInput?: ElementRef;

	@Input()
	placeholder: string = 'Type a message';

	@Input()
	message: string | null = '';

	@Output()
	messageChange = new EventEmitter<string | null>();

	@Input()
	maxHeight: number = 150;

	@Output()
	onSend = new EventEmitter<string>();

	@Output()
	onInput = new EventEmitter<{
		event: Event;
		value: string | null;
		previousValue: string | null;
	}>();

	@Output()
	onKeyDown = new EventEmitter<{
		event: Event;
	}>();

	@Output()
	onPaste = new EventEmitter<{
		event: ClipboardEvent;
	}>();

	@Output()
	onCleared = new EventEmitter<{ previousValue: string | null }>();

	@Output()
	onMultipleKeysDown = new EventEmitter<{
		pressedKeys: Array<string>;
		triggeredKeyCombination: Array<string>;
	}>();

	readonly isNative: boolean = Capacitor.isNativePlatform();

	constructor(private screen: ScreenService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['message']) {
			setTimeout(() =>
				this.setMessage(changes['message'].currentValue)
			);
		}
	}

	focus = () => {
		this.messageInput?.nativeElement.focus();
	};

	protected handleInput = (e: Event) => {
		const previousMessage = this.message;
		this.message = (e.target as HTMLElement).textContent ?? '';
		if (this.message.length === 0) {
			this.clear();
		} else {
			this.messageChange.emit(this.message);
		}

		this.onInput.emit({
			event: e,
			value: this.message,
			previousValue: previousMessage,
		});
	};

	protected handleKeyDown = (e: KeyboardEvent) => {
		if (e.code === 'Enter') {
			e.preventDefault();
		}
		this.onKeyDown.emit({ event: e });
	};

	protected handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		this.onPaste.emit({ event: e });

		// Get pasted data via clipboard API
		const clipboardData = e.clipboardData;

		if (!clipboardData) return;
		const pastedText = clipboardData.getData('text');

		// Insert the value on cursor position
		this.insertTextAtCursor(pastedText);
	}

	insertTextAtCursor(text: string) {
		const sel = window.getSelection();
		if (sel) {
			const range = sel.getRangeAt(0);
			range.deleteContents();
			const textNode = document.createTextNode(text);
			range.insertNode(textNode);
			range.setStartAfter(textNode); // Move cursor to the end of the inserted text
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	clear = () => {
		if (!this.messageInput) return;
		const previousMessage = this.message;
		this.messageInput.nativeElement.textContent = '';
		this.message = '';
		this.messageChange.emit(this.message);
		this.onCleared.emit({ previousValue: this.message });
	};

	protected handleKeyCombinationPressed = ({
		pressedKeys,
		triggeredKeyCombination,
	}: {
		pressedKeys: Array<string>;
		triggeredKeyCombination: Array<string>;
	}) => {
		this.onMultipleKeysDown.emit({
			pressedKeys,
			triggeredKeyCombination,
		});
		const specialKeysRegExp = /^(control|alt|shift|meta)$/;
		const specialKeysPressed = pressedKeys.some((key) =>
			specialKeysRegExp.test(key)
		);

		if (
			!specialKeysPressed &&
			pressedKeys.includes('enter') &&
			!this.screen.isMobile()
		) {
			this.send();
		} else if (
			(specialKeysPressed && pressedKeys.includes('enter')) ||
			this.screen.isMobile()
		) {
			const selection: Selection | null = window.getSelection();
			if (!selection) return;

			const range: Range = selection.getRangeAt(0);
			const startOffset = range.startOffset;

			const parentNode = range.startContainer.parentNode;
			if (!parentNode) return;
			let offset = 0;
			let child = parentNode.firstChild;
			if (!!child) {
				while (child) {
					if (child === range.startContainer) {
						break;
					}

					if (
						child.nodeType === Node.TEXT_NODE &&
						child.textContent
					) {
						offset += child.textContent.length;
					}

					child = child.nextSibling;
				}
			}

			const finalStartOffset = offset + startOffset;

			// CREATE A DOUBLE LINE WHEN CURSOR IS AT END OF MESSAGE
			if (finalStartOffset === this.message?.length) {
				range.insertNode(document.createTextNode('\n'));
			}
			range.insertNode(document.createTextNode('\n'));

			selection.collapseToEnd();
		}
	};

	protected handleEmojiBtnClick = (e: Event) => {
		e.stopPropagation();
	};
	protected handleSubmitBtnClick = (e: Event) => {
		e.stopPropagation();

		this.send();
	};

	send = () => {
		if (
			!this.messageInput ||
			this.messageInput.nativeElement.textContent.length === 0
		)
			return;

		this.onSend.emit(this.messageInput.nativeElement.textContent);
		this.clear();
	};

	setMessage = (message: string) => {
		if (!!this.messageInput)
			this.messageInput.nativeElement.textContent = message;
	};

	protected handleEmojiSelect = (e: Record<string, any>) => {
		if (!this.messageInput) return;

		const startPos = this.messageInput.nativeElement.selectionStart;
		const endPos = this.messageInput.nativeElement.selectionEnd;
		const text = this.messageInput.nativeElement.textContent;
		if (!!endPos && endPos > 0) {
			this.messageInput.nativeElement.textContent =
				text.substring(0, startPos) +
				e['emoji'].native +
				text.substring(endPos, text.length);
		} else {
			this.messageInput.nativeElement.textContent +=
				e['emoji'].native;
		}
		this.message = this.messageInput.nativeElement.textContent;
		this.messageChange.emit(this.message);
	};
}
