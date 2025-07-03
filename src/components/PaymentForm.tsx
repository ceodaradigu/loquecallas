import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { stripeService } from '../services/stripe';
import { LetterFormData, Plan } from '../types';

interface PaymentFormProps {
  formData: LetterFormData;
  selectedPlan: Plan;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  selectedPlan,
  onPaymentSuccess,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [paymentElement, setPaymentElement] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  /* ← NUEVO: saber si el elemento ya está montado */
  const [mounted, setMounted] = useState(false);

  /* Cargar Stripe al montar el componente */
  useEffect(() => {
    initializePayment();
    // Limpieza: desmontar Stripe solo si estaba montado
    return () => {
      if (mounted && paymentElement) paymentElement.unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Paso 1: crear PaymentIntent y montar Element */
  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { clientSecret: cs } = await stripeService.createPaymentIntent(
        selectedPlan.price,
        selectedPlan.type,
        formData.email,
        formData
      );
      setClientSecret(cs);

      const {
        stripe: stripeInstance,
        elements: elementsInstance,
        paymentElement: paymentEl
      } = await stripeService.createPaymentElements(cs);

      setStripe(stripeInstance);
      setElements(elementsInstance);
      setPaymentElement(paymentEl);

      /* ← Montar solo UNA vez */
      if (!mounted) {
        paymentEl.mount('#payment-element');
        setMounted(true);
      }
    } catch (err) {
      console.error(err);
      setError('Error inicializando el pago');
    } finally {
      setIsLoading(false);
    }
  };

  /* Paso 2: confirmar el pago */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setError('El formulario de pago no está listo. Recarga la página.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { paymentIntent, error: stripeErr } = await stripeService.confirmPayment(
        clientSecret,
        formData.email,
        formData.tuNombre
      );

      if (stripeErr) throw stripeErr;

      if (paymentIntent?.status === 'succeeded') {
        const verification = await stripeService.verifyPayment(paymentIntent.id);
        if (verification.success) {
          onPaymentSuccess({ paymentIntent, formData: verification.formData });
        } else {
          throw new Error('Error verificando el pago');
        }
      } else {
        throw new Error('El pago no se completó');
      }
    } catch (err: any) {
      setError(err.message || 'Error procesando el pago');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <CreditCard className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Finalizar Pago</h3>
        <div className="bg-gradient-to-r from-rose-500 to-amber-400 text-white p-4 rounded-xl">
          <p className="font-bold">{selectedPlan.name}</p>
          <p className="text-2xl font-bold">{selectedPlan.price}€</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800">Error de pago</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Información de pago
          </label>
          <div
            id="payment-element"
            className="p-4 border-2 border-gray-200 rounded-xl min-h-[200px] flex items-center justify-center"
          >
            {isLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Cargando formulario de pago...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Lock className="w-4 h-4 mr-2" />
            <span>Pago seguro con Stripe</span>
          </div>
          <p className="text-xs text-gray-500">
            Tu información de pago está protegida con encriptación de nivel bancario.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || !stripe}
            className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white py-4 px-6 rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando pago...
              </div>
            ) : (
              `Pagar ${selectedPlan.price}€`
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Al completar el pago, recibirás tu carta personalizada en {formData.email} en los
          próximos 5 minutos.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
