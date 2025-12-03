import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
  IonModal,
} from "@ionic/react";
import { add, alertCircleOutline } from "ionicons/icons";

// --- IMPORTLARA DİKKAT ---
// Store ve Modal importları (kendi proje yapına göre ../ sayısını kontrol et)

// Utils importu (Buradaki ../../../ sayısı dosya yapına göre değişebilir ama genelde budur)
import { getPlatformConfig } from "../../../utils/platforms";
import { useSubStore } from "../subscriptions/store/subscriptionStore";
import AddSubscriptionModal from "../subscriptions/components/AddSubscriptionModal";

const ListPage: React.FC = () => {
  const subscriptions = useSubStore((state) => state.subscriptions);
  const getTotalMonthlyExpenseTRY = useSubStore(
    (state) => state.getTotalMonthlyExpenseTRY
  );

  const [showModal, setShowModal] = useState(false);
  const totalExpense = getTotalMonthlyExpenseTRY();

  // DİKKAT: Burada "IconComponent" veya "config" tanımlaması YAPMIYORUZ.
  // Çünkü burada hangi abonelikten bahsettiğimizi henüz bilmiyoruz.

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Aboneliklerim</IonTitle>
        </IonToolbar>

        <IonToolbar className="ion-padding-start">
          <IonText color="medium">
            <p>Toplam Aylık Gider (₺):</p>
          </IonText>
          <IonTitle size="large">{totalExpense.toFixed(2)} ₺</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          {subscriptions.length === 0 ? (
            // Boş Durum (Empty State)
            <div
              style={{
                padding: "50px 20px",
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              <IonIcon
                icon={alertCircleOutline}
                style={{ fontSize: "64px", color: "#666" }}
              />
              <h3>Hiç Abonelik Yok</h3>
              <p>Sağ alttaki + butonuna basarak ilk aboneliğini ekle.</p>
            </div>
          ) : (
            // --- LİSTELEME DÖNGÜSÜ BURADA BAŞLIYOR ---
            subscriptions.map((sub: any) => {
              // 1. ÖNCE config'i bu abonelik (sub) için çekiyoruz
              const config = getPlatformConfig(sub.platform || "custom");

              // 2. SONRA o config'in içindeki ikonu bir değişkene atıyoruz
              const IconComponent = config.icon;

              return (
                <IonItem key={sub.id} detail={true} button lines="full">
                  {/* İkon Alanı */}
                  <div
                    slot="start"
                    style={{
                      backgroundColor: config.color + "20", // Rengin şeffaf hali
                      color: config.color,
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      marginRight: "12px",
                    }}
                  >
                    {/* İkonu burada 'Render' ediyoruz */}
                    <IconComponent />
                  </div>

                  <IonLabel>
                    <h2 style={{ fontWeight: "bold" }}>{sub.name}</h2>
                    <p>
                      {sub.billingPeriod === "yearly" ? "Yıllık" : "Aylık"} •{" "}
                      {new Date(sub.firstBillDate).toLocaleDateString("tr-TR")}
                    </p>
                  </IonLabel>

                  <IonBadge
                    slot="end"
                    color={sub.isActive ? "success" : "medium"}
                  >
                    {sub.price} {sub.currency}
                  </IonBadge>
                </IonItem>
              );
            })
            // --- DÖNGÜ BİTİŞİ ---
          )}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)} color="success">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <AddSubscriptionModal dismissModal={() => setShowModal(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ListPage;
