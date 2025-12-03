import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
} from "@ionic/react";
import { useSubStore, Subscription } from "../store/subscriptionStore";
import { PLATFORMS } from "../../../../utils/platforms";

// ----------------------------------------------------
// 1. Yeni initial state (platform alanı eklendi)
// ----------------------------------------------------
const initialFormData = {
  name: "",
  price: 0,
  platform: "netflix" as string, // Varsayılan: netflix (veya 'custom' yapabilirsin)
  currency: "TRY" as Subscription["currency"],
  billingPeriod: "monthly" as Subscription["billingPeriod"],
  firstBillDate: new Date().toISOString(),
};

type FormData = typeof initialFormData; // Form verilerinin tipini otomatik çıkar

interface AddSubscriptionModalProps {
  dismissModal: () => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  dismissModal,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const addSubscription = useSubStore((state) => state.addSubscription);

  // ----------------------------------------------------
  // 2. Platform değişimini ve isim otomatik doldurmayı yöneten yeni fonksiyon
  // ----------------------------------------------------
  const handlePlatformChange = (platformId: string) => {
    const config = PLATFORMS[platformId];

    setFormData((prev) => ({
      ...prev,
      platform: platformId,
      // Platform seçiliyken ismi otomatik doldur. Eğer 'custom' ise boş bırak.
      name: platformId === "custom" ? "" : config.name,
    }));
  };

  const handleChange = (name: keyof FormData, value: any) => {
    // Fiyat alanı sayı olarak gelmeli, diğerleri string kalabilir.
    const finalValue = name === "price" ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSave = () => {
    // Doğrulama: İsim ve Fiyat kontrolü
    if (!formData.name || formData.price <= 0) {
      alert("Lütfen geçerli bir isim ve fiyat girin.");
      return;
    }

    // Veriyi göndermeden önce fiyatı sayıya çevirdiğimizden emin olalım
    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price.toString()),
    };

    addSubscription(dataToSend);
    setFormData(initialFormData);
    dismissModal();
  };

  return (
    <IonModal isOpen={true} onDidDismiss={dismissModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Yeni Abonelik Ekle</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={dismissModal} color="danger">
              Kapat
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList inset>
          {/* 3. PLATFORM SEÇİMİ (YENİ ALAN) */}
          <IonItem>
            <IonLabel>Servis / Platform</IonLabel>
            <IonSelect
              value={formData.platform}
              onIonChange={(e) => handlePlatformChange(e.detail.value!)}
            >
              {Object.values(PLATFORMS).map((p: any) => (
                <IonSelectOption key={p.id} value={p.id}>
                  {p.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* 4. ABONELİK ADI (Platform seçimine göre otomatik dolar) */}
          <IonItem>
            <IonLabel position="stacked">Abonelik Adı</IonLabel>
            <IonInput
              value={formData.name}
              onIonChange={(e) => handleChange("name", e.detail.value!)}
              placeholder="Netflix, Spotify, AWS..."
            />
          </IonItem>

          {/* Fiyat Girişi */}
          <IonItem>
            <IonLabel position="stacked">Aylık/Yıllık Fiyat</IonLabel>
            <IonInput
              type="number"
              value={formData.price}
              onIonChange={(e) => handleChange("price", e.detail.value!)}
              placeholder="99.99"
            />
          </IonItem>

          {/* Para Birimi Seçimi */}
          <IonItem>
            <IonLabel>Para Birimi</IonLabel>
            <IonSelect
              value={formData.currency}
              onIonChange={(e) => handleChange("currency", e.detail.value)}
            >
              <IonSelectOption value="TRY">₺ TRY</IonSelectOption>
              <IonSelectOption value="USD">$ USD</IonSelectOption>
              <IonSelectOption value="EUR">€ EUR</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* Ödeme Sıklığı Seçimi */}
          <IonItem>
            <IonLabel>Ödeme Sıklığı</IonLabel>
            <IonSelect
              value={formData.billingPeriod}
              onIonChange={(e) => handleChange("billingPeriod", e.detail.value)}
            >
              <IonSelectOption value="monthly">Aylık</IonSelectOption>
              <IonSelectOption value="yearly">Yıllık</IonSelectOption>
              {/* YENİ SEÇENEK: */}
              <IonSelectOption value="onetime">Tek Seferlik</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* İlk Fatura Tarihi */}
          <IonItem>
            <IonLabel>İlk Fatura Tarihi</IonLabel>
            <IonDatetime
              value={formData.firstBillDate}
              onIonChange={(e) =>
                handleChange("firstBillDate", e.detail.value!)
              }
              presentation="date"
            />
          </IonItem>
        </IonList>

        <div className="ion-padding-top">
          <IonButton expand="block" onClick={handleSave} color="success">
            Aboneliği Kaydet
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default AddSubscriptionModal;
