export const userStatuses = [
	'offline',
	'available',
	'away',
	'do-not-disturb',
	'show-offline',
];

export type UserStatus = (typeof userStatuses)[number];
