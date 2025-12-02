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
import { add } from "ionicons/icons";
// import { useSubStore } from "../store/subscriptionStore"; // Abonelik verisi buradan gelir
// import AddSubscriptionModal from "../components/AddSubscriptionModal"; // Henüz oluşturmadık, placeholder!

const ListPage: React.FC = () => {
  // Zustand'dan ihtiyacımız olan verileri ve fonksiyonları çekiyoruz
  //   const subscriptions = useSubStore((state) => state.subscriptions);
  //   const getTotalMonthlyExpenseTRY = useSubStore(
  //     (state) => state.getTotalMonthlyExpenseTRY
  //   );

  const [showModal, setShowModal] = useState(false);

  // Toplam gideri bir değişkende tutuyoruz (Her render'da yeniden hesaplanır)
  //   const totalExpense = getTotalMonthlyExpenseTRY();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Aboneliklerim</IonTitle>
        </IonToolbar>

        {/* TOPLAM GİDER BÖLÜMÜ */}
        <IonToolbar className="ion-padding-start">
          <IonText color="medium">
            <p>Toplam Aylık Gider (₺):</p>
          </IonText>
          <IonTitle size="large">₺</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>TODO</IonList>

        {/* YENİ ABONELİK EKLEME BUTONU (FAB - Floating Action Button) */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)} color="success">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* ABONELİK EKLEME MODALI */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          TODO
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ListPage;
