import { TouchHoldEvent } from 'chit-chat/src/lib/utils';
import { Emoji } from './emoji.interface';

export interface EmojiTouchHoldEvent {
	event: TouchHoldEvent;
	emoji: Emoji;
}
