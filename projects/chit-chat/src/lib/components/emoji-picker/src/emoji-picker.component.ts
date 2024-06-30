import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { emojis, groupedEmojis } from './data';
import { Emoji, EmojiCategory, GroupedEmoji } from './interfaces';

@Component({
	selector: 'ch-emoji-picker',
	standalone: true,
	imports: [CommonModule, IonicModule, ScrollingModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './emoji-picker.component.html',
	styleUrl: './emoji-picker.component.scss',
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class EmojiPickerComponent
	implements AfterViewInit, OnDestroy, OnChanges
{
	@ViewChild(CdkVirtualScrollViewport, { static: false })
	viewport?: CdkVirtualScrollViewport;

	@Input()
	emojiSize: 'xs' | 'sm' | 'default' | 'lg' | 'xl' = 'default';

	emojiSizeInPx: number;

	@Input()
	height: number = 400;

	@Input()
	width: number = 250;

	@HostBinding('style.--item-size-multiplier')
	itemSizeMultiplier: number = 1.5;

	itemSize: number;

	emojis: Emoji[] = emojis as Emoji[];
	groupedEmojis: GroupedEmoji[] = groupedEmojis as GroupedEmoji[];

	currentCategory: EmojiCategory;

	scrollIndex: number = 0;

	rows: EmojiPickerRow[];

	destroy$ = new Subject<boolean>();

	@HostBinding('style.--sp-offset') spo: string = '0px';

	@HostBinding('style.--emoji-size')
	emoSize: string;

	@HostBinding('style.--picker-height')
	pickerHeight: string = `${this.height}px`;

	@HostBinding('style.--picker-width')
	pickerWidth: string = `${this.width}px`;

	constructor() {
		this.emojiSizeInPx = this.calculateEmojiSize();

		this.itemSize = this.emojiSizeInPx * this.itemSizeMultiplier;
		this.emoSize = `${this.emojiSizeInPx}px`;

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

	ngOnDestroy() {
		this.destroy$.next(true);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['emojiSize']) {
			this.emojiSizeInPx = this.calculateEmojiSize();

			this.emoSize = `${this.emojiSizeInPx}px`;
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

	private calculateEmojiSize = () => {
		const viewportWidth = this.getViewportWidth();
		const averageSize = this.getAverageSize();
		const maxEmojisPerRow =
			this.calculateAmountEmojiInRows(averageSize);

		console.log(maxEmojisPerRow);
		console.log('viewportwidth', viewportWidth);
		console.log(viewportWidth / maxEmojisPerRow);
		return (
			viewportWidth / (maxEmojisPerRow * this.itemSizeMultiplier)
		);
	};

	private getAverageSize = () => {
		switch (this.emojiSize) {
			case 'xs':
				return 16;
			case 'sm':
				return 20;
			case 'lg':
				return 28;
			case 'xl':
				return 32;
			default:
				return 24;
		}
	};

	findDuplicates = (arr: any[], key: string): any[] => {
		const seenKeys = new Set<string>();
		const duplicates: any[] = [];

		for (const item of arr) {
			const keyValue = item[key];

			if (seenKeys.has(keyValue)) {
				console.log(keyValue);
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
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll'; // forcing scrollbar to appear
		document.body.appendChild(outer);

		const inner = document.createElement('div');
		outer.appendChild(inner);

		const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

		outer.parentNode!.removeChild(outer);

		return scrollbarWidth;
	}
}

type EmojiPickerRow =
	| {
			type: 'category';
			value: EmojiCategory | Emoji[];
	  }
	| { type: 'emoji'; value: Emoji[] };
