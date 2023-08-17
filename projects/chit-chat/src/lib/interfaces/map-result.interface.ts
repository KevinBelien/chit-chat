export interface MapResult<T> {
	data: T | null;
	error?: Error;
}

export interface MapResultCollection<T> {
	data: Array<T>;
	errors: Array<MapResult<T>>;
}
