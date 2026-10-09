import React, { useState } from 'react';
import { X, CheckCircle, Clock, Coins, Send, Briefcase, Users } from 'lucide-react';

export const JobModal = ({
  job,
  onClose,
  onSelectCompany,
  currentUser = null,
  userProfile = null,
  onApplyToJob,
  isCompanyUser = false,
  onViewApplicants,
  applicantsCount = 0
}) => {
  const [applied, setApplied] = useState(false);
  const [candidateName, setCandidateName] = useState(userProfile?.name || currentUser?.name || '');
  const [candidateEmail, setCandidateEmail] = useState(currentUser?.email || '');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [portfolioLink, setPortfolioLink] = useState(
    userProfile?.featuredProject?.githubUrl || userProfile?.featuredProject?.demoUrl || ''
  );
  const [pitch, setPitch] = useState('');

  if (!job) return null;

  const handleApply = (e) => {
    e.preventDefault();
    const appPayload = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId || null,
      companyName: job.company,
      candidateId: userProfile?.id || (currentUser?.uid ? `dev-${currentUser.uid}` : null),
      candidateName: candidateName || userProfile?.name || currentUser?.name || 'Desarrollador Postulado',
      candidateRole: userProfile?.role || 'Desarrollador de Software',
      candidateAvatar: userProfile?.avatar || currentUser?.avatar || '',
      candidateCity: userProfile?.city || 'Venezuela (Remoto)',
      candidateEmail: candidateEmail || currentUser?.email || '',
      candidatePhone: candidatePhone || '',
      portfolioLink: portfolioLink.trim(),
      pitch: pitch.trim(),
      status: 'pending',
      appliedAt: Date.now(),
      notes: ''
    };

    onApplyToJob?.(appPayload);
    setApplied(true);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* iOS Drag Handle */}
        <div className="apple-bottom-handle" style={{ display: 'none' }} id="modal-handle" />

        {/* Header */}
        <div className="apple-modal-header">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
            {job.isBounty ? 'Detalle de Micro-Bounty' : 'Detalle de la Vacante'}
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
          
          {/* Company & Role */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              onClick={() => onSelectCompany?.(job.company)}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#f0fdfa',
                border: '1px solid #ccfbf1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
                color: '#0f766e',
                cursor: onSelectCompany ? 'pointer' : 'default',
                transition: 'all 0.15s ease'
              }}
              title="Ver perfil de la empresa"
            >
              {job.companyLogo}
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em', margin: 0 }}>
                {job.title}
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6e6e73', margin: '2px 0 0 0' }}>
                <strong 
                  onClick={() => onSelectCompany?.(job.company)}
                  style={{ 
                    color: onSelectCompany ? '#2563eb' : '#1d1d1f', 
                    cursor: onSelectCompany ? 'pointer' : 'default',
                    textDecoration: onSelectCompany ? 'underline' : 'none'
                  }}
                  title="Ver perfil de la empresa"
                >
                  {job.company}
                </strong> • {job.location}
              </p>
            </div>
          </div>

          {/* Salary & Method Highlight */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#92400e', display: 'block' }}>
                {job.isBounty ? 'Recompensa por Entrega' : 'Compensación Mensual'}
              </span>
              <strong style={{ fontSize: '16px', color: '#78350f', marginTop: '2px', display: 'block' }}>
                {job.salary}
              </strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#86868b', display: 'block' }}>Vía de pago</span>
              <span style={{
                background: '#ffffff',
                border: '1px solid #fde68a',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#78350f',
                display: 'inline-block',
                marginTop: '2px'
              }}>
                {job.paymentMethods.join(', ')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '6px' }}>
              Descripción de la Tarea / Rol
            </span>
            <div style={{ padding: '12px 14px', background: '#f5f5f7', borderRadius: '14px', fontSize: '12.5px', color: '#424245', lineHeight: 1.55 }}>
              {job.description}
            </div>
          </div>

          {/* Stack */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '6px' }}>
              Stack Solicitado
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {job.tags.map((tag, idx) => (
                <span key={idx} className="apple-skill-pill" style={{ padding: '4px 10px', fontSize: '11.5px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recruiter / Company View Box */}
          {isCompanyUser && (
            <div style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(30, 64, 175, 0.08) 100%)',
              border: '1.5px solid rgba(37, 99, 235, 0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1d4ed8', display: 'block' }}>
                  Panel de Empresa / Reclutador
                </span>
                <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                  {applicantsCount === 1 ? '1 candidato postulado' : `${applicantsCount} candidatos postulados`}
                </p>
              </div>

              {onViewApplicants && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewApplicants(job);
                  }}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <Users size={14} />
                  <span>Ver Postulantes ({applicantsCount})</span>
                </button>
              )}
            </div>
          )}

          {/* 1-Click Apply Form or Confirmation */}
          <div style={{ marginTop: '4px' }}>
            {applied ? (
              <div style={{
                padding: '16px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <CheckCircle size={32} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', margin: 0 }}>
                  ¡Postulación Enviada con Éxito!
                </h4>
                <p style={{ fontSize: '12px', color: '#166534', margin: '4px 0 0 0' }}>
                  El contratante revisará tu perfil verificado en Venstack y te responderá por tus canales directos.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block' }}>
                  Postulación Rápida (1-Clic)
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '3px' }}>
                      Tu Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Luis Ramírez"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '3px' }}>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu-correo@ejemplo.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '3px' }}>
                      Enlace GitHub / Portafolio
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/tu-usuario"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '3px' }}>
                      WhatsApp (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="+58 412 1234567"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '3px' }}>
                    Mensaje / Propuesta para el Contratante
                  </label>
                  <textarea
                    rows="2"
                    required
                    placeholder="¿Por qué eres ideal para esta vacante o bounty? (Ej. Experiencia previa, stack, disponibilidad)"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'none'
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
                    fontSize: '13px'
                  }}
                >
                  <Send size={13} />
                  <span>Enviar Postulación Inmediata</span>
                </button>
              </form>
            )}
          </div>

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
