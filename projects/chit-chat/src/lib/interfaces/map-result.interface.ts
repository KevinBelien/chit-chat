export interface MapResultCollection<T> {
	data: Array<T>;
	errors: Array<MapResult<T>>;
}
export interface MapResult<T> {
	data: T | null;
	error?: Error;
}
