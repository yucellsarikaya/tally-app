import {
  SiNetflix,
  SiSpotify,
  SiYoutube,
  SiApple,
  SiAdobe,
  SiSteam,
  SiAmazon,
  SiBox,
  SiDiscord,
  SiGoogle,
  SiCarrd,
} from "react-icons/si";
import { card } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

export const DefaultIcon = (props: any) => <IonIcon icon={card} {...props} />;

export interface PlatformConfig {
  id: string;
  name: string;
  color: string;
  icon: any;
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  custom: {
    id: "custom",
    name: "Diğer (Özel)",
    color: "#666666",
    icon: DefaultIcon,
  },
  netflix: {
    id: "netflix",
    name: "Netflix",
    color: "#E50914",
    icon: SiNetflix,
  },
  spotify: {
    id: "spotify",
    name: "Spotify",
    color: "#1DB954",
    icon: SiSpotify,
  },
  aws: { id: "aws", name: "AWS", color: "#FF9900", icon: SiAmazon },
  youtube: {
    id: "youtube",
    name: "YouTube Premium",
    color: "#FF0000",
    icon: SiYoutube,
  },
  apple: {
    id: "apple",
    name: "Apple Services",
    color: "#A2AAAD",
    icon: SiApple,
  },
  adobe: {
    id: "adobe",
    name: "Adobe Creative Cloud",
    color: "#FF0000",
    icon: SiAdobe,
  },
  steam: { id: "steam", name: "Steam", color: "#000000", icon: SiSteam },
  xbox: { id: "xbox", name: "Xbox Game Pass", color: "#107C10", icon: SiBox },
  amazon: {
    id: "amazon",
    name: "Amazon Prime",
    color: "#FF9900",
    icon: SiAmazon,
  },
  discord: {
    id: "discord",
    name: "Discord Nitro",
    color: "#5865F2",
    icon: SiDiscord,
  },
  google: {
    id: "google",
    name: "Google One",
    color: "#4285F4",
    icon: SiGoogle,
  },
  card: {
    id: "card",
    name: "Visa/MasterCard",
    color: "#4285F4",
    icon: SiCarrd,
  },
};

export const getPlatformConfig = (id: string) => {
  return PLATFORMS[id] || PLATFORMS["custom"];
};
