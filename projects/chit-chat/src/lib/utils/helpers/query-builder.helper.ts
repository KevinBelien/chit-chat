import { FieldPath } from 'firebase/firestore';
import { FilterOperation } from '../types';

import { Query } from '@firebase/firestore-types';

export class QueryBuilder {
	public static buildQuery = (
		query: Query,
		operations: {
			filter?: Array<FilterOperation>;
			orderBy?: {
				fieldname: string | FieldPath;
				order?: 'asc' | 'desc';
			};
		}
	) => {
		if (!!operations.filter)
			query = this.buildFilter(query, operations.filter);

		if (!!operations.orderBy)
			query = this.buildOrderBy(
				query,
				operations.orderBy.fieldname,
				operations.orderBy.order
			);

		return query;
	};

	public static buildFilter = (
		query: Query,
		filter: Array<FilterOperation>
	) => {
		filter.forEach(
			(f) => (query = query.where(f[0] as string, f[1], f[2]))
		);
		return query;
	};

	public static buildOrderBy = (
		query: Query,
		fieldname: string | FieldPath,
		order: 'asc' | 'desc' = 'desc'
	) => {
		query = query.orderBy(fieldname as string, order);
		return query;
	};
}
