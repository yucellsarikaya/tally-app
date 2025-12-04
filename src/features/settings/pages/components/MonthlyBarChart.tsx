import React from "react";
import {
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
import { useSubStore } from "../../subscriptions/store/subscriptionStore";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ddd",
          padding: "10px",
          color: "#333",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <p className="label">{`${label}`}</p>
        <p
          className="intro"
          style={{ color: "#7C3AED" }}
        >{`Gider : ₺${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const getLastFiveMonths = () => {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const date = new Date();
  const currentMonthIndex = date.getMonth();

  const monthNames = [];
  for (let i = 4; i >= 0; i--) {
    const index = (currentMonthIndex - i + 12) % 12;
    monthNames.push(months[index]);
  }
  return monthNames;
};

const getTrendData = (
  getTotalExpenseForMonth: (month: number, year: number) => number
) => {
  const monthNames = getLastFiveMonths();
  const data = [];
  const date = new Date();

  for (let i = 4; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setMonth(date.getMonth() - i);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const value = getTotalExpenseForMonth(targetMonth, targetYear);
    const month = monthNames[4 - i];

    data.push({ month: month, gider: parseFloat(value.toFixed(2)) });
  }

  return data;
};

const MonthlyBarChart: React.FC = () => {
  const getTotalExpenseForMonth = useSubStore(
    (state) => state.getTotalExpenseForMonth
  );

  const spendingData = React.useMemo(() => {
    return getTrendData(getTotalExpenseForMonth);
  }, [getTotalExpenseForMonth]);

  const currentTotal = spendingData[4]?.gider || 0;
  const hasSpending = currentTotal > 0 || spendingData.some((d) => d.gider > 0);

  return (
    <IonCard style={{ "--background": "#ffffff", color: "#333" }}>
      <IonCardHeader>
        <IonCardTitle>Son 5 Ayın Gider Trendi (₺)</IonCardTitle>{" "}
        {/* Simülasyon etiketi kaldırıldı */}
      </IonCardHeader>
      <IonCardContent>
        {/* Veri Kontrolü */}
        {!hasSpending ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Hiç abonelik gideri bulunamadı. Lütfen abonelik ekleyin.
          </p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={spendingData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="gider" fill="#7C3AED" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default MonthlyBarChart;
