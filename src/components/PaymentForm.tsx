import React, { useEffect, useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { stripeService } from '../services/stripe';
import { LetterFormData, Plan } from '../types';

interface PaymentFormProps {
  formData: LetterFormData;
  selectedPlan: Plan;
  onPaymentSuccess: (data: any) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  selectedPlan,
  onPaymentSuccess,
  onCancel,
}) => {
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─────────────────── 1. Crear PaymentIntent ─────────────────── */
  useEffect(() => {
    const createIntent = async () => {
      try {
        setIsLoading(true);
        const { clientSecret } = await stripeService.createPaymentIntent(
          selectedPlan.price,
          selectedPlan.type,
          formData.email,
          formData
        );
        setClientSecret(clientSecret);
      } catch (err: any) {
        setError(err.message || 'Error inicializando el pago');
      } finally {
        setIsLoading(false);
      }
    };
    createIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── 2. Cuando exista clientSecret, monta Element ───────── */
  useEffect(() => {
    if (!clientSecret) return;

    let paymentElement: any; // referencia local
    const mountElement = async () => {
      try {
        const {
          stripe,
          elements,
          paymentElement: pe,
        } = await stripeService.createPaymentElements(clientSecret);

        setStripe(stripe);
        setElements(elements);
        paymentElement = pe;
        paymentElement.mount('#payment-element');
      } catch (err: any) {
        setError(err.message || 'Error cargando formulario de pago');
      }
    };
    mountElement();

    // Limpieza: desmontar una sola vez
    return () => {
      if (paymentElement) paymentElement.unmount();
    };
  }, [clientSecret]);

  /* ──────────────── 3. Confirmar el pago ──────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsLoading(true);
    setError(null);

    try {
      const { paymentIntent, error } = await stripeService.confirmPayment(
        clientSecret,
        formData.email,
        formData.tuNombre
      );
      if (error) throw error;

      if (paymentIntent.status === 'succeeded') {
        const verification = await stripeService.verifyPayment(paymentIntent.id);
        if (verification.success) onPaymentSuccess(verification);
        else throw new Error('Error verificando el pago');
      } else {
        throw new Error('El pago no se completó');
      }
    } catch (err: any) {
      setError(err.message || 'Error procesando el pago');
    } finally {
      setIsLoading(false);
    }
  };

  /* ──────────────────── Render ──────────────────── */
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
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-2" />
                <p className="text-gray-600">Cargando...</p>
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
            Tu información de pago está protegida con encriptación bancaria.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !stripe}
          className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white py-4 px-6 rounded-xl text-lg font-bold disabled:opacity-50"
        >
          {isLoading ? 'Procesando...' : `Pagar ${selectedPlan.price}€`}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold disabled:opacity-50"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
