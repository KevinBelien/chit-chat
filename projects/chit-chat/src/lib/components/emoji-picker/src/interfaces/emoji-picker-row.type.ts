import { Emoji, EmojiCategory } from '.';

export type EmojiPickerRow =
	| {
			type: 'category';
			value: EmojiCategory | Emoji[];
	  }
	| { type: 'emoji'; value: Emoji[] };
