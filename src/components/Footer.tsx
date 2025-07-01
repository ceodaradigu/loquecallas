import React from 'react';
import { Mail } from 'lucide-react';

interface FooterProps {
  onShowLegal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowLegal }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">LoQueCallas</h3>
            <p className="text-gray-300">
              Ayudamos a las personas a expresar sus sentimientos más profundos a través de cartas personalizadas y emotivas.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">Servicios</h3>
            <div className="space-y-2">
              <button 
                onClick={() => scrollToSection('planes')}
                className="block text-gray-300 hover:text-amber-400 transition-colors text-left"
              >
                Carta Básica - 0.99€
              </button>
              <button 
                onClick={() => scrollToSection('planes')}
                className="block text-gray-300 hover:text-amber-400 transition-colors text-left"
              >
                Carta Premium - 3.99€
              </button>
              <button 
                onClick={() => scrollToSection('crear')}
                className="block text-gray-300 hover:text-amber-400 transition-colors text-left"
              >
                Crear carta
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">Legal</h3>
            <div className="space-y-2">
              <button 
                onClick={onShowLegal}
                className="block text-gray-300 hover:text-amber-400 transition-colors text-left"
              >
                Términos y Condiciones
              </button>
              <button 
                onClick={onShowLegal}
                className="block text-gray-300 hover:text-amber-400 transition-colors text-left"
              >
                Política de Privacidad
              </button>
              <button 
                onClick={onShowLegal}
                className="block text-gray-300 hover:text-amber-400 transition-colors text-left"
              >
                Política de Devoluciones
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">Contacto</h3>
            <a 
              href="mailto:daradigu@gmail.com" 
              className="flex items-center text-gray-300 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              daradigu@gmail.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 LoQueCallas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;