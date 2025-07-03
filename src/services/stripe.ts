import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);
  }
  return stripePromise;
};

export const stripeService = {
  /* ── Crea PaymentIntent en tu función backend ── */
  createPaymentIntent: async (
    amount: number,
    planType: string,
    customerEmail: string,
    formData: any
  ) => {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, planType, customerEmail, formData }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();              // { clientSecret, paymentIntentId }
  },

  /* ── Crea Elements y PaymentElement SOLO con tarjeta ── */
  createPaymentElements: async (clientSecret: string) => {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe no se cargó');

    /* Elements base */
    const elements = stripe.elements({ clientSecret });

    /* Opciones del PaymentElement:
       - solo tarjeta en order
       - Link desactivado por completo                       */
    const paymentElement = elements.create('payment', {
      paymentMethodOrder: ['card'],
      wallets: { link: 'never' },         // ← Link desactivado
    });

    return { stripe, elements, paymentElement };
  },

  /* ── Verifica en backend que quedó succeeded ── */
  verifyPayment: async (paymentIntentId: string) => {
    const res = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
};
