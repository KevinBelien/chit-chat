import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	Renderer2,
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
	private contextMenuListener?: () => void;

	constructor(
		private element: ElementRef,
		private renderer: Renderer2
	) {
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
						tap(() => this.emitEvent('touch'))
					)
				)
			),
			mouseDown$.pipe(
				mergeMap(() =>
					timer(this.holdTimeInMs).pipe(
						takeUntil(merge(mouseUp$, mouseLeave$)),
						tap(() => this.emitEvent('mouse'))
					)
				)
			)
		).pipe(takeUntil(this.destroy$));

		hold$.subscribe();
	}

	private emitEvent(eventType: 'touch' | 'mouse'): void {
		this.onTouchHold.emit({ eventType });
		if (eventType === 'touch') {
			this.disableContextMenu(true);
		}
	}

	private disableContextMenu(disable: boolean): void {
		if (disable) {
			this.contextMenuListener = this.renderer.listen(
				this.element.nativeElement,
				'contextmenu',
				this.preventContextMenu
			);
		} else if (this.contextMenuListener) {
			this.contextMenuListener();
			this.contextMenuListener = undefined;
		}
	}

	private preventContextMenu = (event: Event): void => {
		event.preventDefault();
	};

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
		this.disableContextMenu(false);
	}
}
export interface TouchHoldEvent {
	eventType: 'touch' | 'mouse';
}
