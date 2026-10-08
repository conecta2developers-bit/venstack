import React from 'react';
import { 
  ChevronRight, Plus, Code2, Palette, Brain, Shield
} from 'lucide-react';

export const OnboardingHero = ({ 
  isIntro = false,
  onEndIntro,
  onExploreClick, 
  onCreateProfileClick, 
  onSelectDiscipline 
}) => {
  return (
    <section 
      className={`venstack-cover-hero ${isIntro ? 'hero-fullscreen-intro' : 'hero-banner-settled'}`}
      onClick={isIntro ? onEndIntro : undefined}
      style={{ cursor: isIntro ? 'pointer' : 'default' }}
    >
      
      {/* Background Cover Image with Realistic Venezuelan Tech Team */}
      <div 
        className="venstack-cover-image"
        style={{ backgroundImage: `url('/venstack-cover.jpg')` }}
      />
      
      {/* Soft, Pure Ambient Overlays for Clean Apple Readability */}
      <div className="venstack-cover-overlay-top" />
      <div className="venstack-cover-overlay-bottom" />

      {/* Hero Foreground Content */}
      <div className="venstack-cover-content">
        
        {/* Subtle Eyebrow Badge */}
        <div className="venstack-cover-eyebrow animate-fade">
          <span className="venstack-cover-eyebrow-dot" />
          <span>VENSTACK • ECOSISTEMA TECH VENEZUELA</span>
        </div>

        {/* Clean, Punchy & Inspiring Headline */}
        <h1 className="venstack-cover-title animate-fade">
          El talento tech de Venezuela, <br className="venstack-desktop-br" />
          <span className="venstack-cover-highlight">reunido en un solo lugar.</span>
        </h1>

        {/* Crisp Subtitle - Clean Typography with Zero Clutter */}
        <p className="venstack-cover-subtitle animate-fade">
          Software • UI/UX • Inteligencia Artificial • Ciberseguridad.<br className="venstack-desktop-br" />
          Conéctate con la comunidad, comparte proyectos reales y accede a oportunidades remotas.
        </p>

        {/* Focused Action Buttons */}
        <div className="venstack-cover-actions animate-fade">
          <button
            onClick={onExploreClick}
            className="venstack-cover-btn-primary"
          >
            <span>Explorar Talento</span>
            <ChevronRight size={15} />
          </button>

          <button
            onClick={onCreateProfileClick}
            className="venstack-cover-btn-secondary"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Crear mi Perfil</span>
          </button>
        </div>

        {/* Minimalist Interactive Category Pills */}
        <div className="venstack-hero-disciplines animate-fade">
          <button 
            type="button"
            onClick={() => onSelectDiscipline?.('software')} 
            className="venstack-hero-pill"
          >
            <Code2 size={13} color="#0d9488" />
            <span>Software</span>
          </button>

          <button 
            type="button"
            onClick={() => onSelectDiscipline?.('uiux')} 
            className="venstack-hero-pill"
          >
            <Palette size={13} color="#d97706" />
            <span>UI/UX</span>
          </button>

          <button 
            type="button"
            onClick={() => onSelectDiscipline?.('ai')} 
            className="venstack-hero-pill"
          >
            <Brain size={13} color="#8b5cf6" />
            <span>Inteligencia Artificial</span>
          </button>

          <button 
            type="button"
            onClick={() => onSelectDiscipline?.('security')} 
            className="venstack-hero-pill"
          >
            <Shield size={13} color="#059669" />
            <span>Ciberseguridad</span>
          </button>
        </div>

      </div>

    </section>
  );
};
