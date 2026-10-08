import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, X, Smartphone, Share, PlusSquare, 
  CheckCircle2, ShieldCheck, Zap 
} from 'lucide-react';

export const PwaInstallPrompt = ({ manualTrigger = false, onManualClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Check standalone mode and device on mount
  useEffect(() => {
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const dismissed = sessionStorage.getItem('venstack_pwa_dismissed');
      if (!dismissed) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowPrompt(false);
      setInstalledSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      setShowIosGuide(true);
    }
  }, [deferredPrompt, isIos]);

  // Handle manual trigger from Navbar / Footer
  useEffect(() => {
    if (manualTrigger) {
      if (isIos) {
        setShowIosGuide(true);
      } else if (deferredPrompt) {
        handleInstallClick();
      } else {
        setShowPrompt(true);
      }
    }
  }, [manualTrigger, isIos, deferredPrompt, handleInstallClick]);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('venstack_pwa_dismissed', 'true');
    onManualClose?.();
  };

  if (isStandalone && !manualTrigger) return null;

  return (
    <>
      {/* 1. FLOATING INSTALL BANNER (Responsive Mobile / Desktop Dock) */}
      {showPrompt && !showIosGuide && (
        <div style={{
          position: 'fixed',
          bottom: '88px',
          right: '18px',
          zIndex: 9999,
          maxWidth: '420px',
          width: 'calc(100vw - 36px)',
          animation: 'pwaSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'saturate(180%) blur(24px)',
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
            border: '1px solid rgba(13, 148, 136, 0.25)',
            borderRadius: '24px',
            padding: '16px 18px',
            boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(13, 148, 136, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            
            {/* Top row: Logo, Title & Close */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  <img 
                    src="/img/icon-192.png" 
                    alt="Venstack PWA" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>
                      Instalar Venstack
                    </h3>
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 700,
                      background: 'rgba(13, 148, 136, 0.1)',
                      color: '#0d9488',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      PWA
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6e6e73', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                    {isIos ? 'Instala la app en tu pantalla de inicio' : 'Acceso instantáneo, pantalla completa y modo offline.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexShrink: 0
                }}
                title="Cerrar"
              >
                <X size={14} color="#86868b" strokeWidth={2.5} />
              </button>
            </div>

            {/* Feature highlights */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#0f766e',
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              padding: '6px 10px',
              borderRadius: '10px'
            }}>
              <Zap size={13} color="#0d9488" />
              <span>Apertura ultrarrápida sin barra de navegador • 100% Gratuita</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '9px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.28)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Download size={14} strokeWidth={2.4} />
                <span>{isIos ? 'Ver Cómo Instalar en iPhone' : 'Instalar Aplicación'}</span>
              </button>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  color: '#6e6e73',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '9px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Ahora no
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. MODAL GUÍA DE INSTALACIÓN (Especialmente para iOS / Safari o navegador manual) */}
      {showIosGuide && (
        <div 
          className="apple-modal-overlay" 
          onClick={() => {
            setShowIosGuide(false);
            onManualClose?.();
          }}
          style={{ zIndex: 10000 }}
        >
          <div 
            className="apple-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            {/* Header */}
            <div className="apple-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={17} color="#0d9488" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1d1d1f', margin: 0 }}>
                  {isIos ? 'Instalar Venstack en iPhone / iPad' : 'Instalar en tu Dispositivo'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowIosGuide(false);
                  onManualClose?.();
                }}
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <X size={14} color="#1d1d1f" strokeWidth={2.5} />
              </button>
            </div>

            {/* Body Steps */}
            <div className="apple-modal-body" style={{ padding: '20px 22px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src="/img/icon-192.png" 
                  alt="Venstack" 
                  style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'contain' }} 
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Venstack
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6e6e73', margin: '2px 0 0 0' }}>
                    Agrega la aplicación a tu inicio para abrirla como una app nativa.
                  </p>
                </div>
              </div>

              {isIos ? (
                /* Instrucciones paso a paso estilo Apple para iOS */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#0d9488',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      flexShrink: 0
                    }}>
                      1
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: 1.4 }}>
                      En Safari, pulsa el botón <strong>Compartir</strong> <Share size={14} style={{ verticalAlign: 'middle', margin: '0 2px' }} color="#007aff" /> en la barra inferior.
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#0d9488',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      flexShrink: 0
                    }}>
                      2
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: 1.4 }}>
                      Desliza hacia abajo en el menú y selecciona <strong>"Añadir a la pantalla de inicio"</strong> <PlusSquare size={14} style={{ verticalAlign: 'middle', margin: '0 2px' }} color="#007aff" />.
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#0d9488',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      flexShrink: 0
                    }}>
                      3
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1e293b', lineHeight: 1.4 }}>
                      Toca <strong>"Añadir"</strong> en la esquina superior derecha. ¡Listo! Se creará el acceso directo con el icono oficial de Venstack.
                    </div>
                  </div>

                </div>
              ) : (
                /* Instrucciones para Android / PC */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                  <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    En tu navegador (Chrome, Edge, Samsung Internet o Brave), haz clic en el icono de instalación en la barra de direcciones o en el menú de opciones (⋮) y selecciona <strong>"Instalar Venstack"</strong>.
                  </p>
                  {deferredPrompt && (
                    <button
                      onClick={handleInstallClick}
                      style={{
                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={15} />
                      <span>Instalar Ahora</span>
                    </button>
                  )}
                </div>
              )}

              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11.5px',
                color: '#166534',
                fontWeight: 600
              }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span>Sin ocupar espacio en tu memoria y siempre actualizada a la última versión.</span>
              </div>

              <button
                onClick={() => {
                  setShowIosGuide(false);
                  onManualClose?.();
                }}
                className="apple-btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                Entendido
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 3. SUCCESS TOAST */}
      {installedSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          background: '#0d9488',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '999px',
          boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12.5px',
          fontWeight: 700,
          animation: 'pwaSlideDown 0.3s ease'
        }}>
          <CheckCircle2 size={16} />
          <span>¡Venstack ha sido instalada exitosamente!</span>
        </div>
      )}

      <style>{`
        @keyframes pwaSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pwaSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -16px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
};
