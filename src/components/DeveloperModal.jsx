import React, { useState } from 'react';
import { 
  X, ShieldCheck, Zap, Wifi, ExternalLink, ThumbsUp, 
  DollarSign, CheckCircle2, MessageCircle, Mail, MapPin, BatteryCharging, Share2
} from 'lucide-react';

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const DeveloperModal = ({ dev, onClose, onEndorse }) => {
  const [endorsed, setEndorsed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!dev) return null;

  const handleEndorseClick = () => {
    if (!endorsed) {
      setEndorsed(true);
      onEndorse(dev.id);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      
      {/* Container */}
      <div className="apple-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* iOS Drag Handle */}
        <div className="apple-bottom-handle" style={{ display: 'none' }} id="modal-handle" />

        {/* Fixed Header */}
        <div className="apple-modal-header">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
            Ficha Técnica de Desarrollador
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              style={{ padding: '6px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', display: 'flex' }}
              title="Copiar enlace"
            >
              <Share2 size={14} color="#6e6e73" />
            </button>
            <button
              onClick={onClose}
              style={{ padding: '6px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} color="#1d1d1f" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="apple-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={dev.avatar}
                alt={dev.name}
                style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.08)' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '14px',
                height: '14px',
                backgroundColor: '#16a34a',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em', margin: 0 }}>
                  {dev.name}
                </h2>
                {dev.verified && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#f0fdfa',
                    border: '1px solid #ccfbf1',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#0d9488'
                  }}>
                    <ShieldCheck size={12} />
                    Verificado
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#424245', margin: '2px 0 0 0' }}>
                {dev.role}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: '#86868b' }}>
                <span>{dev.city}</span>
                <span>•</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>{dev.availabilityText}</span>
              </div>
            </div>
          </div>

          {/* Bio Quote */}
          <div style={{ padding: '12px 16px', background: '#f5f5f7', borderRadius: '16px', fontSize: '12.5px', color: '#424245', lineHeight: 1.55 }}>
            "{dev.bio}"
          </div>

          {/* Resilience Spec Audit (Apple Hardware Specs) */}
          <div style={{
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '18px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={14} color="#0d9488" />
                Auditoría de Setup Resiliente
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                100% Auditado
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '12px' }}>
              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(13,148,136,0.1)' }}>
                <div style={{ color: '#86868b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <BatteryCharging size={13} color="#0d9488" />
                  <span>Respaldo de Energía</span>
                </div>
                <strong style={{ color: '#1d1d1f' }}>{dev.setup?.power || 'Inversor / Respaldo activo'}</strong>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(13,148,136,0.1)' }}>
                <div style={{ color: '#86868b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <Wifi size={13} color="#0d9488" />
                  <span>Conexión de Fibra Óptica</span>
                </div>
                <strong style={{ color: '#1d1d1f' }}>{dev.setup?.internet || 'Fibra Óptica Simétrica'}</strong>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(13,148,136,0.1)' }}>
                <div style={{ color: '#86868b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <CheckCircle2 size={13} color="#16a34a" />
                  <span>Redundancia Móvil</span>
                </div>
                <strong style={{ color: '#1d1d1f' }}>{dev.setup?.backupInternet || 'Línea LTE 4G'}</strong>
              </div>
            </div>
          </div>

          {/* Payment & Rates */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#92400e', display: 'block' }}>
                  Tarifa Mensual (Full-time)
                </span>
                <strong style={{ fontSize: '13.5px', color: '#78350f', marginTop: '2px', display: 'block' }}>
                  {dev.rate}
                </strong>
              </div>

              <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #ccfbf1' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f766e', display: 'block' }}>
                  Tarifa por Hora (Freelance)
                </span>
                <strong style={{ fontSize: '13.5px', color: '#0d9488', marginTop: '2px', display: 'block' }}>
                  {dev.hourlyRate || '$15 - $25 / hora'}
                </strong>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#b45309', display: 'block', marginBottom: '4px' }}>
                Métodos de cobro aceptados:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {dev.payments.map((p, idx) => (
                  <span key={idx} style={{
                    background: '#ffffff',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#78350f'
                  }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Proof of Work Project */}
          {dev.featuredProject && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                Proof of Work (Proyecto Real)
              </span>
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    {dev.featuredProject.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a
                      href={dev.featuredProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '4px 10px',
                        background: '#f5f5f7',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#1d1d1f',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <GithubIcon size={12} />
                      <span>Repo</span>
                    </a>
                    <a
                      href={dev.featuredProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '4px 10px',
                        background: '#f0fdfa',
                        border: '1px solid #ccfbf1',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#0d9488',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#6e6e73', margin: 0, lineHeight: 1.5 }}>
                  {dev.featuredProject.description}
                </p>
              </div>
            </div>
          )}

          {/* Full Skills */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '6px' }}>
              Stack Tecnológico
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {dev.skills.map((s, idx) => (
                <span key={idx} className="apple-skill-pill" style={{ padding: '4px 10px', fontSize: '11.5px' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Fixed Footer with CTAs */}
        <div className="apple-modal-footer">
          <button
            onClick={handleEndorseClick}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              background: endorsed ? '#fef3c7' : '#f5f5f7',
              color: endorsed ? '#92400e' : '#424245',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ThumbsUp size={13} color={endorsed ? '#b45309' : '#86868b'} fill={endorsed ? '#b45309' : 'none'} />
            <span>{endorsed ? 'Recomendado (+1)' : 'Recomendar (+1)'}</span>
          </button>

          <a
            href={`https://wa.me/?text=Hola%20${dev.name},%20vi%20tu%20perfil%20en%20Venstack`}
            target="_blank"
            rel="noreferrer"
            className="apple-btn-primary"
            style={{ padding: '8px 18px' }}
          >
            <MessageCircle size={14} />
            <span>Contactar Directo</span>
          </a>
        </div>

      </div>

      <style>{`
        @media (max-width: 639px) {
          #modal-handle { display: block !important; }
        }
      `}</style>
    </div>
  );
};
