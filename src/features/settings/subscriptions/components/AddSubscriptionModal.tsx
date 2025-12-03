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
  IonNote,
} from "@ionic/react";
import { chevronForward, close } from "ionicons/icons";
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>{editingSubscription ? "Düzenle" : "Yeni Ekle"}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={dismissModal}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem
            button
            detail={true}
            detailIcon={chevronForward}
            onClick={() => setShowPlatformModal(true)}
            className="ion-margin-bottom"
            lines="full"
          >
            <IonLabel position="stacked">Servis / Platform</IonLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "4px",
                gap: "5px",
              }}
            >
              <div
                style={{
                  backgroundColor: currentPlatformConfig.color + "20",
                  color: currentPlatformConfig.color,
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                }}
              >
                <CurrentIcon style={{ fontSize: "10px" }} />
              </div>
              <IonLabel style={{ fontWeight: "600", fontSize: "16px" }}>
                {currentPlatformConfig.name}
              </IonLabel>
            </div>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Abonelik Adı</IonLabel>
            <IonInput
              value={formData.name}
              onIonChange={(e) => handleChange("name", e.detail.value!)}
              placeholder="Örn: Netflix"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Fiyat</IonLabel>
            <div
              style={{ display: "flex", width: "100%", alignItems: "center" }}
            >
              <IonInput
                type="number"
                value={formData.price}
                onIonChange={(e) => handleChange("price", e.detail.value!)}
                placeholder="0.00"
              />
              <IonSelect
                value={formData.currency}
                interface="popover"
                onIonChange={(e) => handleChange("currency", e.detail.value)}
              >
                <IonSelectOption value="TRY">TRY</IonSelectOption>
                <IonSelectOption value="USD">USD</IonSelectOption>
                <IonSelectOption value="EUR">EUR</IonSelectOption>
              </IonSelect>
            </div>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Ödeme Sıklığı</IonLabel>
            <IonSelect
              value={formData.billingPeriod}
              interface="action-sheet"
              onIonChange={(e) => handleChange("billingPeriod", e.detail.value)}
            >
              <IonSelectOption value="monthly">Aylık</IonSelectOption>
              <IonSelectOption value="yearly">Yıllık</IonSelectOption>
              <IonSelectOption value="onetime">Tek Seferlik</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">İlk Fatura Tarihi</IonLabel>
            <IonInput
              type="date"
              value={formData.firstBillDate.split("T")[0]}
              onIonChange={(e) => handleChange("firstBillDate", e.detail.value)}
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleSave}
          color="primary"
          shape="round"
        >
          {editingSubscription ? "Güncelle" : "Kaydet"}
        </IonButton>
      </IonContent>
      <IonModal
        isOpen={showPlatformModal}
        onDidDismiss={() => setShowPlatformModal(false)}
        style={{
          "--height": "70%",
          "--width": "90%",
          "--max-width": "400px",
          "--border-radius": "16px",
          "--box-shadow": "0 10px 15px rgba(0,0,0,0.1)",
        }}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Platform Seç</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowPlatformModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              placeholder="Ara..."
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(e.detail.value!)}
              debounce={300}
            />
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList lines="full">
            {filteredPlatforms.map(([key, platform]) => {
              const Icon = platform.icon;
              return (
                <IonItem
                  key={key}
                  button
                  detail={false}
                  onClick={() => handlePlatformSelect(key)}
                >
                  <div
                    slot="start"
                    style={{
                      backgroundColor: platform.color + "20",
                      color: platform.color,
                      width: 40,
                      height: 40,
                      borderRadius: 10,
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

            {filteredPlatforms.length === 0 && (
              <div
                style={{ textAlign: "center", padding: "20px", color: "#888" }}
              >
                Sonuç bulunamadı.
              </div>
            )}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default AddSubscriptionModal;
