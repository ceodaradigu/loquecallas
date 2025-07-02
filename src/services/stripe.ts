import { loadStripe } from '@stripe/stripe-js';

let stripePromise: any = null;

export const stripeService = {
  createPaymentIntent: async (
    amount: number,
    planType: string,
    customerEmail: string,
    formData: any
  ) => {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        planType,
        customerEmail,
        formData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creando el intento de pago');
    }

    return await response.json();
  },

  createPaymentElements: async (clientSecret: string) => {
    if (!stripePromise) {
      stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);
    }

    const stripe = await stripePromise;

    const elements = stripe.elements({ clientSecret });

    const paymentElement = elements.create('payment');

    return { stripe, elements, paymentElement };
  },

  confirmPayment: async (
    clientSecret: string,
    receiptEmail: string,
    cardholderName: string
  ) => {
    if (!stripePromise) {
      stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);
    }

    const stripe = await stripePromise;

    const result = await stripe.confirmPayment({
      elements: stripe.elements({ clientSecret }),
      confirmParams: {
        receipt_email: receiptEmail,
        payment_method_data: {
          billing_details: {
            name: cardholderName,
          },
        },
      },
      redirect: 'if_required',
    });

    return result;
  },

  verifyPayment: async (paymentIntentId: string) => {
    const response = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error verificando el pago');
    }

    return await response.json();
  },
};
