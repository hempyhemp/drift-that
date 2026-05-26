import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.driftthat.app',
  appName: 'DRIFT//THAT',
  webDir: 'dist',
  android: {
    useLegacyBridge: true,
  },
}

export default config
