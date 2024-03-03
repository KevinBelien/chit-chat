import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { IonicModule } from '@ionic/angular';
import { KeysPressedDirective } from 'chit-chat/src/lib/utils';

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
export class MessageInputComponent implements AfterViewInit {
	@ViewChild('messageInput') messageInput?: ElementRef;

	@Input()
	placeholder: string = 'Type a message';

	@Input()
	message: string | null = '';

	@Input()
	maxHeight: number = 150;

	@Output()
	onSend = new EventEmitter<string>();

	isNative: boolean = Capacitor.isNativePlatform();

	constructor() {}

	ngAfterViewInit(): void {}

	focus = () => {
		this.messageInput?.nativeElement.focus();
	};

	handleInput = (e: Event) => {
		this.message = (e.target as HTMLElement).textContent ?? '';
		if (this.message.length === 0) {
			this.clear();
		}
	};

	handleKeyDown = (e: KeyboardEvent) => {
		// console.log(e);
		if (e.code === 'Enter') {
			e.preventDefault();
		}
	};

	getTextAreaHeight = (component: HTMLTextAreaElement) => {
		if (parseInt(component.style.height) > this.maxHeight) {
			return `${this.maxHeight}px`;
		}
		return 'auto';
	};

	handlePaste(e: ClipboardEvent) {
		e.preventDefault();

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
		this.messageInput.nativeElement.textContent = '';
		this.message = '';
	};

	handleKeyCombinationPressed = ({
		pressedKeys,
		triggeredKeyCombination,
	}: {
		pressedKeys: Array<string>;
		triggeredKeyCombination: Array<string>;
	}) => {
		const specialKeysRegExp = /^(control|alt|shift|meta)$/;
		const specialKeysPressed = pressedKeys.some((key) =>
			specialKeysRegExp.test(key)
		);

		if (!specialKeysPressed && pressedKeys.includes('enter')) {
			//TODO: submit here as well
			this.send();
			// console.log(this.messageInput?.nativeElement.textContent);
		} else if (specialKeysPressed && pressedKeys.includes('enter')) {
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

	handleEmojiBtnClick = (e: Event) => {
		e.stopPropagation();
	};
	handleSubmitBtnClick = (e: Event) => {
		e.stopPropagation();

		this.send();
	};

	send = () => {
		if (!this.messageInput) return;

		this.onSend.emit(this.messageInput.nativeElement.textContent);
		this.clear();
	};

	handleEmojiSelect = (e: Record<string, any>) => {
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
	};
}
