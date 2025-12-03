import React, { useEffect, useState } from "react";
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
  useIonAlert,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonToast,
} from "@ionic/react";
import {
  add,
  alertCircleOutline,
  informationCircle,
  trash,
} from "ionicons/icons";

import { getPlatformConfig } from "../../../utils/platforms";
import { useSubStore } from "../subscriptions/store/subscriptionStore";
import AddSubscriptionModal from "../subscriptions/components/AddSubscriptionModal";

const ListPage: React.FC = () => {
  const subscriptions = useSubStore((state) => state.subscriptions);
  const getTotalMonthlyExpenseTRY = useSubStore(
    (state) => state.getTotalMonthlyExpenseTRY
  );

  const [showModal, setShowModal] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const totalExpense = getTotalMonthlyExpenseTRY();
  const removeSubscription = useSubStore((state) => state.removeSubscription);
  const [presentAlert] = useIonAlert();
  const handleDeleteClick = (id: string) => {
    presentAlert({
      header: "Silmek İstediğine Emin misin?",
      message: "Bu işlem geri alınamaz.",
      buttons: [
        {
          text: "Vazgeç",
          role: "cancel",
        },
        {
          text: "Sil",
          role: "destructive", // Kırmızı renkli buton
          handler: () => {
            removeSubscription(id); // Onay verilirse sil
          },
        },
      ],
    });
  };

  useEffect(() => {
    const hasSeenTip = localStorage.getItem("hasSeenSwipeTip");
    if (subscriptions.length > 0 && !hasSeenTip) {
      const timer = setTimeout(() => {
        setShowTip(true);
        localStorage.setItem("hasSeenSwipeTip", "true");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [subscriptions.length]);
  <IonToast
    isOpen={showTip}
    onDidDismiss={() => setShowTip(false)}
    message="💡 İpucu: Düzenlemek veya silmek için aboneliği sola kaydırın."
    duration={40000} // 4 saniye ekranda kalsın
    position="bottom"
    buttons={[
      {
        text: "Tamam",
        role: "cancel",
        handler: () => {
          console.log("İpucu kapatıldı");
        },
      },
    ]}
  />;

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

              // --- TARİH KONTROL MANTIĞI ---
              const billDate = new Date(sub.firstBillDate);
              const now = new Date();

              // Bu işlem BU AY içinde mi?
              const isThisMonth =
                billDate.getMonth() === now.getMonth() &&
                billDate.getFullYear() === now.getFullYear();

              // Bu işlem GEÇMİŞTE mi kalmış? (Bu ay değil ve tarihi bugünden küçük)
              const isPast = billDate < now && !isThisMonth;

              // --- ETİKET METNİ OLUŞTURMA ---
              let subDescription = "";

              if (sub.billingPeriod === "onetime") {
                if (isThisMonth) {
                  subDescription = `✅ Bu Ayın Harcaması • ${billDate.toLocaleDateString(
                    "tr-TR"
                  )}`;
                } else if (isPast) {
                  // YENİ: Geçmiş olduğunu belirtiyoruz
                  subDescription = `⚠️ Geçmiş Harcama • ${billDate.toLocaleDateString(
                    "tr-TR"
                  )}`;
                } else {
                  // Gelecek harcama
                  subDescription = `📅 Planlanan • ${billDate.toLocaleDateString(
                    "tr-TR"
                  )}`;
                }
              } else {
                // Normal Abonelik (Aylık/Yıllık)
                subDescription = `${
                  sub.billingPeriod === "yearly" ? "Yıllık" : "Aylık"
                } • İlk Ödeme: ${billDate.toLocaleDateString("tr-TR")}`;
              }

              // --- RENK AYARLAMA ---
              // Geçmiş harcamaları biraz soluk gösterelim
              const itemColor =
                sub.billingPeriod === "onetime" && isPast ? "medium" : "";
              return (
                <IonItemSliding key={sub.id}>
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
                      <h2
                        style={{
                          fontWeight: "bold",
                          color: isPast ? "#888" : "",
                        }}
                      >
                        {sub.name}
                      </h2>
                      <p
                        style={{
                          color:
                            sub.billingPeriod === "onetime" && isThisMonth
                              ? "var(--ion-color-success-shade)"
                              : "",
                        }}
                      >
                        {subDescription}
                      </p>
                    </IonLabel>
                    <IonBadge
                      slot="end"
                      color={
                        !sub.isActive
                          ? "medium"
                          : sub.billingPeriod === "onetime"
                          ? isThisMonth
                            ? "warning"
                            : "medium"
                          : "success"
                      }
                    >
                      {sub.price} {sub.currency}
                    </IonBadge>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption
                      color="danger"
                      onClick={() => handleDeleteClick(sub.id)}
                    >
                      <IonIcon slot="icon-only" icon={trash} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
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

        <IonToast
          isOpen={showTip}
          onDidDismiss={() => setShowTip(false)}
          message="💡 İpucu: Silmek için öğeyi sola kaydırın."
          duration={3000}
          position="bottom"
          icon={informationCircle}
          color="dark"
          buttons={[
            {
              text: "Tamam",
              role: "cancel",
            },
          ]}
        />

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <AddSubscriptionModal dismissModal={() => setShowModal(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ListPage;
