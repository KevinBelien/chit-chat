import { AuthService } from '../../../../../chit-chat/src/lib/services';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ChitChatModule } from '../../../../../chit-chat/src/lib/chit-chat.module';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, IonicModule, ChitChatModule],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	constructor(private authService: AuthService) {
		this.authService.signIn({
			email: 'k3vin.belien@gmail.com',
			password: 'Test123',
		});

		// setTimeout(async () => await this.authService.signOut(), 5000);
	}
}
