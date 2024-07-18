import { DOCUMENT } from '@angular/common';
import {
	AfterViewInit,
	Directive,
	ElementRef,
	Inject,
	Input,
	NgZone,
	OnDestroy,
	Renderer2,
} from '@angular/core';

@Directive({
	selector: '[chRipple]',
	standalone: true,
	host: {
		class: 'ch-ripple-container',
	},
})
export class RippleDirective implements AfterViewInit, OnDestroy {
	@Input() rippleEnabled: boolean = true;

	private hostEl: HTMLElement;
	private pointerDownListener?: () => void;
	private inkElement?: HTMLElement;

	constructor(
		private renderer: Renderer2,
		private el: ElementRef,
		public zone: NgZone,
		@Inject(DOCUMENT) private document: Document
	) {
		this.hostEl = el.nativeElement as HTMLElement;
	}

	ngAfterViewInit() {
		this.zone.runOutsideAngular(() => {
			this.create();
			this.pointerDownListener = this.renderer.listen(
				this.el.nativeElement,
				'pointerdown',
				this.onPointerDown.bind(this)
			);
		});
	}

	ngOnDestroy() {
		this.remove();
	}

	create = () => {
		if (!this.inkElement) {
			this.inkElement = this.renderer.createElement('span');
			this.renderer.addClass(this.inkElement, 'ch-ink');
			this.renderer.appendChild(
				this.el.nativeElement,
				this.inkElement
			);
			this.renderer.setAttribute(
				this.inkElement,
				'aria-hidden',
				'true'
			);
			this.renderer.setAttribute(
				this.inkElement,
				'role',
				'presentation'
			);
		}
	};

	remove = () => {
		if (this.pointerDownListener) {
			this.pointerDownListener();
		}
		if (this.inkElement) {
			this.renderer.removeChild(
				this.el.nativeElement,
				this.inkElement
			);
		}
	};

	onPointerDown = (e: MouseEvent) => {
		if (!this.inkElement || !this.rippleEnabled) return;

		// Only append the ink element if it's not already in the host element
		if (!this.inkElement.parentElement) {
			this.renderer.appendChild(this.hostEl, this.inkElement);
		}
		this.renderer.removeClass(this.inkElement, 'ch-ink-animate');

		if (
			!this.inkElement.offsetHeight &&
			!this.inkElement.offsetWidth
		) {
			const d = Math.max(
				this.hostEl.offsetWidth,
				this.hostEl.offsetHeight
			);
			this.renderer.setStyle(this.inkElement, 'width', d + 'px');
			this.renderer.setStyle(this.inkElement, 'height', d + 'px');
		}

		const rect = this.hostEl.getBoundingClientRect();
		const scrollLeft =
			this.document.documentElement.scrollLeft ||
			this.document.body.scrollLeft;
		const scrollTop =
			this.document.documentElement.scrollTop ||
			this.document.body.scrollTop;

		const x =
			e.pageX -
			rect.left -
			scrollLeft -
			this.inkElement.offsetWidth / 2;
		const y =
			e.pageY -
			rect.top -
			scrollTop -
			this.inkElement.offsetHeight / 2;

		this.renderer.setStyle(this.inkElement, 'top', y + 'px');
		this.renderer.setStyle(this.inkElement, 'left', x + 'px');
		this.renderer.addClass(this.inkElement, 'ch-ink-animate');
	};
}
