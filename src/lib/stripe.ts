import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    price: "$2.99",
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    price: "$23.88",
    interval: "year" as const,
  },
};
