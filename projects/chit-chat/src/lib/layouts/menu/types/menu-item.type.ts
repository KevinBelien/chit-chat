export const menuItems = [
	'chats',
	'users',
	'groups',
	'calls',
	'settings',
] as const;

export type MenuItem = (typeof menuItems)[number];
