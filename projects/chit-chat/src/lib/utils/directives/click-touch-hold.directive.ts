import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
} from '@angular/core';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

export type ClickTouchHoldEvent = {
	event: PointerEvent | KeyboardEvent;
	data?: any;
	pointerType?: string;
	interactionType?: 'left' | 'right' | 'enter' | 'space';
};

@Directive({
	selector: '[chClickTouchHold]',
	standalone: true,
})
export class ClickTouchHoldDirective implements OnInit, OnDestroy {
	@Input() touchHoldTimeInMillis = 750;
	@Input() preventContextMenu = true;
	@Input() trackDataAttribute?: string;
	@Output() onClick = new EventEmitter<ClickTouchHoldEvent>();
	@Output() onTouchHold = new EventEmitter<ClickTouchHoldEvent>();

	private destroy$ = new Subject<void>();
	private pointerDown$ = new Subject<PointerEvent>();
	private pointerUp$ = new Subject<PointerEvent>();
	private pointerMove$ = new Subject<PointerEvent>();
	private touchMove$ = new Subject<TouchEvent>();
	private scroll$ = new Subject<void>();
	private keyDown$ = new Subject<KeyboardEvent>();

	private pointerDownListener: () => void = () => {};
	private pointerUpListener: () => void = () => {};
	private pointerMoveListener: () => void = () => {};
	private touchMoveListener: () => void = () => {};
	private scrollListener: () => void = () => {};
	private keyDownListener: () => void = () => {};
	private keyUpListener: () => void = () => {};
	private contextMenuListener: () => void = () => {};

	private pointerDownTarget: EventTarget | null = null;
	private pointerDownDataAttribute: string | null = null;
	private hasPointerLeftElement = false;
	private keyHandled = false;

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		this.addEventListeners();

		this.pointerDown$
			.pipe(
				switchMap((event) =>
					timer(this.touchHoldTimeInMillis).pipe(
						takeUntil(this.pointerUp$),
						takeUntil(this.pointerMove$),
						takeUntil(this.touchMove$),
						takeUntil(this.scroll$),
						tap(() => this.handleTouchHold(event))
					)
				),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.pointerUp$
			.pipe(
				tap((event) => this.handlePointerUp(event)),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.keyDown$
			.pipe(
				tap((event) => this.handleKeyDown(event)),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.removeEventListeners();
		this.destroy$.next();
		this.destroy$.complete();
	}

	private addEventListeners(): void {
		this.pointerDownListener = this.renderer.listen(
			this.elementRef.nativeElement,
			'pointerdown',
			(event: PointerEvent) => this.onPointerDown(event)
		);

		this.pointerUpListener = this.renderer.listen(
			'document',
			'pointerup',
			(event: PointerEvent) => this.onPointerUp(event)
		);

		this.pointerMoveListener = this.renderer.listen(
			'document',
			'pointermove',
			(event: PointerEvent) => this.onPointerMove(event)
		);

		this.touchMoveListener = this.renderer.listen(
			'document',
			'touchmove',
			(event: TouchEvent) => this.onTouchMove(event)
		);

		this.scrollListener = this.renderer.listen(
			'window',
			'scroll',
			() => this.scroll$.next()
		);

		this.keyDownListener = this.renderer.listen(
			this.elementRef.nativeElement,
			'keydown',
			(event: KeyboardEvent) => this.keyDown$.next(event)
		);

		this.keyUpListener = this.renderer.listen(
			this.elementRef.nativeElement,
			'keyup',
			(event: KeyboardEvent) => this.onKeyUp(event)
		);

		if (this.preventContextMenu) {
			this.contextMenuListener = this.renderer.listen(
				this.elementRef.nativeElement,
				'contextmenu',
				(event: MouseEvent) => event.preventDefault()
			);
		}
	}

	private removeEventListeners(): void {
		this.pointerDownListener();
		this.pointerUpListener();
		this.pointerMoveListener();
		this.touchMoveListener();
		this.scrollListener();
		this.keyDownListener();
		this.keyUpListener();
		if (this.preventContextMenu) {
			this.contextMenuListener();
		}
	}

	private onPointerDown(event: PointerEvent): void {
		const targetElement = event.target as HTMLElement;
		if (
			(event.pointerType === 'mouse' &&
				event.button !== 0 &&
				event.button !== 2) ||
			(event.pointerType !== 'mouse' && event.button !== 0)
		) {
			return;
		}

		if (
			!this.trackDataAttribute ||
			targetElement.hasAttribute(this.trackDataAttribute)
		) {
			this.pointerDownTarget = event.target;
			this.pointerDownDataAttribute =
				this.getTrackData(targetElement);
			this.hasPointerLeftElement = false;
			this.pointerDown$.next(event);
		}
	}

	private onPointerUp(event: PointerEvent): void {
		const targetElement = event.target as HTMLElement;
		if (
			this.pointerDownTarget &&
			(!this.trackDataAttribute ||
				targetElement.hasAttribute(this.trackDataAttribute))
		) {
			const pointerUpDataAttribute = this.getTrackData(targetElement);
			if (
				this.pointerDownDataAttribute === pointerUpDataAttribute &&
				!this.hasPointerLeftElement
			) {
				this.pointerUp$.next(event);
			}
		}
		this.pointerDownTarget = null; // Reset target after pointerup
		this.pointerDownDataAttribute = null;
	}

	private onPointerMove(event: PointerEvent): void {
		const targetElement = event.target as HTMLElement;
		if (
			this.pointerDownTarget &&
			(!this.elementRef.nativeElement.contains(targetElement) ||
				(this.trackDataAttribute &&
					targetElement.hasAttribute(this.trackDataAttribute) &&
					this.pointerDownDataAttribute !==
						targetElement.getAttribute(this.trackDataAttribute)))
		) {
			this.hasPointerLeftElement = true;
			this.pointerMove$.next(event);
		}
	}

	private onTouchMove(event: TouchEvent): void {
		const targetElement = document.elementFromPoint(
			event.touches[0].clientX,
			event.touches[0].clientY
		) as HTMLElement;
		if (
			this.pointerDownTarget &&
			(!this.elementRef.nativeElement.contains(targetElement) ||
				(this.trackDataAttribute &&
					targetElement &&
					targetElement.hasAttribute(this.trackDataAttribute) &&
					this.pointerDownDataAttribute !==
						targetElement.getAttribute(this.trackDataAttribute)))
		) {
			this.hasPointerLeftElement = true;
			this.touchMove$.next(event);
		}
	}

	private handleKeyDown(event: KeyboardEvent): void {
		if (this.keyHandled) return;

		this.keyHandled = true; // Mark key as handled
	}

	private onKeyUp(event: KeyboardEvent): void {
		const targetElement = event.target as HTMLElement;

		if (
			(event.key === 'Enter' || event.key === ' ') &&
			(!this.trackDataAttribute ||
				targetElement.hasAttribute(this.trackDataAttribute))
		) {
			const data = this.getTrackData(targetElement);
			this.onClick.emit({
				event,
				data,
				interactionType: event.key === 'Enter' ? 'enter' : 'space',
			});
		}
		this.keyHandled = false;
	}

	private handleTouchHold(event: PointerEvent): void {
		const targetElement = this.getElementFromEvent(event);
		const data = this.getTrackData(targetElement);

		if (
			!this.hasPointerLeftElement &&
			this.isValidTarget(targetElement, data)
		) {
			this.onTouchHold.emit({ event, data });
		}
	}

	private handlePointerUp(event: PointerEvent): void {
		const targetElement = this.getElementFromEvent(event);
		const data = this.getTrackData(targetElement);

		if (!this.hasPointerLeftElement) {
			this.onClick.emit({
				event,
				data,
				pointerType: event.pointerType,
				interactionType:
					event.pointerType === 'mouse'
						? event.button === 0
							? 'left'
							: 'right'
						: undefined,
			});
		}
	}

	private getElementFromEvent(event: Event): HTMLElement | null {
		if ((event as TouchEvent).changedTouches) {
			const touchEvent = event as TouchEvent;
			return document.elementFromPoint(
				touchEvent.changedTouches[0].clientX,
				touchEvent.changedTouches[0].clientY
			) as HTMLElement;
		} else {
			const pointerEvent = event as PointerEvent;
			return document.elementFromPoint(
				pointerEvent.clientX,
				pointerEvent.clientY
			) as HTMLElement;
		}
	}

	private getTrackData(
		targetElement: HTMLElement | null
	): string | null {
		return targetElement &&
			this.trackDataAttribute &&
			targetElement.hasAttribute(this.trackDataAttribute)
			? targetElement.getAttribute(this.trackDataAttribute)
			: null;
	}

	private isValidTarget(
		targetElement: HTMLElement | null,
		data?: string | null
	): boolean {
		return (
			!!targetElement &&
			(!this.trackDataAttribute ||
				(targetElement.hasAttribute(this.trackDataAttribute) &&
					this.pointerDownDataAttribute === data))
		);
	}
}
