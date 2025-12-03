import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid"; // Abonelikler için benzersiz ID üretici

// Abonelik verilerinin tip tanımlaması
export interface Subscription {
  id: string;
  name: string;
  platform: string;
  price: number;
  currency: "TRY" | "USD" | "EUR";
  billingPeriod: "monthly" | "yearly";
  firstBillDate: string;
  isActive: boolean;
}

// Store'un genel tipi
interface SubState {
  subscriptions: Subscription[];

  // Aksiyonlar (CRUD)
  addSubscription: (sub: Omit<Subscription, "id" | "isActive">) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  // Diğer metotlar (getTotalMonthlyExpenseTRY)
  getTotalMonthlyExpenseTRY: () => number;
}

// Zustand Store Tanımı
export const useSubStore = create<SubState>()(
  // Persist Middleware'i burada sarıyoruz
  persist(
    (set, get) => ({
      subscriptions: [], // Başlangıçta boş array

      // 1. CREATE (Oluşturma Aksiyonu)
      addSubscription: (subDetails) => {
        const newSub: Subscription = {
          id: uuidv4(),
          isActive: true,
          ...subDetails,
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSub],
        }));
      },

      // 2. DELETE (Silme Aksiyonu)
      removeSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      // 3. UPDATE (Güncelleme Aksiyonu)
      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        }));
      },

      // Toplam Gider Hesaplama (Şimdilik sabit kur üzerinden)
      getTotalMonthlyExpenseTRY: () => {
        // Gerçekte burada döviz kurunu Zustand'dan çekip hesaplama yapacaksın.
        const MOCK_USD_TO_TRY = 32.5;

        return get().subscriptions.reduce((total, sub) => {
          let monthlyCost = sub.price;

          // Yıllık ise 12'ye böl
          if (sub.billingPeriod === "yearly") {
            monthlyCost = sub.price / 12;
          }

          // USD ise kura çevir
          if (sub.currency === "USD") {
            return total + monthlyCost * MOCK_USD_TO_TRY;
          }
          // TRY ise doğrudan ekle
          return total + monthlyCost;
        }, 0); // Başlangıç toplamı 0
      },
    }),
    {
      // Persist ayarları
      name: "tally-subscriptions", // Depolama alanında görünecek anahtar adı
      storage: createJSONStorage(() => localStorage), // Tarayıcıda localStorage kullan (Capacitor bunu native Preferences'a çevirir)
    }
  )
);
