import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, IonicModule, RouterModule],
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor() {}
}
