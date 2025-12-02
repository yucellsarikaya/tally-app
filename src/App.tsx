import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, statsChart, settings } from "ionicons/icons";
import { App as CapacitorApp } from "@capacitor/app";
import { useThemeStore } from "./features/settings/store/themeStore";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ListPage from "./features/settings/pages/ListPage";
import AnalyticsPage from "./features/settings/pages/AnalyticsPage";

// ----------------------------------------------------
// Sayfa Importları (Yeni Feature-Based yoldan)
// ----------------------------------------------------

// Not: Bu dosyaları daha sonra oluşturacaksın.
// import ListPage from './features/subscriptions/pages/ListPage';
// import AnalyticsPage from './features/analytics/pages/AnalyticsPage';
// import SettingsPage from './features/settings/pages/SettingsPage';

const App: React.FC = () => {
  const { theme } = useThemeStore();

  // --- Android Geri Tuşu Yönetimi ---
  // Uygulama genelinde geri tuşu davranışını kontrol eder.
  useEffect(() => {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      // Eğer tarayıcı geçmişinde geri gidilecek yer yoksa uygulamadan çık
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        // Varsa bir önceki sayfaya git
        window.history.back();
      }
    });
  }, []);

  return (
    <IonApp className={`theme-${theme}`}>
      <IonReactRouter>
        <IonTabs>
          {/* 1. Sayfa Yönlendirmeleri (Router Outlet) */}
          <IonRouterOutlet>
            {/* Sayfalar */}
            <Route exact path="/home">
              <ListPage />
            </Route>
            <Route exact path="/analytics">
              <AnalyticsPage />
            </Route>
            <Route exact path="/settings">
              <SettingsPage />
            </Route>

            {/* Uygulama açılışında /home sayfasına yönlendir */}
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>

          {/* 2. Alt Menü (Tab Bar) */}
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Abonelikler</IonLabel>
            </IonTabButton>

            <IonTabButton tab="analytics" href="/analytics">
              <IonIcon icon={statsChart} />
              <IonLabel>Analiz</IonLabel>
            </IonTabButton>

            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Ayarlar</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
