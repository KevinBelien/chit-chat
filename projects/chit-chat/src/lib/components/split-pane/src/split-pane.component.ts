import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ScreenService } from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-split-pane',
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './split-pane.component.html',
	styleUrls: ['./split-pane.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class SplitPaneComponent implements OnChanges, AfterViewInit {
	@Input()
	when: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';

	@Input()
	sidePaneWidth: number = 350;

	@Input()
	sidePaneVisible: boolean = true;

	isSplitted!: boolean;

	width: number;

	contentVisible: boolean = false;

	@Output()
	onSidePaneVisibilityChanged = new EventEmitter<boolean>();

	@Output()
	onSplittedChanged = new EventEmitter<{
		breakPoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		value: boolean;
	}>();

	constructor(private screenService: ScreenService) {
		this.setSplitted(this.screenService.sizes[this.when]);

		this.width = this.calcWidth();
		this.screenService.breakPointChanged.subscribe(() => {
			this.setSplitted(this.screenService.sizes[this.when]);

			this.width = this.calcWidth();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['when']) {
			this.setSplitted(this.screenService.sizes[this.when]);
		}
	}

	ngAfterViewInit(): void {
		this.setSplitted(this.screenService.sizes[this.when]);
	}

	setSplitted = (value: boolean) => {
		this.isSplitted = value;
		this.onSplittedChanged.emit({
			breakPoint: this.when,
			value: this.isSplitted,
		});
	};

	private calcWidth = () => {
		return this.isSplitted ? this.sidePaneWidth : window.innerWidth;
	};

	showSidePane = (force: boolean = false) => {
		if (force || !this.isSplitted) {
			this.sidePaneVisible = true;
			this.onSidePaneVisibilityChanged.emit(true);
		}
	};

	hideSidePane = (force: boolean = false) => {
		if (force || !this.isSplitted) {
			this.sidePaneVisible = false;
			this.onSidePaneVisibilityChanged.emit(false);
		}
	};

	toggleSidePane = (force: boolean = false) => {
		if (force || !this.isSplitted) {
			this.sidePaneVisible = !this.sidePaneVisible;
			this.onSidePaneVisibilityChanged.emit(this.sidePaneVisible);
		}
	};
}
