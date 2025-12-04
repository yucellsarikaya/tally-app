import React, { useState, useEffect } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonIcon,
  IonSearchbar,
  IonDatetime, // Tarih seçici için native hissi
  IonDatetimeButton,
} from "@ionic/react";
import { chevronForward, calendarOutline, repeatOutline } from "ionicons/icons";
import { useSubStore } from "../store/subscriptionStore";
import { PLATFORMS } from "../../../../utils/platforms";

interface AddSubscriptionModalProps {
  dismissModal: () => void;
  editingSubscription?: any;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  dismissModal,
  editingSubscription,
}) => {
  const addSubscription = useSubStore((state) => state.addSubscription);
  const updateSubscription = useSubStore((state) => state.updateSubscription);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        platform: editingSubscription.platform || "custom",
        price: editingSubscription.price.toString(),
        currency: editingSubscription.currency,
        billingPeriod: editingSubscription.billingPeriod,
        firstBillDate: editingSubscription.firstBillDate,
        isActive: editingSubscription.isActive,
      });
    } else {
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
  }, [editingSubscription]);

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    if (editingSubscription) {
      updateSubscription(editingSubscription.id, {
        ...formData,
        price: parseFloat(formData.price),
        currency: formData.currency as any,
        billingPeriod: formData.billingPeriod as any,
      });
    } else {
      addSubscription({
        id: crypto.randomUUID(),
        ...formData,
        price: parseFloat(formData.price),
        currency: formData.currency as any,
        isActive: true,
        billingPeriod: formData.billingPeriod as any,
      });
    }
    dismissModal();
  };

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handlePlatformSelect = (platformKey: string) => {
    const selectedPlatform = PLATFORMS[platformKey];
    setFormData({
      ...formData,
      platform: platformKey,
      name:
        selectedPlatform.name === "Diğer (Özel)" ? "" : selectedPlatform.name,
    });
    setShowPlatformModal(false);
  };

  const currentPlatformConfig =
    PLATFORMS[formData.platform] || PLATFORMS["custom"];
  const CurrentIcon = currentPlatformConfig.icon;
  const filteredPlatforms = Object.entries(PLATFORMS).filter(([key, p]) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* HEADER: Sade ve Temiz */}
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ "--background": "#f2f2f7" }}>
          {" "}
          {/* iOS Gri Arkaplanı */}
          <IonButtons slot="end">
            <IonButton
              onClick={dismissModal}
              color="primary"
              style={{ fontWeight: "600" }}
            >
              Vazgeç
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ "--background": "#f2f2f7" }}>
        <div style={{ padding: "0 20px 20px 20px" }}>
          {/* BÜYÜK BAŞLIK */}
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginTop: "0px",
              marginBottom: "20px",
              color: "#1c1c1e",
            }}
          >
            {editingSubscription ? "Düzenle" : "Yeni Ödeme Ekle"}
          </h1>

          {/* 1. KART: PLATFORM SEÇİMİ (Vurgulu Alan) */}
          <div
            onClick={() => setShowPlatformModal(true)}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: currentPlatformConfig.color + "20",
                  color: currentPlatformConfig.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                <CurrentIcon />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#8e8e93",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  Servis
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1c1c1e",
                  }}
                >
                  {currentPlatformConfig.name}
                </div>
              </div>
            </div>
            <IonIcon icon={chevronForward} style={{ color: "#c7c7cc" }} />
          </div>

          {/* 2. GRUP: TEMEL BİLGİLER (İsim ve Fiyat) */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            {/* İsim */}
            <IonItem lines="full" style={{ "--padding-start": "20px" }}>
              <IonLabel
                position="fixed"
                style={{ fontWeight: "600", color: "#1c1c1e" }}
              >
                Ad
              </IonLabel>
              <IonInput
                value={formData.name}
                placeholder="Örn: Netflix"
                onIonChange={(e) => handleChange("name", e.detail.value!)}
                style={{ textAlign: "right", fontWeight: "500" }}
              />
            </IonItem>

            {/* Fiyat ve Para Birimi */}
            <IonItem lines="none" style={{ "--padding-start": "20px" }}>
              <IonLabel
                position="fixed"
                style={{ fontWeight: "600", color: "#1c1c1e" }}
              >
                Fiyat
              </IonLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <IonInput
                  type="number"
                  value={formData.price}
                  placeholder="0.00"
                  onIonChange={(e) => handleChange("price", e.detail.value!)}
                  style={{
                    textAlign: "right",
                    fontWeight: "500",
                    maxWidth: "100px",
                  }}
                />
                <div
                  style={{
                    height: "24px",
                    width: "1px",
                    backgroundColor: "#e5e5ea",
                  }}
                ></div>
                <IonSelect
                  value={formData.currency}
                  interface="popover"
                  onIonChange={(e) => handleChange("currency", e.detail.value)}
                  style={{
                    paddingRight: "0",
                    fontWeight: "600",
                    color: "#007aff",
                  }}
                >
                  <IonSelectOption value="TRY">TRY</IonSelectOption>
                  <IonSelectOption value="USD">USD</IonSelectOption>
                  <IonSelectOption value="EUR">EUR</IonSelectOption>
                </IonSelect>
              </div>
            </IonItem>
          </div>

          {/* 3. GRUP: DETAYLAR (Sıklık ve Tarih) */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            {/* Ödeme Sıklığı */}
            <IonItem lines="full" style={{ "--padding-start": "20px" }}>
              <div
                slot="start"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#8e8e93",
                }}
              >
                <IonIcon icon={repeatOutline} style={{ fontSize: "20px" }} />
              </div>
              <IonLabel style={{ fontWeight: "500" }}>Sıklık</IonLabel>
              <IonSelect
                value={formData.billingPeriod}
                interface="action-sheet"
                onIonChange={(e) =>
                  handleChange("billingPeriod", e.detail.value)
                }
                style={{ fontWeight: "500", color: "#007aff" }}
              >
                <IonSelectOption value="monthly">Aylık</IonSelectOption>
                <IonSelectOption value="yearly">Yıllık</IonSelectOption>
                <IonSelectOption value="onetime">Tek Seferlik</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* İlk Fatura Tarihi - Native Stil */}
            <IonItem lines="none" style={{ "--padding-start": "20px" }}>
              <div
                slot="start"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#8e8e93",
                }}
              >
                <IonIcon icon={calendarOutline} style={{ fontSize: "20px" }} />
              </div>
              <IonLabel style={{ fontWeight: "500" }}>Başlangıç</IonLabel>
              {/* NOT: IonDatetimeButton ve IonDatetime kullanımı modern yaklaşımdır.
                    Modal içinde modal açar.
                */}
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="datetime"
                  presentation="date"
                  value={formData.firstBillDate}
                  onIonChange={(e) =>
                    handleChange("firstBillDate", e.detail.value)
                  }
                ></IonDatetime>
              </IonModal>
            </IonItem>
          </div>

          {/* KAYDET BUTONU */}
          <IonButton
            expand="block"
            onClick={handleSave}
            color="primary"
            style={{
              height: "56px",
              fontWeight: "700",
              fontSize: "18px",
              "--border-radius": "16px",
              "--box-shadow": "0 8px 20px rgba(0, 122, 255, 0.3)",
            }}
          >
            {editingSubscription ? "Değişiklikleri Kaydet" : "Aboneliği Ekle"}
          </IonButton>
        </div>
      </IonContent>

      <IonModal
        isOpen={showPlatformModal}
        onDidDismiss={() => setShowPlatformModal(false)}
        style={{
          "--border-radius": "16px",
        }}
        presentingElement={undefined}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Servis Seç</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowPlatformModal(false)}>
                Kapat
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(e.detail.value!)}
              placeholder="Servis ara..."
              className="ion-no-padding"
              style={{ paddingInline: "10px" }}
            />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {filteredPlatforms.map(([key, platform]) => {
              const Icon = platform.icon;
              return (
                <IonItem
                  key={key}
                  button
                  detail={false}
                  onClick={() => handlePlatformSelect(key)}
                  lines="full"
                >
                  <div
                    slot="start"
                    style={{
                      backgroundColor: platform.color + "20",
                      color: platform.color,
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    <Icon />
                  </div>
                  <IonLabel style={{ fontWeight: "500" }}>
                    {platform.name}
                  </IonLabel>
                  {formData.platform === key && (
                    <IonIcon icon={chevronForward} slot="end" color="primary" />
                  )}
                </IonItem>
              );
            })}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default AddSubscriptionModal;
