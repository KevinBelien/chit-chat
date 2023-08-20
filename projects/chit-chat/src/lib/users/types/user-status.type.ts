export const userStatuses = [
	'offline',
	'available',
	'busy',
	'away',
	'do-not-disturb',
	'show-offline',
];

export type UserStatus = (typeof userStatuses)[number];
