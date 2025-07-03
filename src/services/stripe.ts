import { loadStripe, Stripe } from '@stripe/stripe-js';

/* Cargar Stripe solo una vez */
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY as string // ← clave pública desde Netlify
    );
  }
  return stripePromise;
};

export const stripeService = {
  /* ───────── Crear PaymentIntent en tu función backend ───────── */
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

  /* ───────── Crear Elements y devolver Payment Element ───────── */
  createPaymentElements: async (clientSecret: string) => {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe no se cargó');

    /* Configuración general de Elements */
    const elements = stripe.elements({
      clientSecret,
      appearance: {},
      loader: 'auto',
    });

    /* SOLO tarjeta; ocultamos Link y otros métodos */
    const paymentElement = elements.create('payment', {
      layout: 'tabs',
      business: { name: 'LoQueCallas' },
      paymentMethodOrder: ['card'],          // ← Filtro: sólo “card”
    });

    return { stripe, elements, paymentElement };
  },

  /* ───────── Confirmar el pago desde el frontend (opcional) ─────────
     (Ya no se usa en el nuevo componente, pero lo dejamos por si lo
     necesitas en otra parte del proyecto.)                                        */
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

  /* ───────── Verificar en backend que el pago quedó “succeeded” ───────── */
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
