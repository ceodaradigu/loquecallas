import React from 'react';
import { Mail } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-5">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Información Legal</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-rose-500 mb-4">Política de Devoluciones</h2>
              <p className="text-gray-700 mb-4">No se admiten devoluciones debido a que:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Es un producto digital de entrega inmediata</li>
                <li>Se personaliza según tus datos específicos</li>
                <li>Tienes acceso completo al cuestionario antes del pago</li>
              </ul>
              <p className="text-gray-700 mt-4">Garantizamos la entrega técnica de tu carta.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-rose-500 mb-4">Términos y Condiciones</h2>
              <p className="text-gray-700 mb-4">Al usar LoQueCallas, aceptas que:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>El servicio genera cartas personalizadas basadas en la información que proporcionas</li>
                <li>El pago se procesa de forma segura a través de Stripe</li>
                <li>Las cartas se entregan por email en un plazo máximo de 30 minutos</li>
                <li>Es tu responsabilidad proporcionar un email válido</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-rose-500 mb-4">Política de Privacidad</h2>
              <p className="text-gray-700 mb-4">Respetamos tu privacidad:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Tus datos personales solo se usan para generar y entregar tu carta</li>
                <li>No compartimos información con terceros</li>
                <li>Los datos de pago son procesados de forma segura por Stripe</li>
                <li>Puedes solicitar la eliminación de tus datos contactándonos</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-rose-500 mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2" />
                Contacto
              </h2>
              <p className="text-gray-700">
                Para consultas: <a href="mailto:daradigu@gmail.com" className="text-rose-500 hover:underline">daradigu@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legal;