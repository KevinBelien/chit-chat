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

@Directive({
	selector: '[chClickTouchHold]',
	standalone: true,
})
export class ClickTouchHoldDirective implements OnInit, OnDestroy {
	@Input() touchHoldTimeInMillis = 750; // Default to 750 milliseconds
	@Input() preventContextMenu = true; // Default to true
	@Input() trackDataAttribute?: string; // Attribute to check
	@Output() onClick = new EventEmitter<PointerEvent>();
	@Output() onTouchHold = new EventEmitter<PointerEvent>();

	private destroy$ = new Subject<void>();
	private pointerDown$ = new Subject<PointerEvent>();
	private pointerUp$ = new Subject<PointerEvent>();
	private pointerMove$ = new Subject<PointerEvent>();
	private touchMove$ = new Subject<TouchEvent>();
	private scroll$ = new Subject<void>();
	private pointerDownListener: () => void = () => {};
	private pointerUpListener: () => void = () => {};
	private pointerMoveListener: () => void = () => {};
	private touchMoveListener: () => void = () => {};
	private scrollListener: () => void = () => {};
	private contextMenuListener: () => void = () => {};
	private pointerDownTarget: EventTarget | null = null;
	private pointerDownDataAttribute: string | null = null;
	private hasPointerLeftElement = false;

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2
	) {}

	ngOnInit(): void {
		this.pointerDownListener = this.renderer.listen(
			this.elementRef.nativeElement,
			'pointerdown',
			(event: PointerEvent) => {
				const targetElement = event.target as HTMLElement;
				if (event.pointerType === 'mouse' && event.button !== 0) {
					return; // Only handle left-clicks for mouse
				}
				if (
					!this.trackDataAttribute ||
					(targetElement &&
						targetElement.hasAttribute(this.trackDataAttribute))
				) {
					this.pointerDownTarget = event.target;
					this.pointerDownDataAttribute = this.trackDataAttribute
						? targetElement.getAttribute(this.trackDataAttribute)
						: null;
					this.hasPointerLeftElement = false;
					this.pointerDown$.next(event);
				}
			}
		);

		this.pointerUpListener = this.renderer.listen(
			this.elementRef.nativeElement,
			'pointerup',
			(event: PointerEvent) => {
				const targetElement = event.target as HTMLElement;
				if (
					this.pointerDownTarget &&
					(!this.trackDataAttribute ||
						targetElement.hasAttribute(this.trackDataAttribute))
				) {
					const pointerUpDataAttribute = this.trackDataAttribute
						? targetElement.getAttribute(this.trackDataAttribute)
						: null;
					if (
						this.pointerDownDataAttribute ===
							pointerUpDataAttribute &&
						!this.hasPointerLeftElement
					) {
						this.pointerUp$.next(event);
					}
				}
				this.pointerDownTarget = null; // Reset target after pointerup
				this.pointerDownDataAttribute = null;
			}
		);

		this.pointerMoveListener = this.renderer.listen(
			'document',
			'pointermove',
			(event: PointerEvent) => {
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
		);

		this.touchMoveListener = this.renderer.listen(
			'document',
			'touchmove',
			(event: TouchEvent) => {
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
		);

		this.scrollListener = this.renderer.listen(
			this.elementRef.nativeElement,
			'scroll',
			() => {
				this.scroll$.next();
			}
		);

		if (this.preventContextMenu) {
			this.contextMenuListener = this.renderer.listen(
				this.elementRef.nativeElement,
				'contextmenu',
				(event: MouseEvent) => {
					event.preventDefault();
				}
			);
		}

		this.pointerDown$
			.pipe(
				switchMap((event) =>
					timer(this.touchHoldTimeInMillis).pipe(
						takeUntil(this.pointerUp$),
						takeUntil(this.pointerMove$),
						takeUntil(this.touchMove$),
						takeUntil(this.scroll$),
						tap(() => {
							const targetElement = this.getElementFromEvent(event);
							if (
								!this.hasPointerLeftElement &&
								targetElement &&
								(!this.trackDataAttribute ||
									(targetElement.hasAttribute(
										this.trackDataAttribute
									) &&
										this.pointerDownDataAttribute ===
											targetElement.getAttribute(
												this.trackDataAttribute
											)))
							) {
								this.onTouchHold.emit(event);
							}
						})
					)
				),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.pointerUp$
			.pipe(
				tap((event) => {
					if (!this.hasPointerLeftElement) {
						this.onClick.emit(event);
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.pointerDownListener();
		this.pointerUpListener();
		this.pointerMoveListener();
		this.touchMoveListener();
		this.scrollListener();
		if (this.preventContextMenu) {
			this.contextMenuListener();
		}

		this.destroy$.next();
		this.destroy$.complete();
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
}
