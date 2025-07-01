import React from 'react';
import { CheckCircle, AlertTriangle, ExternalLink, Mail } from 'lucide-react';

interface ConfirmationProps {
  onCreateAnother: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ onCreateAnother }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-100 to-blue-100 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-5">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            ¡Pago completado exitosamente!
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <ExternalLink className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-blue-800 mb-2">📋 Google Form abierto automáticamente</p>
                <p className="text-blue-700">
                  Se ha abierto el Google Form con todos tus datos prellenados. 
                  <strong> Solo tienes que hacer clic en "Enviar"</strong> para completar el proceso y que se genere tu carta.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-green-800 mb-2">📧 Tu carta llegará por email</p>
                <p className="text-green-700">
                  Una vez envíes el Google Form, tu carta personalizada se generará automáticamente 
                  y llegará a tu email en los próximos <strong>5 minutos</strong>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-amber-800 mb-2">⚠️ IMPORTANTE:</p>
                <p className="text-amber-700">
                  Si no recibes tu carta, revisa tu carpeta de <strong>SPAM o correo no deseado</strong>, 
                  ya que algunos proveedores filtran nuestros emails automáticamente.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Gracias por confiar en LoQueCallas para expresar lo que tu corazón calla.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onCreateAnother}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white px-10 py-4 rounded-full text-xl font-bold hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Crear otra carta
            </button>
            
            <p className="text-sm text-gray-500">
              Si tienes algún problema, contacta con nosotros en: 
              <a href="mailto:daradigu@gmail.com" className="text-rose-500 hover:underline ml-1">
                daradigu@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;