import { ClickActionType, PointerDeviceType } from '../enums';

export type ClickEvent = {
	event: PointerEvent | KeyboardEvent;
	data?: any;
	pointerType?: PointerDeviceType;
	action?: ClickActionType;
};
