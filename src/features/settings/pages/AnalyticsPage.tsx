import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockSpendingData = [
  { month: "Ocak", gider: 4500 },
  { month: "Şubat", gider: 4800 },
  { month: "Mart", gider: 5200 },
  { month: "Nisan", gider: 4600 },
  { month: "Mayıs", gider: 4100 },
];

const AnalyticsPage: React.FC = () => {
  const [segmentValue, setSegmentValue] = React.useState<
    "monthly" | "category"
  >("monthly");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analiz</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segmentValue}
            onIonChange={(e) =>
              setSegmentValue(e.detail.value as "monthly" | "category")
            }
          >
            <IonSegmentButton value="monthly">
              <IonLabel>Aylık Trend</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="category">
              <IonLabel>Kategori Dağılımı</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {segmentValue === "monthly" && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Son 5 Ayın Gider Trendi (₺)</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockSpendingData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={(value) => {
                        if (typeof value === "number") {
                          return [`₺ ${value.toFixed(2)}`, "Gider"];
                        }
                        return [value, "Gider"];
                      }}
                      contentStyle={{
                        backgroundColor: "#2e2e2e",
                        border: "none",
                      }}
                    />
                    <Bar dataKey="gider" fill="#82ca9d" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </IonCardContent>
          </IonCard>
        )}
        {segmentValue === "category" && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Kategori Dağılımı</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText color="medium">
                <p>
                  Bu alana ileride Eğlence, Yazılım, Faydalı Hizmetler gibi
                  kategorilere ayrılmış Pastayı (Pie Chart) ekleyeceğiz.
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsPage;
