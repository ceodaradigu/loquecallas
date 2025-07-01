import React from 'react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onShowLegal: () => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onShowLegal, onGoHome }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    
    if (target === 'legal') {
      onShowLegal();
    } else {
      onGoHome();
      if (target !== 'inicio') {
        setTimeout(() => onNavigate(target), 100);
      }
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex justify-between items-center py-4">
          <div 
            className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent cursor-pointer"
            onClick={onGoHome}
          >
            LoQueCallas
          </div>
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#inicio" 
              className="text-gray-700 hover:text-rose-500 transition-colors"
              onClick={(e) => handleNavClick(e, 'inicio')}
            >
              Inicio
            </a>
            <a 
              href="#planes" 
              className="text-gray-700 hover:text-rose-500 transition-colors"
              onClick={(e) => handleNavClick(e, 'planes')}
            >
              Planes
            </a>
            <a 
              href="#crear" 
              className="text-gray-700 hover:text-rose-500 transition-colors"
              onClick={(e) => handleNavClick(e, 'crear')}
            >
              Crear Carta
            </a>
            <a 
              href="#legal" 
              className="text-gray-700 hover:text-rose-500 transition-colors"
              onClick={(e) => handleNavClick(e, 'legal')}
            >
              Legal
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;