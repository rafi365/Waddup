import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umn.waddup',
  appName: 'Waddup',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ["google.com"],
    },
  },
};

export default config;
