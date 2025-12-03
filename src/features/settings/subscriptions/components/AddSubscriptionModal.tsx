import React, { useEffect, useState } from "react";
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
interface AddSubscriptionModalProps {
  dismissModal: () => void;
  editingSubscription?: any; // YENİ: Düzenlenecek veri (opsiyonel)
}
type FormData = typeof initialFormData; // Form verilerinin tipini otomatik çıkar

interface AddSubscriptionModalProps {
  dismissModal: () => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  dismissModal,
  editingSubscription,
}) => {
  const addSubscription = useSubStore((state) => state.addSubscription);
  const updateSubscription = useSubStore((state) => state.updateSubscription);

  const [formData, setFormData] = useState({
    name: "",
    platform: "custom",
    price: "",
    currency: "TRY",
    billingPeriod: "monthly",
    firstBillDate: new Date().toISOString(),
    isActive: true,
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        name: editingSubscription.name,
        platform: editingSubscription.platform,
        price: editingSubscription.price.toString(),
        currency: editingSubscription.currency,
        billingPeriod: editingSubscription.billingPeriod,
        firstBillDate: editingSubscription.firstBillDate,
        isActive: editingSubscription.isActive,
      });
    } else {
      // Ekleme modu için varsayılanlar
      setFormData({
        name: "",
        platform: "custom",
        price: "",
        currency: "TRY",
        billingPeriod: "monthly",
        firstBillDate: new Date().toISOString(),
        isActive: true,
      });
    }
  }, [editingSubscription]); // editingSubscription değişince çalışır

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
    if (!formData.name || !formData.price) {
      alert("Lütfen isim ve fiyat giriniz.");
      return;
    }

    if (editingSubscription) {
      // --- GÜNCELLEME MANTIĞI ---
      updateSubscription(editingSubscription.id, {
        name: formData.name,
        platform: formData.platform,
        price: parseFloat(formData.price),
        currency: formData.currency as any,
        billingPeriod: formData.billingPeriod as any,
        firstBillDate: formData.firstBillDate,
        isActive: formData.isActive,
      });
    } else {
      // --- EKLEME MANTIĞI ---
      const newSub = {
        id: crypto.randomUUID(),
        ...formData,
        price: parseFloat(formData.price),
        currency: formData.currency as any,
        billingPeriod: formData.billingPeriod as any,
        isActive: true,
      };
      addSubscription(newSub);
    }

    dismissModal();
  };

  return (
    <IonModal isOpen={true} onDidDismiss={dismissModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {editingSubscription ? "Ödeme Güncelle" : "Ödeme Ekle"}{" "}
          </IonTitle>
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
            <IonLabel position="stacked">Ödeme Adı</IonLabel>
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
          <IonButton
            expand="block"
            className="ion-margin-top"
            onClick={handleSave}
          >
            {editingSubscription ? "Güncelle" : "Kaydet"}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default AddSubscriptionModal;
