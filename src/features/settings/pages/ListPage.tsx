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
  pricetagOutline,
  trash,
} from "ionicons/icons";

import { getPlatformConfig } from "../../../utils/platforms";
import { useSubStore } from "../subscriptions/store/subscriptionStore";
import AddSubscriptionModal from "../subscriptions/components/AddSubscriptionModal";
import ExpenseCard from "../subscriptions/components/ExpenseCard";

const ListPage: React.FC = () => {
  const subscriptions = useSubStore((state) => state.subscriptions);
  const getTotalMonthlyExpenseTRY = useSubStore(
    (state) => state.getTotalMonthlyExpenseTRY
  );
  const removeSubscription = useSubStore((state) => state.removeSubscription);

  const [showModal, setShowModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [showTip, setShowTip] = useState(false);

  const [presentAlert] = useIonAlert();
  const totalExpense = getTotalMonthlyExpenseTRY();

  const openEditModal = (sub: any) => {
    setSelectedSub(sub);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedSub(null);
    }, 200);
  };

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
          role: "destructive",
          handler: () => {
            removeSubscription(id);
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

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ "--background": "transparent" } as any}>
          <IonTitle
            style={{ fontWeight: "800", fontSize: "24px", color: "#333" }}
          >
            Tally
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ExpenseCard totalExpense={totalExpense} />
        <div
          style={{
            padding: "0 20px 10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <h3 style={{ margin: 0, fontWeight: "700", color: "#444" }}>
            Ödemelerim
          </h3>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {subscriptions.length} adet
          </span>
        </div>
        <IonList>
          {subscriptions.length === 0 ? (
            <div
              style={{
                padding: "80px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* İlgili ve Büyük İkon */}
              <IonIcon
                icon={pricetagOutline} // Fiyat etiketi/Takip ikonu
                // Orta tonlu renk, dikkat dağıtmasın
                style={{ fontSize: "96px", color: "var(--ion-color-medium)" }}
              />

              {/* Başlık */}
              <h3
                style={{
                  margin: "16px 0 8px 0",
                  fontWeight: "700",
                  color: "var(--ion-color-dark)",
                }}
              >
                Henüz Hiç Abonelik Kaydı Yok
              </h3>

              {/* Yönlendirme Metni */}
              <p
                style={{
                  margin: 0,
                  color: "var(--ion-color-medium)",
                  maxWidth: "280px",
                }}
              >
                Harcamalarını ve tekrar eden aboneliklerini takip etmeye
                başlamak için aşağıdaki yeşil **+** butonuna dokun.
              </p>

              {/* Görsel Yönlendirme İpucu */}
              <IonIcon
                icon={add}
                color="success" // FAB butonuyla aynı renk
                style={{ fontSize: "32px", marginTop: "30px", opacity: 0.6 }}
              />
            </div>
          ) : (
            subscriptions.map((sub: any) => {
              const config = getPlatformConfig(sub.platform || "custom");
              const IconComponent = config.icon;
              const billDate = new Date(sub.firstBillDate);
              const now = new Date();
              const isThisMonth =
                billDate.getMonth() === now.getMonth() &&
                billDate.getFullYear() === now.getFullYear();
              const isPast = billDate < now && !isThisMonth;

              let subDescription = "";

              if (sub.billingPeriod === "onetime") {
                if (isThisMonth) {
                  subDescription = `✅ Bu Ayın Harcaması • ${billDate.toLocaleDateString(
                    "tr-TR"
                  )}`;
                } else if (isPast) {
                  subDescription = `⚠️ Geçmiş Harcama • ${billDate.toLocaleDateString(
                    "tr-TR"
                  )}`;
                } else {
                  subDescription = `📅 Planlanan • ${billDate.toLocaleDateString(
                    "tr-TR"
                  )}`;
                }
              } else {
                subDescription = `${
                  sub.billingPeriod === "yearly" ? "Yıllık" : "Aylık"
                } • İlk Ödeme: ${billDate.toLocaleDateString("tr-TR")}`;
              }

              return (
                <IonItemSliding key={sub.id}>
                  <IonItem
                    key={sub.id}
                    lines="full"
                    button
                    onClick={() => openEditModal(sub)}
                  >
                    <div
                      slot="start"
                      style={{
                        backgroundColor: config.color + "20",
                        color: config.color,
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        marginRight: "12px",
                        opacity: isPast ? 0.5 : 1,
                      }}
                    >
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
          )}
        </IonList>

        {/* --- Ekleme Butonu --- */}
        {/* ÖNEMLİ: Tıklayınca seçili veriyi sıfırlıyoruz ki temiz form gelsin */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              setSelectedSub(null);
              setShowModal(true);
            }}
            color="success"
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* --- İpucu Toast --- */}
        <IonToast
          isOpen={showTip}
          onDidDismiss={() => setShowTip(false)}
          message="💡 İpucu: Düzenlemek veya silmek için aboneliği sola kaydırın."
          duration={3000}
          position="bottom"
          icon={informationCircle}
          color="dark"
          buttons={[
            {
              text: "Tamam",
              role: "cancel",
              handler: () => {
                console.log("İpucu kapatıldı");
              },
            },
          ]}
        />

        {/* --- Tek ve Doğru Modal --- */}
        <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
          <AddSubscriptionModal
            dismissModal={handleCloseModal}
            editingSubscription={selectedSub}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ListPage;
