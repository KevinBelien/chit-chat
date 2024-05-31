import { groupedEmojis } from '.';
import { Emoji } from '../interfaces';

export const emojis: Emoji[] = [...groupedEmojis].flatMap(
	(group) => group.emojis
);
