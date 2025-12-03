import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { useThemeStore } from "../store/themeStore";
const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (e: any) => {
    const newTheme = e.detail.value as "light" | "dark";
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ayarlar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItem lines="full">
            <IonLabel>
              <h2>Tema Seçimi</h2>
              <p>Uygulamanın görünümünü ayarla</p>
            </IonLabel>
            <IonSegment
              value={theme}
              onIonChange={handleThemeChange}
              style={{ minWidth: "160px" }}
            >
              <IonSegmentButton value="light">
                <IonLabel>Aydınlık</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="dark">
                <IonLabel>Karanlık</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItem lines="full" detail={true}>
            <IonLabel>
              <h2>Satın Alımı Geri Yükle</h2>
              <p>Premium üyeliğini geri almak için tıkla</p>
            </IonLabel>
          </IonItem>
          <IonItem lines="full" detail={true}>
            <IonLabel>Gizlilik Politikası</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
