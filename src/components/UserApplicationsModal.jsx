import React, { useState, useMemo } from 'react';
import { 
  X, Briefcase, ExternalLink, Mail, Phone, MessageSquare, 
  CheckCircle2, Clock, AlertCircle, Search, ChevronDown, ChevronUp,
  Building2, Calendar, FileText, Send, Trash2, ArrowRight, Sparkles,
  DollarSign, MapPin, Check, Users
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'En revisión',
    description: 'Tu postulación fue recibida y está en cola de evaluación por el equipo de contratación.',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    icon: Clock
  },
  contacted: {
    label: 'Contactado',
    description: '¡Buenas noticias! La empresa revisó tu postulación con interés y te contactará pronto.',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: MessageSquare
  },
  interview: {
    label: 'En entrevista',
    description: '¡Excelente! Has avanzado a la fase de entrevistas técnicas o de equipo.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: Users
  },
  accepted: {
    label: 'Seleccionado',
    description: '¡Felicitaciones! Tu candidatura ha sido seleccionada para esta posición.',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: CheckCircle2
  },
  rejected: {
    label: 'Proceso finalizado',
    description: 'La vacante se cerró o se avanzó con otro candidato. ¡Sigue aplicando a nuevas oportunidades!',
    color: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    icon: X
  }
};

export const UserApplicationsModal = ({
  isOpen,
  onClose,
  applications = [],
  jobs = [],
  onSelectJob,
  onSelectCompany,
  onExploreJobs,
  onWithdrawApplication
}) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);

  // Filter applications by search and status
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (selectedStatus !== 'all' && (app.status || 'pending') !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesJob = app.jobTitle?.toLowerCase().includes(q);
        const matchesComp = app.companyName?.toLowerCase().includes(q);
        const matchesPitch = app.pitch?.toLowerCase().includes(q);
        if (!matchesJob && !matchesComp && !matchesPitch) {
          return false;
        }
      }
      return true;
    });
  }, [applications, selectedStatus, searchQuery]);

  // Counts by status
  const counts = useMemo(() => {
    const res = {
      all: applications.length,
      pending: 0,
      contacted: 0,
      interview: 0,
      accepted: 0,
      rejected: 0
    };
    applications.forEach((app) => {
      const st = app.status || 'pending';
      if (res[st] !== undefined) {
        res[st]++;
      }
    });
    return res;
  }, [applications]);

  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Reciente';
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'Reciente';
    }
  };

  const handleWithdraw = (appId) => {
    onWithdrawApplication?.(appId);
    setConfirmWithdrawId(null);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="apple-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, #ffffff, #fbfbfd)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
              flexShrink: 0
            }}>
              <Send size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>
                  Mis Postulaciones
                </h3>
                <span style={{
                  background: '#f0fdf4',
                  color: '#15803d',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid #bbf7d0'
                }}>
                  {applications.length} {applications.length === 1 ? 'postulación' : 'postulaciones'}
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#6e6e73', margin: '2px 0 0 0' }}>
                Sigue en tiempo real el estado de tus candidaturas y el feedback de las empresas
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="apple-modal-close"
            style={{ position: 'static' }}
            title="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 24px' }}>
          
          {/* Quick Metrics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            marginBottom: '18px'
          }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 14px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Total Enviadas
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {counts.all}
              </div>
            </div>

            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '14px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} color="#b45309" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                  En Revisión
                </span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#92400e', marginTop: '2px' }}>
                {counts.pending}
              </div>
            </div>

            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MessageSquare size={12} color="#1d4ed8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
                  Contactado
                </span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e40af', marginTop: '2px' }}>
                {counts.contacted}
              </div>
            </div>

            <div style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '14px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} color="#6d28d9" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>
                  En Entrevista
                </span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#5b21b6', marginTop: '2px' }}>
                {counts.interview}
              </div>
            </div>

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '14px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#047857" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                  Seleccionado
                </span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>
                {counts.accepted}
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px',
            background: '#ffffff',
            padding: '14px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f5f5f7',
              borderRadius: '10px',
              padding: '8px 12px'
            }}>
              <Search size={15} color="#86868b" />
              <input 
                type="text"
                placeholder="Buscar por cargo, vacante o nombre de empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%',
                  color: '#1d1d1f'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#86868b', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
              {[
                { id: 'all', label: 'Todas', count: counts.all },
                { id: 'pending', label: 'En revisión', count: counts.pending },
                { id: 'contacted', label: 'Contactado', count: counts.contacted },
                { id: 'interview', label: 'En entrevista', count: counts.interview },
                { id: 'accepted', label: 'Seleccionado', count: counts.accepted },
                { id: 'rejected', label: 'Finalizado', count: counts.rejected }
              ].map((chip) => {
                const isActive = selectedStatus === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedStatus(chip.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: isActive ? '1px solid #0d9488' : '1px solid rgba(0, 0, 0, 0.08)',
                      background: isActive ? '#0d9488' : '#ffffff',
                      color: isActive ? '#ffffff' : '#4b5563',
                      fontSize: '11.5px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{chip.label}</span>
                    <span style={{
                      fontSize: '10px',
                      opacity: isActive ? 0.9 : 0.7,
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                      padding: '1px 5px',
                      borderRadius: '999px'
                    }}>
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Application Cards List */}
          {filteredApps.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: '#fbfbfd',
              borderRadius: '20px',
              border: '1px dashed rgba(0, 0, 0, 0.12)'
            }}>
              {applications.length === 0 ? (
                <>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(13, 148, 136, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    color: '#0d9488'
                  }}>
                    <Briefcase size={28} />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    Aún no te has postulado a ninguna vacante
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6e6e73', maxWidth: '420px', margin: '8px auto 20px', lineHeight: 1.5 }}>
                    Explora las oportunidades laborales, empleos remotos y micro-bounties disponibles en Venstack con salarios en USDT y pagos directos.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onExploreJobs?.();
                    }}
                    style={{
                      background: '#0d9488',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '10px 22px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)'
                    }}
                  >
                    <span>Explorar Vacantes de Empleo</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              ) : (
                <>
                  <AlertCircle size={32} color="#86868b" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                    No se encontraron postulaciones
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#6e6e73', margin: '4px 0 14px' }}>
                    Prueba cambiando el filtro de estado o la búsqueda para ver todas tus postulaciones.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedStatus('all');
                      setSearchQuery('');
                    }}
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: '#ffffff',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#1d1d1f'
                    }}
                  >
                    Restablecer Filtros
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredApps.map((app) => {
                const statusKey = app.status || 'pending';
                const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedAppId === app.id;
                const isConfirming = confirmWithdrawId === app.id;

                // Match with original job from the jobs list if available
                const matchingJob = jobs.find((j) => j.id === app.jobId);

                return (
                  <div
                    key={app.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '18px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      padding: '18px 20px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Top Row: Job Title, Company and Status Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: matchingJob?.logoBg || '#f1f5f9',
                          border: '1px solid rgba(0,0,0,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '15px',
                          fontWeight: 800,
                          color: '#1e293b',
                          flexShrink: 0
                        }}>
                          {matchingJob?.logoText || app.companyName?.substring(0, 2).toUpperCase() || 'EM'}
                        </div>

                        <div>
                          <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em' }}>
                            {app.jobTitle}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => onSelectCompany?.(app.companyName)}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#0d9488',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Ver información de la empresa"
                            >
                              <Building2 size={13} />
                              <span>{app.companyName}</span>
                            </button>

                            <span style={{ color: '#cbd5e1' }}>•</span>

                            <span style={{ fontSize: '12px', color: '#86868b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} />
                              <span>Postulado el {formatDate(app.appliedAt)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        <StatusIcon size={14} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    {/* Status Explanation Banner */}
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      background: statusInfo.bg,
                      borderRadius: '12px',
                      borderLeft: `4px solid ${statusInfo.color}`,
                      fontSize: '12px',
                      color: statusInfo.color,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <div style={{ flex: 1, fontWeight: 500 }}>
                        {statusInfo.description}
                      </div>
                    </div>

                    {/* Recruiter Notes / Feedback (if provided) */}
                    {app.notes && (
                      <div style={{
                        marginTop: '10px',
                        padding: '12px 14px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#1e40af'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                          <MessageSquare size={13} />
                          <span>Mensaje de la empresa / reclutador:</span>
                        </div>
                        <p style={{ margin: 0, fontStyle: 'italic', color: '#1e3a8a', lineHeight: 1.4 }}>
                          "{app.notes}"
                        </p>
                      </div>
                    )}

                    {/* Job Details Quick Preview */}
                    {matchingJob && (
                      <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '12px',
                        color: '#4b5563',
                        background: '#f8fafc',
                        padding: '8px 12px',
                        borderRadius: '10px'
                      }}>
                        {matchingJob.salary && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#059669' }}>
                            <DollarSign size={13} />
                            <span>{matchingJob.salary}</span>
                          </span>
                        )}
                        {matchingJob.location && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="#64748b" />
                            <span>{matchingJob.location}</span>
                          </span>
                        )}
                        {matchingJob.type && (
                          <span style={{
                            background: '#e2e8f0',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {matchingJob.type}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Collapsible Details (Candidate Pitch, Portfolio, Contact) */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                          Lo que enviaste en tu postulación
                        </span>

                        {app.pitch ? (
                          <div style={{
                            background: '#ffffff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontSize: '12.5px',
                            color: '#334155',
                            lineHeight: 1.45,
                            whiteSpace: 'pre-wrap'
                          }}>
                            <span style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                              Carta de presentación / Pitch:
                            </span>
                            {app.pitch}
                          </div>
                        ) : (
                          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                            Postulación directa enviada con perfil de Venstack.
                          </p>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                          {app.candidateEmail && (
                            <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Mail size={13} color="#64748b" />
                              <span>{app.candidateEmail}</span>
                            </div>
                          )}
                          {app.candidatePhone && (
                            <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Phone size={13} color="#64748b" />
                              <span>{app.candidatePhone}</span>
                            </div>
                          )}
                          {app.portfolioLink && (
                            <a
                              href={app.portfolioLink.startsWith('http') ? app.portfolioLink : `https://${app.portfolioLink}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: '12px',
                                color: '#0d9488',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <ExternalLink size={12} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {app.portfolioLink}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions Row */}
                    <div style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '4px 8px',
                          color: '#64748b',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{isExpanded ? 'Ocultar datos enviados' : 'Ver datos que enviaste'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {matchingJob && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectJob?.(matchingJob);
                            }}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              padding: '5px 12px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              color: '#334155',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            title="Ver la publicación original de esta vacante"
                          >
                            <Briefcase size={12} />
                            <span>Ver Oferta</span>
                          </button>
                        )}

                        {/* Withdraw application option */}
                        {isConfirming ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>¿Retirar?</span>
                            <button
                              onClick={() => handleWithdraw(app.id)}
                              style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Sí, retirar
                            </button>
                            <button
                              onClick={() => setConfirmWithdrawId(null)}
                              style={{
                                background: '#e2e8f0',
                                color: '#475569',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmWithdrawId(app.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 6px'
                            }}
                            title="Retirar mi postulación a esta vacante"
                          >
                            <Trash2 size={12} />
                            <span>Retirar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          background: '#fbfbfd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '12px', color: '#86868b' }}>
            Las empresas reciben tus datos en tiempo real al postularte.
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#1d1d1f',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '7px 18px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
