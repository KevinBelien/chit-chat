import { CommonModule } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { ScreenService } from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-split-pane',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './split-pane.component.html',
	styleUrls: ['./split-pane.component.scss'],
})
export class SplitPaneComponent implements OnChanges {
	@Input()
	when: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

	isSplitted: boolean;

	contentVisible: boolean = false;

	constructor(private screenService: ScreenService) {
		this.isSplitted = this.screenService.sizes[this.when];
		this.screenService.breakPointChanged.subscribe(() => {
			this.isSplitted = this.screenService.sizes[this.when];
			console.log('isSPlitted', this.isSplitted);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['when']) {
			this.isSplitted = this.screenService.sizes[this.when];
		}
	}
}
