import React, { useState } from 'react';
import { Plan, LetterFormData } from '../types';
import { processGoogleFormSubmission } from '../services/googleForms';
import PaymentForm from './PaymentForm';

interface LetterFormProps {
  selectedPlan: Plan;
  onPaymentSuccess: () => void;
}

const LetterForm: React.FC<LetterFormProps> = ({ selectedPlan, onPaymentSuccess }) => {
  const [formData, setFormData] = useState<LetterFormData>({
    paraQuien: '',
    ocasion: '',
    relacion: '',
    emociones: [],
    detalles: '',
    tono: '',
    tuNombre: '',
    email: '',
    planElegido: selectedPlan.type
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      planElegido: selectedPlan.type
    }));
  };

  const handleEmotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      emociones: checked 
        ? [...prev.emociones, value]
        : prev.emociones.filter(emotion => emotion !== value)
    }));
  };

  const validateForm = (): boolean => {
    const required = ['paraQuien', 'ocasion', 'relacion', 'detalles', 'tono', 'tuNombre', 'email'];
    const missingFields = required.filter(field => !formData[field as keyof LetterFormData]);
    
    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (formData.emociones.length === 0) {
      alert('Por favor, selecciona al menos una emoción');
      return false;
    }
    
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Mostrar formulario de pago
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsSubmitting(true);
    
    try {
      console.log('✅ Pago exitoso, abriendo Google Form prellenado...', paymentData);
      
      // Preparar datos para Google Form
      const googleFormData = {
        ...formData,
        paymentIntentId: paymentData.paymentIntent.id,
        amount: (paymentData.paymentIntent.amount / 100).toFixed(2),
        timestamp: new Date().toISOString()
      };
      
      // Abrir Google Form prellenado en nueva pestaña
      await processGoogleFormSubmission(googleFormData);
      
      console.log('✅ Google Form abierto exitosamente');
      
      // Mostrar confirmación
      onPaymentSuccess();
      
    } catch (error) {
      console.error('❌ Error abriendo Google Form:', error);
      alert(`Error abriendo formulario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
  };

  const emotions = [
    'Amor', 'Gratitud', 'Alegría / Felicidad', 'Nostalgia',
    'Admiración', 'Apoyo / Aliento', 'Perdón', 'Esperanza'
  ];

  const relations = [
    'Mi pareja', 'Un familiar', 'Un amigo/a', 'Mi hijo/a',
    'Mis padres', 'Un compañero de trabajo', 'Otro'
  ];

  const tones = [
    'Romántico', 'Formal y respetuoso', 'Casual y divertido',
    'Sincero y directo', 'Nostálgico y emotivo'
  ];

  if (showPayment) {
    return (
      <section id="crear" className="py-16 bg-gradient-to-br from-white/90 to-white/70">
        <div className="max-w-4xl mx-auto px-5">
          {isSubmitting ? (
            <div className="bg-white p-12 rounded-2xl shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Abriendo formulario...
              </h3>
              <p className="text-gray-600">
                Se abrirá automáticamente el Google Form con tus datos prellenados.
              </p>
            </div>
          ) : (
            <PaymentForm
              formData={formData}
              selectedPlan={selectedPlan}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handleCancelPayment}
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="crear" className="py-16 bg-gradient-to-br from-white/90 to-white/70">
      <div className="max-w-4xl mx-auto px-5">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Cuéntanos tu historia
          </h2>
          
          <div className="bg-gradient-to-r from-rose-500 to-amber-400 text-white p-6 rounded-xl mb-8 text-center">
            <h3 className="text-xl font-bold mb-2">
              Plan seleccionado: {selectedPlan.name}
            </h3>
            <p className="text-lg">Precio: {selectedPlan.price}€</p>
            <p className="text-sm mt-2 opacity-90">
              🔒 Pago seguro con Stripe
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ¿Para quién es esta carta? *
              </label>
              <input
                type="text"
                name="paraQuien"
                value={formData.paraQuien}
                onChange={handleInputChange}
                placeholder="Nombre del destinatario"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ¿Cuál es la ocasión o el motivo de la carta? *
              </label>
              <input
                type="text"
                name="ocasion"
                value={formData.ocasion}
                onChange={handleInputChange}
                placeholder="Ej: Aniversario, cumpleaños, pedido de disculpas..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ¿Qué relación tienes con el destinatario? *
              </label>
              <select
                name="relacion"
                value={formData.relacion}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Selecciona una opción</option>
                {relations.map(relation => (
                  <option key={relation} value={relation}>{relation}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ¿Qué emociones principales quieres transmitir? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {emotions.map(emotion => (
                  <label key={emotion} className="flex items-center p-3 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      value={emotion}
                      checked={formData.emociones.includes(emotion)}
                      onChange={handleEmotionChange}
                      className="mr-2 text-rose-500"
                    />
                    <span className="text-sm">{emotion}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Incluye cualquier detalle, recuerdo o anécdota específica *
              </label>
              <textarea
                name="detalles"
                value={formData.detalles}
                onChange={handleInputChange}
                placeholder="Cuanto más específico, mejor. Ej: 'Recuerdo aquella tarde lluviosa cuando...' o 'Nunca olvidaré cómo me consolaste cuando...'"
                rows={5}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors resize-y"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ¿Qué tono prefieres para la carta? *
              </label>
              <select
                name="tono"
                value={formData.tono}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Selecciona un tono</option>
                {tones.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tu nombre (para firmar la carta) *
              </label>
              <input
                type="text"
                name="tuNombre"
                value={formData.tuNombre}
                onChange={handleInputChange}
                placeholder="¿Cómo quieres firmar la carta?"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tu email para recibir la carta *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tuemail@ejemplo.com"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white py-4 px-8 rounded-xl text-xl font-bold hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Continuar al pago - {selectedPlan.price}€
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Pago seguro procesado por Stripe. Tu carta llegará en 5 minutos.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LetterForm;