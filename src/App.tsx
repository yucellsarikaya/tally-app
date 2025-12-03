import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar, // Zaten mevcuttu
  IonTabButton, // Zaten mevcuttu
  IonIcon, // Zaten mevcuttu
  IonLabel, // Zaten mevcuttu
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, statsChart, settings } from "ionicons/icons";
import { App as CapacitorApp } from "@capacitor/app";
import { useThemeStore } from "./features/settings/store/themeStore";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ListPage from "./features/settings/pages/ListPage";
import AnalyticsPage from "./features/settings/pages/AnalyticsPage";
// import CustomTabBar from "./features/settings/subscriptions/components/CustomTabBar"; // <-- BU İMPORTU SİL

const App: React.FC = () => {
  const { theme } = useThemeStore();
  useEffect(() => {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  }, []);

  return (
    <IonApp className={`theme-${theme}`}>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* ----------------- ROUTE TANIMLARI ----------------- */}
            <Route exact path="/home">
              <ListPage />
            </Route>
            <Route exact path="/analytics">
              <AnalyticsPage />
            </Route>
            <Route exact path="/settings">
              <SettingsPage />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            {/* ---------------------------------------------------- */}
          </IonRouterOutlet>

          {/* --- CUSTOM TAB BAR ENTEGRASYONU --- */}
          <IonTabBar
            slot="bottom"
            // CSS Değişkenleri için as any kullanıyoruz.
            style={
              {
                // ... diğer stiller ...

                // YENİ EKLEME: Varsayılan çizgiyi kaldırır
                "--border": "none",

                "--background": "#1f1f1f",
                "--color-selected": "#00ffc8",
                "--color": "#888888",

                // String stillerini koruyalım
                "border-top": "none",
                "box-shadow": "0 -5px 15px rgba(0,0,0,0.3)",
              } as any
            }
          >
            {/* 1. Abonelikler Sekmesi (Home) */}
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Abonelikler</IonLabel>
            </IonTabButton>

            {/* 2. Analiz Sekmesi */}
            <IonTabButton tab="analytics" href="/analytics">
              <IonIcon icon={statsChart} />
              <IonLabel>Analiz</IonLabel>
            </IonTabButton>

            {/* 3. Ayarlar Sekmesi */}
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Ayarlar</IonLabel>
            </IonTabButton>
          </IonTabBar>
          {/* ------------------------------------- */}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
