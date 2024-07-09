import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	Input,
	OnChanges,
	OnDestroy,
	Renderer2,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { groupedEmojis, mappedEmojis } from '../../data';
import { EmojiSize, EmojiSizeKey } from '../../enums';
import {
	Emoji,
	EmojiCategory,
	EmojiPickerRow,
	GroupedEmoji,
} from '../../interfaces';
import { EmojiButtonComponent } from '../emoji-button/emoji-button.component';

import {
	ClickTouchHoldDirective,
	ClickTouchHoldEvent,
} from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-horizontal-emoji-picker',
	standalone: true,
	imports: [
		CommonModule,
		ScrollingModule,
		ClickTouchHoldDirective,
		EmojiButtonComponent,
	],
	templateUrl: './horizontal-emoji-picker.component.html',
	styleUrl: './horizontal-emoji-picker.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class HorizontalEmojiPickerComponent
	implements AfterViewInit, OnDestroy, OnChanges
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

	mappedEmojis: Map<string, Emoji> = mappedEmojis;
	groupedEmojis: GroupedEmoji[] = groupedEmojis;

	currentCategory: EmojiCategory;

	scrollIndex: number = 0;

	rows: EmojiPickerRow[];

	destroy$ = new Subject<void>();

	@HostBinding('style.--sp-offset') spo: string = '0px';

	@HostBinding('style.--emoji-size')
	emoSize?: string;

	private touchHoldEventActive: boolean = false;

	constructor(private renderer: Renderer2, private el: ElementRef) {
		this.emojiSizeInPx = this.calculateEmojiSize();
		this.emoSize = `${this.emojiSizeInPx}px`;

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
			this.emoSize = `${this.emojiSizeInPx}px`;
			this.itemSize = this.emojiSizeInPx * this.itemSizeMultiplier;
			this.rows = this.calculateEmojiRows();
		}

		if (changes['width']) {
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

	// private initEventListeners() {
	// 	// Handle mouse down events
	// 	console.log(this.el.nativeElement);
	// 	this.renderer.listen(
	// 		this.el.nativeElement,
	// 		'mousedown',
	// 		(event) => {
	// 			this.handlePointerDown(event);
	// 		}
	// 	);

	// 	// Handle touch start events
	// 	this.renderer.listen(
	// 		this.el.nativeElement,
	// 		'touchstart',
	// 		(event) => {
	// 			this.handlePointerUp(event);
	// 		}
	// 	);
	// }

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
			rows.push({
				id: crypto.randomUUID(),
				type: 'category',
				value: group.category,
			});

			// Add the emojis in rows with a max of maxEmojisPerRow
			for (let i = 0; i < group.emojis.length; i += maxEmojisPerRow) {
				rows.push({
					id: crypto.randomUUID(),
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

	trackEmojiRow = (index: number, row: EmojiPickerRow) => {
		return row.id;
	};

	trackEmoji = (index: number, data: any) => {
		return data.value;
	};

	// protected handleEmojiClick = (e: MouseEvent, emoji: Emoji) => {
	// 	if (!!this.activeTouchHoldEvent) {
	// 		this.onEmojiTouchHold.emit({
	// 			event: this.activeTouchHoldEvent,
	// 			emoji,
	// 		});
	// 		this.activeTouchHoldEvent = undefined;
	// 	}

	// 	if (
	// 		!this.activeTouchHoldEvent ||
	// 		(this.activeTouchHoldEvent === 'mouse' &&
	// 			!!emoji.skinTones &&
	// 			emoji.skinTones.length > 0)
	// 	)
	// 		this.onEmojiClick.emit({ event: e, emoji });
	// };

	handleTouchHold = (e: ClickTouchHoldEvent) => {
		this.touchHoldEventActive = true;

		if (!e.data) return;
		// Call the method to show the popover with the target element and the emoji
		console.log('gets to touchHold', mappedEmojis.get(e.data), e);
	};
	handleClick = (e: ClickTouchHoldEvent) => {
		if (!e.data) return;
		// Call the method to show the popover with the target element and the emoji
		console.log('gets to click', mappedEmojis.get(e.data), e);

		// console.log('pointer out', e);
	};
}
