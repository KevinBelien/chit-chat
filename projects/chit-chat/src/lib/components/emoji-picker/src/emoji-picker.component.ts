import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	OnChanges,
	OnInit,
	Renderer2,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { HorizontalEmojiPickerComponent } from './components/horizontal-emoji-picker/horizontal-emoji-picker.component';
import { EmojiSizeKey } from './enums/emoji-size.enum';

@Component({
	selector: 'ch-emoji-picker',
	standalone: true,
	imports: [CommonModule, HorizontalEmojiPickerComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './emoji-picker.component.html',
	styleUrl: './emoji-picker.component.scss',
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class EmojiPickerComponent implements OnInit, OnChanges {
	@ViewChild(CdkVirtualScrollViewport, { static: false })
	viewport?: CdkVirtualScrollViewport;

	@Input()
	emojiSize: EmojiSizeKey = 'default';

	@Input()
	height: number = 400;

	@Input()
	width: number = 250;

	@Input()
	scrollbarVisible: boolean = true;

	@HostBinding('style.--picker-height')
	pickerHeight: string = `${this.height}px`;

	@HostBinding('style.--picker-width')
	pickerWidth: string = `${this.width}px`;

	constructor(private renderer: Renderer2) {}

	ngOnInit(): void {
		this.loadCountryFlagEmojiPolyfill();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['height']) {
			this.pickerHeight = `${this.height}px`;
		}
		if (changes['width']) {
			this.pickerWidth = `${this.width}px`;
		}
	}

	//add polyfill script to support flag emojis for windows users
	private loadCountryFlagEmojiPolyfill() {
		const script = this.renderer.createElement('script');
		script.type = 'module';
		script.defer = true;
		script.text = `
      import { polyfillCountryFlagEmojis } from 'https://cdn.skypack.dev/country-flag-emoji-polyfill';
      polyfillCountryFlagEmojis();
    `;
		this.renderer.appendChild(document.body, script);
	}
}
