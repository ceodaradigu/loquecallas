import { loadStripe, Stripe } from '@stripe/stripe-js';
import { LetterFormData } from '../types';

// Cargar Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  status: string;
  formData?: any;
  message: string;
}

export class StripeService {
  private static instance: StripeService;
  private stripe: Promise<Stripe | null>;

  private constructor() {
    this.stripe = stripePromise;
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  /**
   * Crear Payment Intent en el backend
   */
  async createPaymentIntent(
    amount: number,
    planType: string,
    customerEmail: string,
    formData: LetterFormData
  ): Promise<PaymentIntentResponse> {
    try {
      console.log('🔄 Creando Payment Intent...', { amount, planType, customerEmail });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
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
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Payment Intent creado:', data.paymentIntentId);
      
      return data;
    } catch (error) {
      console.error('❌ Error creando Payment Intent:', error);
      throw new Error(`Error creando Payment Intent: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Confirmar pago con Stripe Elements
   */
  async confirmPayment(
    clientSecret: string,
    customerEmail: string,
    customerName: string
  ): Promise<{ paymentIntent: any; error?: any }> {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new Error('Stripe no se pudo cargar');
      }

      console.log('🔄 Confirmando pago...');

      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: window.location.origin,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        console.error('❌ Error confirmando pago:', result.error);
        return { paymentIntent: null, error: result.error };
      }

      console.log('✅ Pago confirmado:', result.paymentIntent?.id);
      return { paymentIntent: result.paymentIntent };

    } catch (error) {
      console.error('❌ Error en confirmPayment:', error);
      return { 
        paymentIntent: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Error desconocido' 
        } 
      };
    }
  }

  /**
   * Verificar estado del pago en el backend
   */
  async verifyPayment(paymentIntentId: string): Promise<PaymentConfirmationResponse> {
    try {
      console.log('🔍 Verificando pago:', paymentIntentId);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Verificación completada:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error verificando pago:', error);
      throw new Error(`Error verificando pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Crear elementos de Stripe para el formulario de pago
   */
  async createPaymentElements(clientSecret: string) {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new Error('Stripe no se pudo cargar');
      }

      const elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#ef4444',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#dc2626',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      });

      const paymentElement = elements.create('payment');

      return { stripe, elements, paymentElement };
    } catch (error) {
      console.error('❌ Error creando elementos de Stripe:', error);
      throw error;
    }
  }
}

export const stripeService = StripeService.getInstance();