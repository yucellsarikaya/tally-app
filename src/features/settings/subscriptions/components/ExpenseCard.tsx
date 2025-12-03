import React from "react";
import { IonIcon } from "@ionic/react";
import { wallet } from "ionicons/icons";

interface ExpenseCardProps {
  totalExpense: number;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ totalExpense }) => {
  return (
    <div
      style={{
        margin: "10px 16px 24px 16px",
        padding: "24px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        boxShadow:
          "0 10px 25px -5px rgba(79, 70, 229, 0.4), 0 8px 10px -6px rgba(79, 70, 229, 0.2)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "-10px",
          width: "80px",
          height: "80px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Kart İçeriği */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              opacity: 0.9,
              fontWeight: "500",
              letterSpacing: "0.5px",
            }}
          >
            Toplam Aylık Gider
          </p>
          <h1
            style={{
              margin: "8px 0 0 0",
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-1px",
            }}
          >
            {totalExpense.toFixed(2)}{" "}
            <span style={{ fontSize: "24px", fontWeight: "600" }}>₺</span>
          </h1>
        </div>

        {/* Cüzdan İkonu */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: "12px",
            borderRadius: "16px",
            backdropFilter: "blur(5px)",
          }}
        >
          <IonIcon icon={wallet} style={{ fontSize: "32px", color: "white" }} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
