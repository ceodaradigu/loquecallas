import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Plans from './components/Plans';
import LetterForm from './components/LetterForm';
import Confirmation from './components/Confirmation';
import Legal from './components/Legal';
import Footer from './components/Footer';
import { Plan } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState<'home' | 'legal' | 'confirmation'>('home');
  const [selectedPlan, setSelectedPlan] = useState<Plan>({
    type: 'premium',
    name: 'Carta Premium',
    price: 3.99,
    words: '250-300 palabras'
  });

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = () => {
    setCurrentSection('confirmation');
  };

  const handleShowLegal = () => {
    setCurrentSection('legal');
  };

  const handleGoHome = () => {
    setCurrentSection('home');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToPlans = () => {
    scrollToSection('planes');
  };

  return (
    <div className="min-h-screen">
      <Header 
        onNavigate={scrollToSection}
        onShowLegal={handleShowLegal}
        onGoHome={handleGoHome}
      />
      
      {currentSection === 'home' && (
        <>
          <Hero onScrollToPlans={scrollToPlans} />
          <Plans onPlanSelect={handlePlanSelect} selectedPlan={selectedPlan} />
          <LetterForm 
            selectedPlan={selectedPlan} 
            onPaymentSuccess={handlePaymentSuccess}
          />
        </>
      )}
      
      {currentSection === 'confirmation' && (
        <Confirmation onCreateAnother={handleGoHome} />
      )}
      
      {currentSection === 'legal' && (
        <Legal />
      )}
      
      <Footer onShowLegal={handleShowLegal} />
    </div>
  );
}

export default App;