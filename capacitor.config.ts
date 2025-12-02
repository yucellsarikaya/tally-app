import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tallyapp.tally",
  appName: "tally-app",
  webDir: "build",
  server: {
    androidScheme: "https",
  },
};

export default config;
