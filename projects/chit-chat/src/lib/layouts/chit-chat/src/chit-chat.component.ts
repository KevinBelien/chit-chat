import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonMenu, IonicModule, ViewDidEnter } from '@ionic/angular';
import { SplitPaneComponent } from 'chit-chat/src/lib/components/split-pane';
import { MenuComponent } from 'chit-chat/src/lib/layouts/menu';
import { ScreenService } from 'chit-chat/src/lib/utils';

@Component({
	selector: 'ch-chit-chat',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		MenuComponent,
		SplitPaneComponent,
	],
	templateUrl: './chit-chat.component.html',
	styleUrls: ['./chit-chat.component.scss'],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class ChitChatComponent
	implements ViewDidEnter, AfterViewInit
{
	@ViewChild(IonMenu, { static: false })
	menuComponent?: IonMenu;

	isSmallScreen: boolean = true;

	constructor(private screenService: ScreenService) {
		this.isSmallScreen = this.screenService.sizes['sm'];
		this.screenService.breakPointChanged.subscribe(() => {
			this.isSmallScreen = this.screenService.sizes['sm'];
		});
	}

	ionViewDidEnter(): void {
		console.log('view will enter');
		// this.menuComponent?.open();
	}

	closeMenu = async () => {
		console.log('gets to close menu', this.menuComponent);
		const isClosed = await this.menuComponent?.close();
		console.log(isClosed);
	};

	ngAfterViewInit(): void {
		console.log('after view init');
		this.menuComponent?.open();
	}
}
