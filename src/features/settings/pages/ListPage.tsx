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
  IonModal,
  useIonAlert,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonToast,
  IonReorderGroup,
  IonReorder,
  IonButtons,
  IonButton,
} from "@ionic/react";
import {
  add,
  informationCircle,
  pricetagOutline,
  trash,
  ellipsisVerticalOutline,
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
  const reorderSubscriptions = useSubStore(
    (state) => state.reorderSubscriptions
  );

  const [isReorderEnabled, setIsReorderEnabled] = useState(false);

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

  const handleReorder = (event: CustomEvent) => {
    reorderSubscriptions(event.detail.from, event.detail.to);
    event.detail.complete();
  };

  useEffect(() => {
    const hasSeenTip = localStorage.getItem("hasSeenSwipeTip");
    if (subscriptions.length > 0 && !hasSeenTip && !isReorderEnabled) {
      const timer = setTimeout(() => {
        setShowTip(true);
        localStorage.setItem("hasSeenSwipeTip", "true");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [subscriptions.length, isReorderEnabled]);

  const renderItemContent = (
    sub: any,
    isPast: boolean,
    subDescription: string,
    config: any,
    IconComponent: any,
    isThisMonth: boolean
  ) => {
    const shouldBeGrayedOut = sub.billingPeriod === "onetime" && isPast;

    return (
      <>
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
            opacity: shouldBeGrayedOut ? 0.5 : 1,
          }}
        >
          <IconComponent />
        </div>

        <IonLabel>
          <h2
            style={{
              fontWeight: "bold",
              color: shouldBeGrayedOut ? "#888" : "",
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
      </>
    );
  };
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ "--background": "transparent" } as any}>
          <IonTitle
            style={{ fontWeight: "800", fontSize: "24px", color: "#333" }}
          >
            Tally
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => setIsReorderEnabled(!isReorderEnabled)}
              color="dark"
            >
              <IonIcon
                icon={ellipsisVerticalOutline}
                slot="icon-only"
                color={isReorderEnabled ? "primary" : "medium"}
              />
            </IonButton>
          </IonButtons>
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
              <IonIcon
                icon={pricetagOutline}
                style={{ fontSize: "96px", color: "var(--ion-color-medium)" }}
              />

              <h3
                style={{
                  margin: "16px 0 8px 0",
                  fontWeight: "700",
                  color: "var(--ion-color-dark)",
                }}
              >
                Henüz Hiç Abonelik Kaydı Yok
              </h3>

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

              <IonIcon
                icon={add}
                color="success"
                style={{ fontSize: "32px", marginTop: "30px", opacity: 0.6 }}
              />
            </div>
          ) : (
            <IonReorderGroup
              disabled={!isReorderEnabled}
              onIonReorderEnd={handleReorder}
            >
              {subscriptions.map((sub: any) => {
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

                return isReorderEnabled ? (
                  <IonItem key={sub.id} lines="full">
                    {renderItemContent(
                      sub,
                      isPast,
                      subDescription,
                      config,
                      IconComponent,
                      isThisMonth
                    )}
                    <IonReorder slot="end" />
                  </IonItem>
                ) : (
                  <IonItemSliding key={sub.id}>
                    <IonItem
                      lines="full"
                      button
                      onClick={() => openEditModal(sub)}
                    >
                      {renderItemContent(
                        sub,
                        isPast,
                        subDescription,
                        config,
                        IconComponent,
                        isThisMonth
                      )}
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
              })}
            </IonReorderGroup>
          )}
        </IonList>

        {/* --- Ekleme Butonu --- */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              setSelectedSub(null);
              setShowModal(true);
            }}
            color="success"
            disabled={isReorderEnabled}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonToast
          isOpen={showTip && !isReorderEnabled}
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
