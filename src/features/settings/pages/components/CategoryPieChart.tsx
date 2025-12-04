import React from "react";
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          padding: "12px 16px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          border: "none",
          textAlign: "center",
          minWidth: "120px",
          zIndex: 1000,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#ccc",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {data.name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          ₺{data.value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul
      style={{
        listStyle: "none",
        padding: "10px 0 0 0",
        margin: 0,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            color: "#555",
            fontWeight: "500",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: entry.color,
              borderRadius: "3px",
              marginRight: "6px",
            }}
          ></div>
          {/* Metni kısaltmak için CSS hilesi */}
          <span
            style={{
              maxWidth: "100px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  categoryData,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {categoryData.length > 0 ? (
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={4}
                cornerRadius={6}
                stroke="none"
                animationDuration={1000}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />

              <Legend
                content={renderCustomizedLegend}
                verticalAlign="bottom"
                wrapperStyle={{ width: "100%" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "300px",
            color: "#999",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px", opacity: 0.5 }}>
            🍩
          </div>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              color: "#555",
            }}
          >
            Veri Bulunamadı
          </p>
          <p style={{ fontSize: "14px", margin: 0 }}>
            Bu aya ait harcama verisi yok.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
