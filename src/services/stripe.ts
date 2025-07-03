/* src/services/stripe.ts  — versión tarjeta-solo */
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const stripeService = {
  /* 1 · Cargar Stripe JS */
  getStripe() {
    if (!stripePromise) {
      stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
  },

  /* 2 · Crear PaymentIntent  ─────────────────────────── */
  async createPaymentIntent(amount: number, customerEmail: string) {
    const res = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, customerEmail }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Error server');
    }
    return res.json(); // { clientSecret, paymentIntentId }
  },

  /* 3 · Crear Elements y Payment Element ─────────────── */
  async createPaymentElements(
    clientSecret: string,
    elementOpts = {
      paymentMethodOrder: ['card'],
      wallets: {
        applePay: 'never',
        googlePay: 'never',
        link: 'never',
        revolutPay: 'never',
      },
    },
  ): Promise<{
    stripe: Stripe;
    elements: StripeElements;
    paymentElement: any;
  }> {
    const stripe = await this.getStripe();
    if (!stripe) throw new Error('Stripe.js failed to load');

    const elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create('payment', elementOpts);

    return { stripe, elements, paymentElement };
  },
};
