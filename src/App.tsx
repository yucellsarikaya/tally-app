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
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, statsChart, settings, wallet } from "ionicons/icons";
import { App as CapacitorApp } from "@capacitor/app";
import { useThemeStore } from "./features/settings/store/themeStore";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ListPage from "./features/settings/pages/ListPage";
import AnalyticsPage from "./features/settings/pages/AnalyticsPage";

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
        {/* GLOBAL HEADER */}
        {/* z-index: 10 vererek içeriğin üstünde kalmasını garantiliyoruz */}
        <IonHeader className="ion-no-border" style={{ zIndex: 10 }}>
          <IonToolbar
            style={
              {
                "--background": "#ffffff",
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "5px",
                display: "flex",
                alignItems: "center",
              } as any
            }
          >
            <div
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "10px",
                paddingBottom: "5px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#00ffc8",
                  borderRadius: "10px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0, 255, 200, 0.3)",
                }}
              >
                <IonIcon
                  icon={wallet}
                  style={{ color: "#1f1f1f", fontSize: "20px" }}
                />
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                  color: "#1f1f1f",
                  lineHeight: "1",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                Tally
                <span
                  style={{
                    color: "#00ffc8",
                    fontSize: "34px",
                    marginLeft: "2px",
                  }}
                >
                  .
                </span>
              </h1>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonTabs>
          <IonRouterOutlet>
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
          </IonRouterOutlet>

          <IonTabBar
            slot="bottom"
            style={
              {
                "--border": "none",
                "--background": "#ffffff",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #f0f0f0",
                paddingTop: "8px",
                paddingBottom: "env(safe-area-inset-bottom)",
                height: "auto",
                minHeight: "60px",
              } as any
            }
          >
            <IonTabButton
              tab="home"
              href="/home"
              style={
                {
                  "--background": "transparent",
                  backgroundColor: "transparent",
                } as any
              }
            >
              <IonIcon
                icon={home}
                style={{ fontSize: "24px", marginBottom: "4px" }}
              />
              <IonLabel style={{ fontSize: "11px", fontWeight: "500" }}>
                Abonelikler
              </IonLabel>
            </IonTabButton>

            <IonTabButton
              tab="analytics"
              href="/analytics"
              style={
                {
                  "--background": "transparent",
                  backgroundColor: "transparent",
                } as any
              }
            >
              <IonIcon
                icon={statsChart}
                style={{ fontSize: "24px", marginBottom: "4px" }}
              />
              <IonLabel style={{ fontSize: "11px", fontWeight: "500" }}>
                Analiz
              </IonLabel>
            </IonTabButton>

            <IonTabButton
              tab="settings"
              href="/settings"
              style={
                {
                  "--background": "transparent",
                  backgroundColor: "transparent",
                } as any
              }
            >
              <IonIcon
                icon={settings}
                style={{ fontSize: "24px", marginBottom: "4px" }}
              />
              <IonLabel style={{ fontSize: "11px", fontWeight: "500" }}>
                Ayarlar
              </IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
