import React from 'react';
import { 
  X, Building2, Globe, MapPin, Users, Briefcase, 
  ShieldCheck, ExternalLink, Check, Coins, ArrowRight, Edit3 
} from 'lucide-react';

export const CompanyDetailModal = ({ 
  company, 
  onClose, 
  onSelectJob, 
  activeJobs = [],
  isOwner = false,
  onEditCompany,
  onOpenApplicants = null,
  applicantsCount = 0
}) => {
  if (!company) return null;

  const relevantJobs = activeJobs.filter((j) => 
    j.company?.toLowerCase().includes((company.name || company.companyName || '').toLowerCase()) ||
    (company.name && j.company?.toLowerCase().includes(company.name.toLowerCase()))
  );

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div 
        className="apple-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        
        {/* Header */}
        <div className="apple-modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#2563eb',
              background: '#eff6ff',
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={13} color="#2563eb" />
              Empresa Verificada
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isOwner && onOpenApplicants && (
              <button
                onClick={() => {
                  onClose();
                  onOpenApplicants();
                }}
                className="apple-btn-secondary"
                style={{
                  fontSize: '11.5px',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderColor: '#93c5fd',
                  color: '#1d4ed8',
                  background: '#eff6ff',
                  cursor: 'pointer'
                }}
                title="Ver postulantes a las ofertas de mi empresa"
              >
                <Users size={13} color="#2563eb" />
                <span>Postulantes</span>
                {applicantsCount > 0 && (
                  <span style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '1px 5px',
                    lineHeight: 1
                  }}>
                    {applicantsCount}
                  </span>
                )}
              </button>
            )}

            {isOwner && onEditCompany && (
              <button
                onClick={() => {
                  onClose();
                  onEditCompany();
                }}
                className="apple-btn-secondary"
                style={{
                  fontSize: '11.5px',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderColor: '#93c5fd',
                  color: '#1d4ed8',
                  background: '#eff6ff',
                  cursor: 'pointer'
                }}
                title="Editar los datos de mi empresa"
              >
                <Edit3 size={13} color="#2563eb" />
                <span>Editar Empresa</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.04)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex'
              }}
              title="Cerrar"
            >
              <X size={15} color="#1d1d1f" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="apple-modal-body" style={{ padding: '20px 22px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Company Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: company.avatar ? '#ffffff' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              color: '#1d4ed8',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              {company.avatar ? (
                <img 
                  src={company.avatar} 
                  alt={company.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                company.logoText || (company.name || 'EM').substring(0, 2).toUpperCase()
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em', margin: 0 }}>
                  {company.name || company.companyName}
                </h2>
                <ShieldCheck size={18} color="#2563eb" />
              </div>

              <p style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', margin: '2px 0 0 0' }}>
                {company.industry || 'Empresa de Tecnología'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '6px', fontSize: '11.5px', color: '#6e6e73' }}>
                {company.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#86868b" />
                    {company.location}
                  </span>
                )}
                {company.companySize && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} color="#86868b" />
                    {company.companySize}
                  </span>
                )}
                {company.website && (
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Globe size={12} />
                    <span>Sitio Web</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px 16px',
              fontSize: '13px',
              color: '#334155',
              lineHeight: 1.55
            }}>
              {company.description}
            </div>
          )}

          {/* Tech Stack */}
          {company.techStack && company.techStack.length > 0 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '8px' }}>
                Stack Tecnológico de la Empresa
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {company.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#1e293b'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits Provided */}
          {company.benefits && company.benefits.length > 0 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '8px' }}>
                Beneficios para Profesionales
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px' }}>
                {company.benefits.map((b) => (
                  <div 
                    key={b}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      color: '#166534',
                      fontWeight: 600
                    }}
                  >
                    <Check size={12} strokeWidth={3} color="#16a34a" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {company.paymentMethods && company.paymentMethods.length > 0 && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', display: 'block', marginBottom: '6px' }}>
                Métodos de Pago Habilitados
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {company.paymentMethods.map((p) => (
                  <span 
                    key={p}
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#92400e'
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Job Postings from this company */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                Oportunidades Disponibles ({relevantJobs.length})
              </span>
            </div>

            {relevantJobs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relevantJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      onClose();
                      onSelectJob?.(job);
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.16s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                        {job.title}
                      </h4>
                      <p style={{ fontSize: '11.5px', color: '#6e6e73', margin: '2px 0 0 0' }}>
                        <strong style={{ color: '#0d9488' }}>{job.salary}</strong> • {job.location}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '11px', fontWeight: 700 }}>
                      <span>Ver Vacante</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#64748b'
              }}>
                Esta empresa aún no tiene vacantes activas listadas en este momento.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
