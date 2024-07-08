import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
} from '@angular/core';
import { Subject, fromEvent, merge, timer } from 'rxjs';
import { filter, mergeMap, takeUntil, tap } from 'rxjs/operators';
@Directive({
	standalone: true,
	selector: '[chTouchHold]',
})
export class TouchHoldDirective implements OnDestroy {
	@Input() holdTimeInMs: number = 750;
	@Output() onTouchHold = new EventEmitter<TouchHoldEvent>();

	private destroy$ = new Subject<void>();

	constructor(private element: ElementRef) {
		const touchStart$ = fromEvent<TouchEvent>(
			this.element.nativeElement,
			'touchstart'
		);
		const touchEnd$ = fromEvent<TouchEvent>(
			this.element.nativeElement,
			'touchend'
		);
		const touchMove$ = fromEvent<TouchEvent>(
			this.element.nativeElement,
			'touchmove'
		);

		const mouseDown$ = fromEvent<MouseEvent>(
			this.element.nativeElement,
			'mousedown'
		).pipe(filter((event) => event.button === 0));
		const mouseUp$ = fromEvent<MouseEvent>(
			this.element.nativeElement,
			'mouseup'
		).pipe(filter((event) => event.button === 0));
		const mouseLeave$ = fromEvent<MouseEvent>(
			this.element.nativeElement,
			'mouseleave'
		).pipe(filter((event) => event.button === 0));

		const hold$ = merge(
			touchStart$.pipe(
				mergeMap(() =>
					timer(this.holdTimeInMs).pipe(
						takeUntil(merge(touchEnd$, touchMove$)),
						tap(() => this.onTouchHold.emit({ eventType: 'touch' }))
					)
				)
			),
			mouseDown$.pipe(
				mergeMap(() =>
					timer(this.holdTimeInMs).pipe(
						takeUntil(merge(mouseUp$, mouseLeave$)),
						tap(() => this.onTouchHold.emit({ eventType: 'mouse' }))
					)
				)
			)
		).pipe(takeUntil(this.destroy$));

		hold$.subscribe();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('gets to destroy');
	}
}
export interface TouchHoldEvent {
	eventType: 'touch' | 'mouse';
}
