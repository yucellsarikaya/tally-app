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
} from "@ionic/react";

import { useSubStore } from "../subscriptions/store/subscriptionStore";
import MonthlyBarChart from "./components/MonthlyBarChart";
import CategoryPieChart from "./components/CategoryPieChart";

const COLORS = [
  "#7C3AED",
  "#4F46E5",
  "#00ffc8",
  "#FF8042",
  "#FFBB28",
  "#00C49F",
];

const AnalyticsPage: React.FC = () => {
  const subscriptions = useSubStore((state) => state.subscriptions);
  const [segmentValue, setSegmentValue] = React.useState<
    "monthly" | "category"
  >("monthly");

  const getCategoryData = () => {
    const categoryMap = subscriptions.reduce((acc, sub) => {
      if (!sub.isActive || sub.billingPeriod === "onetime") return acc;

      const category = sub.name;
      let monthlyCost = sub.price;

      if (sub.billingPeriod === "yearly") {
        monthlyCost = sub.price / 12;
      }

      acc[category] = (acc[category] || 0) + monthlyCost;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(categoryMap).map((category, index) => ({
      name: category,
      value: parseFloat(categoryMap[category].toFixed(2)),
      color: COLORS[index % COLORS.length],
    }));
  };

  const categoryData = getCategoryData();

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

      <IonContent
        fullscreen
        className="ion-padding"
        style={{ "--background": "#f5f5f5" } as any}
      >
        {/* YENİ BİLEŞEN ÇAĞRILARI */}
        {segmentValue === "monthly" && <MonthlyBarChart />}

        {segmentValue === "category" && (
          <CategoryPieChart categoryData={categoryData} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsPage;
