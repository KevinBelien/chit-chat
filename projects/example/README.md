INSTALLATION GUIDE:

1. ng add @angular/fire
2. tsconfig.json => add "skipLibCheck": true,
3. main.ts
   importProvidersFrom(
   ChitChatModule.forRoot({
   firebaseConfig: environment.FIREBASE_CONFIG,
   })
   ),
4. npm i @ctrl/ngx-emoji-mart
