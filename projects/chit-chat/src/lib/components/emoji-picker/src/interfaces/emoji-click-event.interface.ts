import { Emoji } from './emoji.interface';

export interface EmojiClickEvent {
	event: MouseEvent;
	emoji: Emoji;
}
