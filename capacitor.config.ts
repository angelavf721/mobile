import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.alerta_amber',
  appName: 'Alerta Amber',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: "834947400379-0mu30err9sm0tadvbrrf8vdnrupkd41k.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
