import { FieldPath, WhereFilterOp } from 'firebase/firestore';

export type FilterOperation = [
	string | FieldPath,
	WhereFilterOp,
	unknown
];
