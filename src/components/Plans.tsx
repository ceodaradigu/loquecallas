import React from 'react';
import { Check } from 'lucide-react';
import { Plan } from '../types';

interface PlansProps {
  onPlanSelect: (plan: Plan) => void;
  selectedPlan: Plan;
}

const Plans: React.FC<PlansProps> = ({ onPlanSelect, selectedPlan }) => {
  const plans = [
    {
      type: 'basica' as const,
      name: 'Carta Básica',
      price: 0.99,
      words: '140-160 palabras',
      features: [
        'Carta personalizada',
        'Tono emocional elegido',
        'Entrega en 5 minutos',
        'Perfecta para mensajes concisos'
      ]
    },
    {
      type: 'premium' as const,
      name: 'Carta Premium',
      price: 3.99,
      words: '250-300 palabras',
      features: [
        'Carta profunda y detallada',
        'Máxima personalización',
        'Lenguaje poético avanzado',
        'Impacto emocional máximo',
        'Entrega en 5 minutos'
      ],
      popular: true
    }
  ];

  const handlePlanSelect = (plan: Plan) => {
    // Redirigir directamente a Stripe según el plan seleccionado
    if (plan.type === 'basica') {
      window.location.href = 'https://buy.stripe.com/test_eVq9AMb7Oalc5eY69E8EM00';
    } else if (plan.type === 'premium') {
      window.location.href = 'https://buy.stripe.com/test_28E9AM7VC3WO6j2cy28EM01';
    }
  };

  return (
    <section id="planes" className="py-16 bg-white/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Elige tu plan
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.type}
              onClick={() => handlePlanSelect(plan)}
              className={`relative bg-white p-8 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl ${
                selectedPlan.type === plan.type 
                  ? 'ring-4 ring-rose-500 transform scale-105' 
                  : ''
              } ${
                plan.type === 'premium' 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-8 bg-amber-400 text-gray-800 px-6 py-1 rounded-full text-sm font-bold transform rotate-12">
                  Popular
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className={`text-5xl font-bold mb-2 ${
                  plan.type === 'premium' ? 'text-amber-400' : 'text-rose-500'
                }`}>
                  {plan.price}€
                </div>
                <p className={`mb-8 ${
                  plan.type === 'premium' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {plan.words}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 mr-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
