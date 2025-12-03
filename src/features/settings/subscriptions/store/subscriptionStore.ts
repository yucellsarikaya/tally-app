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
  firstBillDate: string;
  isActive: boolean;
  billingPeriod: "monthly" | "yearly" | "onetime";
}

// Store'un genel tipi
interface SubState {
  subscriptions: Subscription[];

  // Aksiyonlar (CRUD)
  addSubscription: (sub: Omit<Subscription, "id" | "isActive">) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updatedData: Partial<Subscription>) => void;
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
      updateSubscription: (id, updatedData) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updatedData } : sub
          ),
        })),

      // Toplam Gider Hesaplama (Şimdilik sabit kur üzerinden)
      getTotalMonthlyExpenseTRY: () => {
        const MOCK_USD_TO_TRY = 32.5;
        const MOCK_EUR_TO_TRY = 35.0;

        // Bugünün tarihi
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return get().subscriptions.reduce((total, sub) => {
          // Pasif abonelikleri atla
          if (!sub.isActive) return total;

          let costToAdd = 0;

          // --- 1. TEK SEFERLİK KONTROLÜ ---
          if (sub.billingPeriod === "onetime") {
            const billDate = new Date(sub.firstBillDate);

            // Eğer harcama BU YIL ve BU AY yapıldıysa toplama ekle
            if (
              billDate.getMonth() === currentMonth &&
              billDate.getFullYear() === currentYear
            ) {
              costToAdd = sub.price;
            } else {
              // Başka bir aysa toplama ekleme (0 ekle)
              return total;
            }
          }
          // --- 2. AYLIK/YILLIK ABONELİK KONTROLÜ ---
          else {
            costToAdd = sub.price;
            // Yıllık ise 12'ye bölerek aylık maliyeti bul
            if (sub.billingPeriod === "yearly") {
              costToAdd = sub.price / 12;
            }
          }

          // --- 3. PARA BİRİMİ ÇEVİRME ---
          if (sub.currency === "USD") {
            return total + costToAdd * MOCK_USD_TO_TRY;
          }
          if (sub.currency === "EUR") {
            return total + costToAdd * MOCK_EUR_TO_TRY;
          }

          // TRY ise direkt ekle
          return total + costToAdd;
        }, 0);
      },
    }),
    {
      // Persist ayarları
      name: "tally-subscriptions", // Depolama alanında görünecek anahtar adı
      storage: createJSONStorage(() => localStorage), // Tarayıcıda localStorage kullan (Capacitor bunu native Preferences'a çevirir)
    }
  )
);
