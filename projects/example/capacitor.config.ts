import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'io.ionic.starter',
	appName: 'ChitChat',
	webDir: 'www',
	server: {
		androidScheme: 'https',
	},
	plugins: {
		FirebaseAuthentication: {
			skipNativeAuth: false,
			providers: ['google.com'],
			permissions: {
				google: ['profile', 'https://www.googleapis.com/auth/drive'],
			},
		},
	},
};

export default config;
