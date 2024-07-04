import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Renderer2,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EmojiButtonComponent } from './components/emoji-button/emoji-button.component';
import { emojis, groupedEmojis } from './data';
import { EmojiSize, EmojiSizeKey } from './enums/emoji-size.enum';
import {
	Emoji,
	EmojiCategory,
	EmojiClickEvent,
	EmojiPickerRow,
	EmojiTouchHoldEvent,
	GroupedEmoji,
} from './interfaces';

@Component({
	selector: 'ch-emoji-picker',
	standalone: true,
	imports: [CommonModule, ScrollingModule, EmojiButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './emoji-picker.component.html',
	styleUrl: './emoji-picker.component.scss',
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class EmojiPickerComponent
	implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
	@ViewChild(CdkVirtualScrollViewport, { static: false })
	viewport?: CdkVirtualScrollViewport;

	@Input()
	emojiSize: EmojiSizeKey = 'default';

	emojiSizeInPx: number;

	@Input()
	height: number = 400;

	@Input()
	width: number = 250;

	@Input()
	scrollbarVisible: boolean = true;

	@HostBinding('style.--item-size-multiplier')
	itemSizeMultiplier: number = 1.5;

	itemSize: number;

	emojis: Emoji[] = emojis as Emoji[];
	groupedEmojis: GroupedEmoji[] = groupedEmojis as GroupedEmoji[];

	currentCategory: EmojiCategory;

	scrollIndex: number = 0;

	rows: EmojiPickerRow[];

	destroy$ = new Subject<void>();

	@HostBinding('style.--sp-offset') spo: string = '0px';

	@HostBinding('style.--picker-height')
	pickerHeight: string = `${this.height}px`;

	@HostBinding('style.--picker-width')
	pickerWidth: string = `${this.width}px`;

	constructor(
		private renderer: Renderer2,
		private cd: ChangeDetectorRef
	) {
		this.emojiSizeInPx = this.calculateEmojiSize();

		this.itemSize = this.toFixedAndFloor(
			this.emojiSizeInPx * this.itemSizeMultiplier,
			2
		);

		this.rows = this.calculateEmojiRows();

		this.currentCategory =
			this.rows[0].type === 'emoji'
				? this.rows[0].value[0].category
				: (this.rows[0].value as EmojiCategory);
	}

	ngOnInit(): void {
		this.loadCountryFlagEmojiPolyfill();
	}

	ngAfterViewInit() {
		this.viewport?.renderedRangeStream
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.viewport?.checkViewportSize();

				this.spo =
					-(this.viewport?.getOffsetToRenderedContentStart() || 0) +
					'px';
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['emojiSize']) {
			this.emojiSizeInPx = this.calculateEmojiSize();
			this.itemSize = this.emojiSizeInPx * this.itemSizeMultiplier;
			this.rows = this.calculateEmojiRows();
		}

		if (changes['height']) {
			this.pickerHeight = `${this.height}px`;
		}
		if (changes['width']) {
			this.pickerWidth = `${this.width}px`;

			this.rows = this.calculateEmojiRows();

			this.currentCategory =
				this.rows[0].type === 'emoji'
					? this.rows[0].value[0].category
					: (this.rows[0].value as EmojiCategory);
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
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

	private calculateEmojiSize = () => {
		const viewportWidth = this.getViewportWidth();
		const idealEmojiSize = EmojiSize[this.emojiSize];
		const maxEmojisPerRow =
			this.calculateAmountEmojiInRows(idealEmojiSize);

		return this.toFixedAndFloor(
			viewportWidth / (maxEmojisPerRow * this.itemSizeMultiplier),
			2
		);
	};

	findDuplicates = (arr: any[], key: string): any[] => {
		const seenKeys = new Set<string>();
		const duplicates: any[] = [];

		for (const item of arr) {
			const keyValue = item[key];

			if (seenKeys.has(keyValue)) {
				duplicates.push(item);
			} else {
				seenKeys.add(keyValue);
			}
		}

		return duplicates;
	};

	handleScrolledIndexChanged = (index: number) => {
		this.scrollIndex = index;

		const previousRow = this.rows[index - 1];
		const currentRow = this.rows[index];

		if (!previousRow) {
			this.currentCategory =
				currentRow.type === 'emoji'
					? currentRow.value[0].category
					: (currentRow.value as EmojiCategory);
			return;
		}

		this.currentCategory =
			previousRow.type === 'emoji'
				? previousRow.value[0].category
				: (previousRow.value as EmojiCategory);
	};

	calculateEmojiRows = (): EmojiPickerRow[] => {
		const maxEmojisPerRow = this.calculateAmountEmojiInRows(
			this.emojiSizeInPx
		);

		const rows: EmojiPickerRow[] = [];

		groupedEmojis.forEach((group) => {
			// Add the category title as a row
			rows.push({ type: 'category', value: group.category });

			// Add the emojis in rows with a max of maxEmojisPerRow
			for (let i = 0; i < group.emojis.length; i += maxEmojisPerRow) {
				rows.push({
					type: 'emoji',
					value: group.emojis.slice(i, i + maxEmojisPerRow),
				});
			}
		});

		return rows;
	};

	private calculateAmountEmojiInRows = (emojiSize: number) => {
		const viewportWidth = this.getViewportWidth();

		return Math.floor(
			viewportWidth / (emojiSize * this.itemSizeMultiplier)
		);
	};

	getViewportWidth = () => {
		return this.width - this.getScrollbarWidth();
	};

	getScrollbarWidth(): number {
		return this.scrollbarVisible ? this.getGlobalScrollbarWidth() : 0;
	}

	private getGlobalScrollbarWidth = (): number => {
		const root = document.querySelector(':root') as HTMLElement;
		const scrollbarWidth = getComputedStyle(root).getPropertyValue(
			'--ch-scrollbar-width'
		);
		return parseFloat(scrollbarWidth.replace('px', '').trim());
	};

	private toFixedAndFloor = (value: number, decimals: number) => {
		const multiplier = Math.pow(10, decimals);
		const flooredValue = Math.floor(value * multiplier) / multiplier;

		return Number(flooredValue.toFixed(decimals));
	};

	trackEmojiRow = (index: number) => {
		return index;
	};

	trackEmoji = (index: number, data: any) => {
		return data.value;
	};

	handleEmojiClick = (e: EmojiClickEvent) => {
		console.log('on emoji click', e);
	};

	handleEmojiTouchHold = (e: EmojiTouchHoldEvent) => {
		console.log('on emoji hold', e);
	};
}
