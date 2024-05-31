import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { emojis, groupedEmojis } from './data';
import { Emoji, GroupedEmoji } from './interfaces';

@Component({
	selector: 'ch-emoji-picker',
	standalone: true,
	imports: [CommonModule, ScrollingModule, IonicModule],
	templateUrl: './emoji-picker.component.html',
	styleUrl: './emoji-picker.component.scss',
})
export class EmojiPickerComponent {
	emojis: Emoji[] = emojis as Emoji[];
	groupedEmojis: GroupedEmoji[] = groupedEmojis as GroupedEmoji[];

	constructor() {
		console.log(this.findDuplicates(emojis, 'name'));
	}

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
}
