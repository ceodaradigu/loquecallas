import { loadStripe, Stripe } from '@stripe/stripe-js';

/*  ────── Cargar Stripe solo una vez ────── */
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY as string // ← lee la env de Netlify
    );
  }
  return stripePromise;
};

export const stripeService = {
  /* Crear PaymentIntent en tu función backend */
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

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error creando el intento de pago');
    }
    return res.json(); // { clientSecret, paymentIntentId }
  },

  /* Crear elementos y devolverlos listos para montar */
  createPaymentElements: async (clientSecret: string) => {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe no se cargó');

    const elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create('payment');

    return { stripe, elements, paymentElement };
  },

  /* Confirmar el pago en el frontend */
  confirmPayment: async (
    clientSecret: string,
    receiptEmail: string,
    cardholderName: string
  ) => {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe no se cargó');

    return stripe.confirmPayment({
      elements: stripe.elements({ clientSecret }),
      confirmParams: {
        receipt_email: receiptEmail,
        payment_method_data: {
          billing_details: { name: cardholderName },
        },
      },
      redirect: 'if_required',
    });
  },

  /* Verificar en tu backend que el PaymentIntent quedó “succeeded” */
  verifyPayment: async (paymentIntentId: string) => {
    const res = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error verificando el pago');
    }
    return res.json();
  },
};
