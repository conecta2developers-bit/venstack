import React, { useState, useMemo } from 'react';
import { 
  X, Users, Briefcase, ExternalLink, Mail, Phone, MessageSquare, 
  CheckCircle2, Clock, Eye, AlertCircle, Filter, Search, ChevronDown, Check,
  Sparkles, Star, UserCheck, ShieldCheck
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'En revisión',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    icon: Clock
  },
  contacted: {
    label: 'Contactado',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: MessageSquare
  },
  interview: {
    label: 'En entrevista',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: Users
  },
  accepted: {
    label: 'Seleccionado',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: CheckCircle2
  },
  rejected: {
    label: 'Descartado',
    color: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    icon: X
  }
};

export const CompanyApplicantsModal = ({
  isOpen,
  onClose,
  company,
  companyJobs = [],
  applications = [],
  onUpdateStatus,
  onViewDeveloper,
  initialJobId = null
}) => {
  const [selectedJobId, setSelectedJobId] = useState(initialJobId || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  // Filter applications that belong to this company
  const companyApps = useMemo(() => {
    const compName = (company?.name || company?.companyName || '').toLowerCase().trim();
    const compId = company?.id;

    return applications.filter((app) => {
      if (compId && app.companyId && app.companyId === compId) return true;
      if (compName && app.companyName && app.companyName.toLowerCase().includes(compName)) return true;
      if (compName && app.jobTitle && companyJobs.some((j) => j.id === app.jobId)) return true;
      return false;
    });
  }, [applications, company, companyJobs]);

  // Filter by job, status and query
  const filteredApps = useMemo(() => {
    return companyApps.filter((app) => {
      if (selectedJobId !== 'all' && app.jobId !== selectedJobId) {
        return false;
      }
      if (selectedStatus !== 'all' && app.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = app.candidateName?.toLowerCase().includes(q);
        const matchesRole = app.candidateRole?.toLowerCase().includes(q);
        const matchesJob = app.jobTitle?.toLowerCase().includes(q);
        const matchesPitch = app.pitch?.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesJob && !matchesPitch) {
          return false;
        }
      }
      return true;
    });
  }, [companyApps, selectedJobId, selectedStatus, searchQuery]);

  // Counts by status
  const countsByStatus = useMemo(() => {
    const base = selectedJobId === 'all' 
      ? companyApps 
      : companyApps.filter((a) => a.jobId === selectedJobId);

    return {
      all: base.length,
      pending: base.filter((a) => a.status === 'pending').length,
      contacted: base.filter((a) => a.status === 'contacted').length,
      interview: base.filter((a) => a.status === 'interview').length,
      accepted: base.filter((a) => a.status === 'accepted').length,
      rejected: base.filter((a) => a.status === 'rejected').length
    };
  }, [companyApps, selectedJobId]);

  const handleStatusChange = (appId, newStatus) => {
    onUpdateStatus?.(appId, newStatus);
  };

  const handleSaveNote = (appId) => {
    const currentApp = companyApps.find((a) => a.id === appId);
    if (currentApp) {
      onUpdateStatus?.(appId, currentApp.status, noteText);
    }
    setEditingNotesId(null);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div 
        className="apple-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        
        {/* Header */}
        <div className="apple-modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              flexShrink: 0
            }}>
              <Users size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em' }}>
                  Postulantes & Candidatos
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563eb',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '1px 7px',
                  borderRadius: '999px'
                }}>
                  {companyApps.length} {companyApps.length === 1 ? 'postulación' : 'postulaciones'}
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#6e6e73', margin: '2px 0 0 0' }}>
                Talento que ha aplicado a las vacantes de <strong>{company?.name || company?.companyName || 'tu empresa'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              transition: 'all 0.15s ease'
            }}
            title="Cerrar"
          >
            <X size={15} color="#1d1d1f" strokeWidth={2.4} />
          </button>
        </div>

        {/* Body */}
        <div className="apple-modal-body" style={{ padding: '18px 22px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Controls Bar: Job Filter & Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Job Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 260px' }}>
                <Briefcase size={14} color="#64748b" />
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1e293b',
                    background: '#ffffff',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="all">Todas las vacantes publicadas ({companyApps.length})</option>
                  {companyJobs.map((job) => {
                    const jobCount = companyApps.filter((a) => a.jobId === job.id).length;
                    return (
                      <option key={job.id} value={job.id}>
                        {job.title} ({jobCount})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f8fafc',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                padding: '0 10px',
                height: '34px',
                flex: '1 1 220px'
              }}>
                <Search size={13} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Buscar candidato por nombre o rol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    outline: 'none',
                    width: '100%',
                    color: '#1e293b'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    <X size={12} color="#94a3b8" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Pills */}
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              {[
                { id: 'all', label: 'Todos', count: countsByStatus.all },
                { id: 'pending', label: '🟡 En revisión', count: countsByStatus.pending },
                { id: 'contacted', label: '🔵 Contactados', count: countsByStatus.contacted },
                { id: 'interview', label: '🟣 En entrevista', count: countsByStatus.interview },
                { id: 'accepted', label: '🟢 Seleccionados', count: countsByStatus.accepted },
                { id: 'rejected', label: '⚪ Descartados', count: countsByStatus.rejected },
              ].map((pill) => {
                const isActive = selectedStatus === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedStatus(pill.id)}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '999px',
                      border: isActive ? '1px solid #2563eb' : '1px solid rgba(0, 0, 0, 0.08)',
                      background: isActive ? '#eff6ff' : '#ffffff',
                      color: isActive ? '#1d4ed8' : '#64748b',
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{pill.label}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      opacity: isActive ? 1 : 0.75,
                      background: isActive ? '#2563eb' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b',
                      borderRadius: '999px',
                      padding: '1px 6px',
                      lineHeight: 1.2
                    }}>
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidates List */}
          {filteredApps.length === 0 ? (
            <div style={{
              padding: '48px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                {companyApps.length === 0 
                  ? 'Aún no has recibido postulaciones' 
                  : 'No se encontraron postulantes con los filtros seleccionados'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, maxWidth: '440px' }}>
                {companyApps.length === 0 
                  ? 'Cuando los desarrolladores apliquen a tus ofertas de empleo o micro-bounties desde el directorio, sus fichas técnicas y propuestas aparecerán aquí en tiempo real.'
                  : 'Prueba cambiando el filtro de vacante o estado para ver todas las postulaciones disponibles.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredApps.map((app) => {
                const statusInfo = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusInfo.icon;
                const initials = (app.candidateName || 'Dev').substring(0, 2).toUpperCase();
                const appliedDateStr = app.appliedAt 
                  ? new Date(app.appliedAt).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : 'Reciente';

                return (
                  <div
                    key={app.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '16px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.16s ease'
                    }}
                  >
                    
                    {/* Top Row: Candidate profile info & Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: app.candidateAvatar ? '#ffffff' : '#0d9488',
                          border: '2px solid #ffffff',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '15px',
                          color: '#ffffff',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          {app.candidateAvatar ? (
                            <img 
                              src={app.candidateAvatar} 
                              alt={app.candidateName} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            initials
                          )}
                        </div>

                        {/* Candidate Name & Role */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '14.5px', color: '#1d1d1f' }}>
                              {app.candidateName}
                            </strong>
                            <span title="Perfil Verificado Venstack">
                              <ShieldCheck size={14} color="#0d9488" />
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>
                            <span>{app.candidateRole || 'Desarrollador de Software'}</span>
                            {app.candidateCity && <span> • {app.candidateCity}</span>}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                              Para: <strong>{app.jobTitle}</strong>
                            </span>
                            <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                              • {appliedDateStr}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: statusInfo.color,
                          background: statusInfo.bg,
                          border: `1px solid ${statusInfo.border}`
                        }}>
                          <StatusIcon size={12} />
                          <span>{statusInfo.label}</span>
                        </span>

                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#334155',
                            background: '#ffffff',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          title="Cambiar estado de la postulación"
                        >
                          <option value="pending">🟡 En revisión</option>
                          <option value="contacted">🔵 Contactado</option>
                          <option value="interview">🟣 En entrevista</option>
                          <option value="accepted">🟢 Seleccionado</option>
                          <option value="rejected">⚪ Descartado</option>
                        </select>
                      </div>

                    </div>

                    {/* Pitch Message */}
                    {app.pitch && (
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '12px',
                        color: '#334155',
                        lineHeight: 1.5,
                        fontStyle: 'italic'
                      }}>
                        "{app.pitch}"
                      </div>
                    )}

                    {/* Candidate Notes (If any or editable) */}
                    {app.notes && editingNotesId !== app.id && (
                      <div style={{
                        background: '#fffbeb',
                        border: '1px solid #fef3c7',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '11.5px',
                        color: '#92400e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <span><strong>Nota interna:</strong> {app.notes}</span>
                        <button
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setNoteText(app.notes);
                          }}
                          style={{ background: 'none', border: 'none', color: '#b45309', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                        >
                          Editar
                        </button>
                      </div>
                    )}

                    {editingNotesId === app.id && (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Nota privada del reclutador (ej. Excelente prueba técnica)"
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '11.5px',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => handleSaveNote(app.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: 'none',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {/* Actions & Links Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.04)'
                    }}>
                      
                      {/* Direct Channels */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        
                        {app.portfolioLink && (
                          <a
                            href={app.portfolioLink.startsWith('http') ? app.portfolioLink : `https://${app.portfolioLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              border: '1px solid #bfdbfe'
                            }}
                          >
                            <span>Portafolio / GitHub</span>
                            <ExternalLink size={11} />
                          </a>
                        )}

                        {app.candidateEmail && (
                          <a
                            href={`mailto:${app.candidateEmail}?subject=Oportunidad%20en%20Venstack%20-%20${encodeURIComponent(app.jobTitle)}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              color: '#334155',
                              fontSize: '11px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            <Mail size={12} color="#64748b" />
                            <span>{app.candidateEmail}</span>
                          </a>
                        )}

                        {app.candidatePhone && (
                          <a
                            href={`https://wa.me/${app.candidatePhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: '#ecfdf5',
                              color: '#065f46',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              border: '1px solid #a7f3d0'
                            }}
                          >
                            <Phone size={11} color="#059669" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>

                      {/* Recruiter Quick Tools */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        
                        {!app.notes && editingNotesId !== app.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(app.id);
                              setNoteText('');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: '4px 6px'
                            }}
                          >
                            + Agregar nota
                          </button>
                        )}

                        {onViewDeveloper && (app.candidateId || app.candidateName) && (
                          <button
                            type="button"
                            onClick={() => {
                              onViewDeveloper(app.candidateId, app.candidateName);
                            }}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              background: '#0d9488',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
                            }}
                          >
                            <Eye size={12} />
                            <span>Ver Ficha Técnica</span>
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

      </div>
    </div>
  );
};
