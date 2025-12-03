import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Subscription {
  id: string;
  name: string;
  platform: string;
  price: number;
  currency: "TRY" | "USD" | "EUR";
  billingPeriod: "monthly" | "yearly" | "onetime";
  firstBillDate: string;
  isActive: boolean;
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updatedData: Partial<Subscription>) => void;
  getTotalMonthlyExpenseTRY: () => number;
}

export const useSubStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      addSubscription: (subscription) =>
        set((state) => ({
          subscriptions: [...state.subscriptions, subscription],
        })),

      removeSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        })),
      updateSubscription: (id, updatedData) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updatedData } : sub
          ),
        })),

      getTotalMonthlyExpenseTRY: () => {
        const MOCK_USD_TO_TRY = 32.5;
        const MOCK_EUR_TO_TRY = 35.0;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return get().subscriptions.reduce((total, sub) => {
          if (!sub.isActive) return total;

          let costToAdd = 0;

          if (sub.billingPeriod === "onetime") {
            const billDate = new Date(sub.firstBillDate);
            if (
              billDate.getMonth() === currentMonth &&
              billDate.getFullYear() === currentYear
            ) {
              costToAdd = sub.price;
            } else {
              return total;
            }
          } else {
            costToAdd = sub.price;
            if (sub.billingPeriod === "yearly") {
              costToAdd = sub.price / 12;
            }
          }

          if (sub.currency === "USD") {
            return total + costToAdd * MOCK_USD_TO_TRY;
          }
          if (sub.currency === "EUR") {
            return total + costToAdd * MOCK_EUR_TO_TRY;
          }

          return total + costToAdd;
        }, 0);
      },
    }),
    {
      name: "tally-storage",
    }
  )
);
