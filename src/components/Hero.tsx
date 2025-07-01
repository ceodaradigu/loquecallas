import React from 'react';

interface HeroProps {
  onScrollToPlans: () => void;
}

const Hero: React.FC<HeroProps> = ({ onScrollToPlans }) => {
  return (
    <section id="inicio" className="text-center py-16 bg-gradient-to-br from-orange-100 to-rose-100">
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent animate-fade-in-up">
          Expresa lo que tu corazón calla
        </h1>
        <p className="text-xl text-gray-600 mb-6 animate-fade-in-up animation-delay-300">
          Cartas personalizadas que llegan directo al alma
        </p>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-600">
          Danos tus sentimientos y nosotros los convertiremos en una carta única y emotiva que transmita exactamente lo que sientes pero no sabes cómo expresar.
        </p>
        <button 
          onClick={onScrollToPlans}
          className="inline-block bg-gradient-to-r from-rose-500 to-amber-400 text-white px-10 py-4 rounded-full text-xl font-bold hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-900"
        >
          Crear mi carta ahora
        </button>
      </div>
    </section>
  );
};

export default Hero;