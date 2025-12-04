import React, { useMemo, useState } from "react";
import {
  IonPage,
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
  "#FF4D4D",
];

const AnalyticsPage: React.FC = () => {
  const subscriptions = useSubStore((state) => state.subscriptions);
  const [segmentValue, setSegmentValue] = useState<"monthly" | "category">(
    "monthly"
  );

  const categoryData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryMap = subscriptions.reduce((acc, sub) => {
      if (!sub.isActive) return acc;
      let monthlyCost = 0;

      if (sub.billingPeriod === "onetime") {
        const dateString = sub.firstBillDate;

        if (dateString) {
          const billDate = new Date(dateString);
          const isThisMonth =
            billDate.getMonth() === currentMonth &&
            billDate.getFullYear() === currentYear;

          if (isThisMonth) {
            monthlyCost = sub.price;
          } else {
            return acc;
          }
        }
      } else if (sub.billingPeriod === "yearly") {
        monthlyCost = sub.price / 12;
      } else {
        monthlyCost = sub.price;
      }

      const category = sub.name;
      acc[category] = (acc[category] || 0) + monthlyCost;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(categoryMap).map((category, index) => ({
      name: category,
      value: parseFloat(categoryMap[category].toFixed(2)),
      color: COLORS[index % COLORS.length],
    }));
  }, [subscriptions]);

  return (
    <IonPage>
      <IonContent style={{ "--background": "#f2f2f7" }}>
        <div
          style={{ padding: "20px", paddingBottom: "100px", marginTop: "50px" }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "6px",
              borderRadius: "16px",
              marginBottom: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <IonSegment
              value={segmentValue}
              onIonChange={(e) =>
                setSegmentValue(e.detail.value as "monthly" | "category")
              }
              mode="ios"
              style={{ "--background": "transparent" }}
            >
              <IonSegmentButton value="monthly">
                <IonLabel style={{ fontWeight: "600", fontSize: "13px" }}>
                  Aylık Trend
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="category">
                <IonLabel style={{ fontWeight: "600", fontSize: "13px" }}>
                  Kategori
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              minHeight: "420px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "15px", textAlign: "center" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#1c1c1e",
                }}
              >
                {segmentValue === "monthly"
                  ? "Harcama Geçmişi"
                  : "Kategori Dağılımı"}
              </h2>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "13px",
                  color: "#8e8e93",
                }}
              >
                {segmentValue === "monthly"
                  ? "Son 5 ayın toplam giderleri"
                  : "Bu ayın giderlerinin dağılımı"}
              </p>
            </div>

            <div style={{ flex: 1, width: "100%", minHeight: "300px" }}>
              {segmentValue === "monthly" ? (
                <MonthlyBarChart />
              ) : categoryData.length > 0 ? (
                <CategoryPieChart categoryData={categoryData} />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    gap: "10px",
                  }}
                >
                  <p>Bu ay için henüz harcama verisi yok.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AnalyticsPage;
