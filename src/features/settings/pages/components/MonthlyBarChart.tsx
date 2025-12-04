import React from "react";
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
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          padding: "12px 16px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          border: "none",
          textAlign: "center",
          minWidth: "100px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#aaa",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          ₺{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const getLastFiveMonths = () => {
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
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
  const subscriptions = useSubStore((state) => state.subscriptions);

  const spendingData = React.useMemo(() => {
    return getTrendData(getTotalExpenseForMonth);
  }, [getTotalExpenseForMonth, subscriptions]);

  return (
    <div style={{ width: "100%", height: "300px", marginTop: "10px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={spendingData}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barSize={32}
        >
          <defs>
            <linearGradient id="colorGider" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickFormatter={(value) => `₺${value}`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.03)", radius: 8 }}
          />

          <Bar
            dataKey="gider"
            fill="url(#colorGider)"
            radius={[8, 8, 8, 8]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
