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
  IonToggle,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { useThemeStore } from "../store/themeStore"; // Tema store'unu import ediyoruz

const SettingsPage: React.FC = () => {
  // Zustand store'dan güncel tema durumunu ve aksiyonu çekiyoruz
  const { theme, setTheme } = useThemeStore();

  // Segment değiştiğinde çalışacak event handler
  const handleThemeChange = (e: any) => {
    // e.detail.value "light" veya "dark" stringini verecektir.
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
          {/* -------------------- TEMA SEÇİMİ -------------------- */}
          <IonItem lines="full">
            <IonLabel>
              <h2>Tema Seçimi</h2>
              <p>Uygulamanın görünümünü ayarla</p>
            </IonLabel>

            {/* Tema Seçim Segmenti (light/dark) */}
            <IonSegment
              value={theme} // Aktif tema değerini gösterir (light/dark)
              onIonChange={handleThemeChange} // Değişiklik olduğunda handleThemeChange fonksiyonunu çağırır
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

          {/* -------------------- MONETIZATION AYARLARI -------------------- */}
          <IonItem lines="full" detail={true}>
            <IonLabel>
              <h2>Satın Alımı Geri Yükle</h2>
              <p>Premium üyeliğini geri almak için tıkla</p>
            </IonLabel>
            {/* Bu kısım ileride RevenueCat.restorePurchases() fonksiyonunu çağıracak. */}
          </IonItem>

          {/* -------------------- Diğer Ayarlar -------------------- */}
          <IonItem lines="full" detail={true}>
            <IonLabel>Gizlilik Politikası</IonLabel>
          </IonItem>
          {/* ... Diğer ayarlar buraya gelir ... */}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
