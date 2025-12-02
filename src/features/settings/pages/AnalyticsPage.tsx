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

// --- MOCK VERİSİ (Zustand verisinden gerçek veriyi alana kadar placeholder) ---
// Gerçek projede, bu veri (spendingData) Zustand'dan veya custom bir hook'tan gelmelidir.
const mockSpendingData = [
  { month: "Ocak", gider: 4500 },
  { month: "Şubat", gider: 4800 },
  { month: "Mart", gider: 5200 },
  { month: "Nisan", gider: 4600 },
  { month: "Mayıs", gider: 4100 },
];

const AnalyticsPage: React.FC = () => {
  // Şu an için sadece Abonelik verisine ihtiyacımız var (ileride bu veriyi işleyeceğiz)
  // Toplam Aylık Gideri tekrar hesaplamaya gerek yok, sadece ListPage için çağırmıştık.

  const [segmentValue, setSegmentValue] = React.useState<
    "monthly" | "category"
  >("monthly");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analiz</IonTitle>
        </IonToolbar>

        {/* SEGMENT SEÇİMİ: Aylık Trend mi? Kategori Dağılımı mı? */}
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
        {/* GRAFİK KARTI (Aylık Trend) */}
        {segmentValue === "monthly" && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Son 5 Ayın Gider Trendi (₺)</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockSpendingData} // Gerçek veriyi buraya bağlayacağız
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      // Eski kod: formatter={(value) => [...]
                      formatter={(value) => {
                        // Gelen değerin bir sayı (number) olduğunu kontrol et
                        if (typeof value === "number") {
                          // Sayıysa, toFixed metodunu güvenle kullan ve formatla
                          return [`₺ ${value.toFixed(2)}`, "Gider"];
                        }
                        // Sayı değilse (örneğin string ise), olduğu gibi döndür
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

        {/* GRAFİK KARTI (Kategori Dağılımı) - İleride buraya PieChart gelecek */}
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
