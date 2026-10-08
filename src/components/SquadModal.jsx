import React, { useState } from 'react';
import { X, CheckCircle, Users, Calendar, Send } from 'lucide-react';

export const SquadModal = ({ squad, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(squad?.lookingFor[0] || '');
  const [githubUrl, setGithubUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!squad) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* iOS Drag Handle */}
        <div className="apple-bottom-handle" style={{ display: 'none' }} id="modal-handle" />

        {/* Header */}
        <div className="apple-modal-header">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
            Unirse a un Squad Comunitario
          </span>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', display: 'flex' }}
          >
            <X size={14} color="#1d1d1f" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="apple-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#0f766e',
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: '999px',
              padding: '2px 8px'
            }}>
              {squad.category}
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em', margin: '8px 0 4px 0' }}>
              {squad.name}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#6e6e73', lineHeight: 1.5, margin: 0 }}>
              {squad.purpose}
            </p>
          </div>

          <div style={{ padding: '12px', background: '#f5f5f7', borderRadius: '14px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#86868b' }}>Mentor del Sprint:</span>
              <strong style={{ color: '#1d1d1f' }}>{squad.leader}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#86868b' }}>Duración:</span>
              <strong style={{ color: '#1d1d1f' }}>{squad.sprintDuration}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#86868b' }}>Resultado esperado:</span>
              <span style={{ color: '#0d9488', fontWeight: 600 }}>Repositorio público + Certificado Proof-of-Work</span>
            </div>
          </div>

          {submitted ? (
            <div style={{
              padding: '18px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto 8px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', margin: 0 }}>
                ¡Solicitud enviada al Mentor!
              </h4>
              <p style={{ fontSize: '12px', color: '#166534', margin: '4px 0 0 0' }}>
                Te llegará la invitación para coordinar el kickoff del squad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                  Selecciona la vacante a la que aspiras:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {squad.lookingFor.map((role, idx) => (
                    <label
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: selectedRole === role ? '1.5px solid #0d9488' : '1px solid rgba(0,0,0,0.1)',
                        background: selectedRole === role ? '#f0fdfa' : '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: selectedRole === role ? '#0f766e' : '#424245',
                        fontWeight: selectedRole === role ? 700 : 500
                      }}
                    >
                      <input
                        type="radio"
                        name="squadRole"
                        value={role}
                        checked={selectedRole === role}
                        onChange={() => setSelectedRole(role)}
                        style={{ accentColor: '#0d9488' }}
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '4px' }}>
                  Tu Enlace de GitHub
                </span>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/tu-usuario"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                className="apple-btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginTop: '4px'
                }}
              >
                <Send size={13} />
                <span>Enviar Solicitud de Entrada</span>
              </button>
            </form>
          )}

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
