import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
} from "@ionic/react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategoryPieChartProps {
  categoryData: Array<{ name: string; value: number; color: string }>;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  categoryData,
}) => (
  <IonCard style={{ "--background": "#ffffff", color: "#333" }}>
    <IonCardHeader>
      <IonCardTitle>Kategori Dağılımı (Aylık Ortalama)</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      {categoryData.length > 0 ? (
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
                label={({ name, percent }: any) => {
                  if (typeof percent === "number") {
                    return `${name} (${(percent * 100).toFixed(0)}%)`;
                  }
                  return name;
                }}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ color: "#333", paddingTop: "10px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  color: "#333",
                }}
                formatter={(value: any) => {
                  if (typeof value === "number") {
                    return [`₺ ${value.toFixed(2)}`, "Gider"];
                  }
                  return [value, "Gider"];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <IonText color="medium">
          <p>
            Aylık ve Yıllık abonelik verileri henüz bulunmamaktadır. Lütfen
            abone ekleyin.
          </p>
        </IonText>
      )}
    </IonCardContent>
  </IonCard>
);

export default CategoryPieChart;
