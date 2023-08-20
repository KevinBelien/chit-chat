export const userStatuses = [
	'offline',
	'available',
	'busy',
	'away',
	'do-not-disturb',
];

export type UserStatus = (typeof userStatuses)[number];
