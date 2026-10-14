import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, X, Sparkles, Code2, Briefcase, 
  MessageSquare, ShieldCheck, Zap, Globe, DollarSign, Award, 
  ArrowRight, CheckCircle2
} from 'lucide-react';

const ONBOARDING_SLIDES = [
  {
    id: 'welcome',
    image: '/onboarding-welcome.jpg',
    badge: 'BIENVENIDO A VENSTACK 🇻🇪',
    badgeColor: '#14b8a6',
    title: 'El ecosistema del talento tech de Venezuela',
    highlight: 'conectado al mundo.',
    description: 'Reunimos a los mejores desarrolladores de software, diseñadores UI/UX, expertos en IA y especialistas en ciberseguridad para potenciar su visibilidad y oportunidades.',
    cards: [
      {
        icon: Globe,
        iconColor: '#38bdf8',
        title: 'Red Global & Remota',
        desc: 'Conexión directa con startups, scaleups y clientes internacionales sin barreras.'
      },
      {
        icon: Zap,
        iconColor: '#facc15',
        title: 'Respaldo & Estabilidad',
        desc: 'Perfiles con setup verificado de fibra óptica y respaldo eléctrico para trabajo remoto continuo.'
      },
      {
        icon: ShieldCheck,
        iconColor: '#34d399',
        title: 'Confianza & Reputación',
        desc: 'Validación de proyectos reales, commits en GitHub y recomendaciones de la comunidad.'
      }
    ]
  },
  {
    id: 'talent',
    image: '/onboarding-talent.jpg',
    badge: 'PORTAFOLIO & PROOF OF WORK 💻',
    badgeColor: '#38bdf8',
    title: 'Tu carta de presentación profesional',
    highlight: 'de alto impacto.',
    description: 'Olvídate de currículums estáticos en PDF. Tu perfil en Venstack muestra tus habilidades reales, proyectos en vivo y tarifas transparentes.',
    cards: [
      {
        icon: Code2,
        iconColor: '#818cf8',
        title: 'Proyectos & Demos en Vivo',
        desc: 'Enlaza tus repositorios de GitHub y demos funcionales con métricas y stacks reales.'
      },
      {
        icon: DollarSign,
        iconColor: '#4ade80',
        title: 'Cobros Internacionales',
        desc: 'Muestra tus métodos de cobro aceptados: Binance (USDT), Zinli, Deel, Wally y Pago Móvil.'
      },
      {
        icon: Award,
        iconColor: '#fbbf24',
        title: 'Karma & Endorsements',
        desc: 'Recibe avales de otros ingenieros y empresas para posicionarte como talento top.'
      }
    ]
  },
  {
    id: 'jobs',
    image: '/onboarding-jobs.jpg',
    badge: 'OPORTUNIDADES & BOUNTIES 💼',
    badgeColor: '#fbbf24',
    title: 'Empleos remotos y bounties',
    highlight: 'con pagos directos en USD.',
    description: 'Postúlate a ofertas de empresas y reclutadores que buscan talento venezolano para contratación fija o proyectos freelance.',
    cards: [
      {
        icon: Zap,
        iconColor: '#38bdf8',
        title: 'Postulación en 1 Clic',
        desc: 'Envía tu propuesta de forma instantánea usando tu perfil verificado sin formularios eternos.'
      },
      {
        icon: Briefcase,
        iconColor: '#f472b6',
        title: 'Seguimiento en Tiempo Real',
        desc: 'Monitorea el estado de tus postulaciones y recibe notas directas de los reclutadores.'
      },
      {
        icon: DollarSign,
        iconColor: '#34d399',
        title: 'Pagos Transparentes',
        desc: 'Rangos salariales claros y pagos acordados sin deducciones ocultas de plataformas intermediarias.'
      }
    ]
  },
  {
    id: 'community',
    image: '/venstack-cover.jpg',
    badge: 'COMUNIDAD & NETWORKING 🤝',
    badgeColor: '#a855f7',
    title: 'Aprende, debate y resuelve dudas',
    highlight: 'en nuestro foro técnico.',
    description: 'Un espacio seguro para compartir recomendaciones sobre cobros, bancos internacionales, configuración de Ollama e IA local, y resolución de errores.',
    cards: [
      {
        icon: MessageSquare,
        iconColor: '#c084fc',
        title: 'Debates & Foros Técnicos',
        desc: 'Publica dudas, comenta soluciones y dale me gusta a los mejores aportes comunitarios.'
      },
      {
        icon: Zap,
        iconColor: '#fbbf24',
        title: 'Setup & Hacks Eléctricos',
        desc: 'Consejos probados sobre inversores, mini-UPS y los mejores proveedores de internet en cada ciudad.'
      },
      {
        icon: Sparkles,
        iconColor: '#2dd4bf',
        title: 'Crecimiento Colectivo',
        desc: 'Colabora en proyectos de código abierto y mentorías entre desarrolladores Juniors y Seniors.'
      }
    ]
  }
];

export const FullScreenOnboarding = ({
  isOpen = false,
  onClose,
  onExplore,
  onCreateProfile,
  currentUser = null
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Reset to first slide when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'Escape') {
      onClose?.();
    }
  }, [isOpen, currentSlideIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onClose?.();
    } else {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, ONBOARDING_SLIDES.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: '#0a0a0c',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
      color: '#ffffff'
    }}>
      
      {/* Background Cinematic Cover Image with Smooth Ken Burns Zoom */}
      <div 
        key={currentSlide.id}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${currentSlide.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'kenBurnsEffect 14s ease-out infinite alternate',
          transformOrigin: 'center center',
          zIndex: 1,
          filter: 'brightness(0.72) saturate(1.15)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* Layered Luxury Gradient Vignette for Razor-Sharp Readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 30%, rgba(10, 10, 12, 0.4) 0%, rgba(10, 10, 12, 0.88) 80%, rgba(10, 10, 12, 0.98) 100%)',
        zIndex: 2
      }} />

      {/* Hyperframe Glow Accent */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: `radial-gradient(circle, ${currentSlide.badgeColor}22 0%, transparent 70%)`,
        zIndex: 2,
        pointerEvents: 'none',
        filter: 'blur(60px)'
      }} />

      {/* ----------------------------------------------------
          TOP NAVIGATION BAR (Story-style segmented progress)
          ---------------------------------------------------- */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {/* Progress Bars */}
        <div style={{
          display: 'flex',
          gap: '6px',
          width: '100%'
        }}>
          {ONBOARDING_SLIDES.map((slide, idx) => (
            <div 
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '999px',
                backgroundColor: idx <= currentSlideIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: idx === currentSlideIndex ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>

        {/* Brand & Skip Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/img/venstack.png" 
              alt="Venstack" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
              Tour de Bienvenida • {currentSlideIndex + 1} de {ONBOARDING_SLIDES.length}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <span>Saltar tour</span>
            <X size={13} />
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          MAIN SLIDE CONTENT (Hyperframe Glass Stage)
          ---------------------------------------------------- */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        boxSizing: 'border-box'
      }}>
        <div 
          key={currentSlide.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            animation: 'hyperframeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${currentSlide.badgeColor}40`,
            backdropFilter: 'blur(20px)',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: currentSlide.badgeColor,
            marginBottom: '16px',
            boxShadow: `0 0 20px ${currentSlide.badgeColor}20`
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: currentSlide.badgeColor,
              boxShadow: `0 0 8px ${currentSlide.badgeColor}`
            }} />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(28px, 4.2vw, 46px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 12px 0',
            maxWidth: '820px'
          }}>
            {currentSlide.title}{' '}
            <span style={{
              background: `linear-gradient(135deg, #ffffff 30%, ${currentSlide.badgeColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline'
            }}>
              {currentSlide.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 0 32px 0',
            fontWeight: 400
          }}>
            {currentSlide.description}
          </p>

          {/* 3 Hyperframe Glass Floating Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            width: '100%',
            maxWidth: '920px',
            boxSizing: 'border-box'
          }}>
            {currentSlide.cards.map((card, i) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '18px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.28)',
                    transition: 'all 0.25s ease',
                    animation: `hyperframeCard 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s backwards`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: `${card.iconColor}22`,
                    border: `1px solid ${card.iconColor}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.iconColor
                  }}>
                    <IconComp size={18} />
                  </div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ----------------------------------------------------
          BOTTOM DOCK (Controls & Call to Actions)
          ---------------------------------------------------- */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px 24px 32px',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxSizing: 'border-box',
        flexWrap: 'wrap'
      }}>
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentSlideIndex === 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: currentSlideIndex === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </button>

        {/* Slide Indicator Dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {ONBOARDING_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              style={{
                width: idx === currentSlideIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: idx === currentSlideIndex ? currentSlide.badgeColor : 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>

        {/* Next / Finish Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLastSlide ? (
            <>
              <button
                onClick={() => {
                  onClose?.();
                  onCreateProfile?.();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(16px)',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <span>Crear mi Perfil</span>
                <CheckCircle2 size={15} color="#34d399" />
              </button>

              <button
                onClick={() => {
                  onClose?.();
                  onExplore?.();
                }}
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(13, 148, 136, 0.5)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>¡Entrar a Venstack!</span>
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              style={{
                background: '#ffffff',
                border: 'none',
                color: '#0a0a0c',
                padding: '10px 22px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span>Siguiente</span>
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </footer>

      {/* Global Embedded Hyperframe CSS Animations */}
      <style>{`
        @keyframes kenBurnsEffect {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.08) translate(-1%, -1%);
          }
        }

        @keyframes hyperframeIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes hyperframeCard {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
};
