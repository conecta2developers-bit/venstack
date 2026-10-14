import React, { useState, useMemo } from 'react';
import { 
  X, Shield, CheckCircle, Clock, Star, Trash2, Search, 
  ExternalLink, Phone, Mail, Building2, User, Check, AlertTriangle, Eye, Sparkles
} from 'lucide-react';
import { getProfilePlaceholderSvg } from '../utils/avatar';

export const AdminPanelModal = ({
  isOpen,
  onClose,
  developers = [],
  companies = [],
  onUpdateDeveloper,
  onUpdateCompany,
  onDeleteDeveloper,
  onDeleteCompany,
  onSelectDev,
  onSelectCompany
}) => {
  const [activeTab, setActiveTab] = useState('developers'); // 'developers' | 'companies'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'featured'
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Counters
  const pendingDevsCount = developers.filter((d) => d.approved === false).length;
  const pendingCompaniesCount = companies.filter((c) => c.approved === false).length;
  const featuredDevsCount = developers.filter((d) => d.featured || d.isFeatured || d.destacado).length;
  const totalPending = pendingDevsCount + pendingCompaniesCount;

  // Filtered Developers
  const filteredDevs = useMemo(() => {
    return developers.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        d.name?.toLowerCase().includes(q) || 
        d.role?.toLowerCase().includes(q) || 
        d.email?.toLowerCase().includes(q) || 
        d.phone?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'pending') return d.approved === false;
      if (statusFilter === 'approved') return d.approved !== false;
      if (statusFilter === 'featured') return Boolean(d.featured || d.isFeatured || d.destacado);

      return true;
    });
  }, [developers, searchQuery, statusFilter]);

  // Filtered Companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.name?.toLowerCase().includes(q) || 
        c.companyName?.toLowerCase().includes(q) || 
        c.industry?.toLowerCase().includes(q) || 
        c.location?.toLowerCase().includes(q) || 
        c.phone?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'pending') return c.approved === false;
      if (statusFilter === 'approved') return c.approved !== false;
      if (statusFilter === 'featured') return Boolean(c.featured || c.isFeatured || c.destacado);

      return true;
    });
  }, [companies, searchQuery, statusFilter]);

  if (!isOpen) return null;

  const handleToggleApproveDev = (dev) => {
    const isCurrentlyApproved = dev.approved !== false;
    const updated = {
      ...dev,
      approved: !isCurrentlyApproved,
      updatedAt: Date.now()
    };
    onUpdateDeveloper(updated);
  };

  const handleToggleFeaturedDev = (dev) => {
    const isCurrentlyFeatured = Boolean(dev.featured || dev.isFeatured || dev.destacado);
    const updated = {
      ...dev,
      featured: !isCurrentlyFeatured,
      isFeatured: !isCurrentlyFeatured,
      destacado: !isCurrentlyFeatured,
      updatedAt: Date.now()
    };
    onUpdateDeveloper(updated);
  };

  const handleToggleApproveCompany = (comp) => {
    const isCurrentlyApproved = comp.approved !== false;
    const updated = {
      ...comp,
      approved: !isCurrentlyApproved,
      updatedAt: Date.now()
    };
    onUpdateCompany(updated);
  };

  const handleToggleFeaturedCompany = (comp) => {
    const isCurrentlyFeatured = Boolean(comp.featured || comp.isFeatured || comp.destacado);
    const updated = {
      ...comp,
      featured: !isCurrentlyFeatured,
      isFeatured: !isCurrentlyFeatured,
      destacado: !isCurrentlyFeatured,
      updatedAt: Date.now()
    };
    onUpdateCompany(updated);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div 
        className="apple-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px', width: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="apple-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Panel de Control & Moderación
                </h2>
                {totalPending > 0 && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: '#ffffff',
                    background: '#ea580c',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
                  }}>
                    {totalPending} pendientes
                  </span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                Aprueba talentos y empresas registradas antes de que sean visibles públicamente.
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
              display: 'flex'
            }}
          >
            <X size={15} color="#1d1d1f" />
          </button>
        </div>

        {/* Top KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px',
          padding: '12px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>Total Profesionales</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <strong style={{ fontSize: '18px', color: '#0f172a' }}>{developers.length}</strong>
              {pendingDevsCount > 0 && (
                <span style={{ fontSize: '10.5px', color: '#ea580c', fontWeight: 700 }}>({pendingDevsCount} por aprobar)</span>
              )}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>Total Empresas</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <strong style={{ fontSize: '18px', color: '#0f172a' }}>{companies.length}</strong>
              {pendingCompaniesCount > 0 && (
                <span style={{ fontSize: '10.5px', color: '#ea580c', fontWeight: 700 }}>({pendingCompaniesCount} por aprobar)</span>
              )}
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>Perfiles Destacados ⭐</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <strong style={{ fontSize: '18px', color: '#b45309' }}>{featuredDevsCount}</strong>
              <span style={{ fontSize: '10.5px', color: '#78350f', fontWeight: 600 }}>con estrella visible</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search */}
        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            {/* Main Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('developers')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'developers' ? '#ffffff' : 'transparent',
                  color: activeTab === 'developers' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'developers' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <User size={13} />
                <span>Profesionales ({developers.length})</span>
                {pendingDevsCount > 0 && (
                  <span style={{ background: '#ea580c', color: '#ffffff', padding: '1px 5px', borderRadius: '999px', fontSize: '9.5px', fontWeight: 800 }}>
                    {pendingDevsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('companies')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'companies' ? '#ffffff' : 'transparent',
                  color: activeTab === 'companies' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'companies' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={13} />
                <span>Empresas ({companies.length})</span>
                {pendingCompaniesCount > 0 && (
                  <span style={{ background: '#ea580c', color: '#ffffff', padding: '1px 5px', borderRadius: '999px', fontSize: '9.5px', fontWeight: 800 }}>
                    {pendingCompaniesCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Todos' },
                { id: 'pending', label: '⏳ Pendientes' },
                { id: 'approved', label: '✓ Aprobados' },
                { id: 'featured', label: '⭐ Destacados' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setStatusFilter(pill.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: statusFilter === pill.id ? 700 : 500,
                    cursor: 'pointer',
                    background: statusFilter === pill.id ? '#0f172a' : '#f8fafc',
                    color: statusFilter === pill.id ? '#ffffff' : '#475569',
                    border: statusFilter === pill.id ? '1px solid #0f172a' : '1px solid #e2e8f0'
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={activeTab === 'developers' ? "Buscar talento por nombre, rol, email, teléfono o ciudad..." : "Buscar empresa por nombre, rubro, ubicación o teléfono..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '8px 12px 8px 34px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                background: '#ffffff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* List Content */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeTab === 'developers' ? (
            filteredDevs.length > 0 ? (
              filteredDevs.map((dev) => {
                const isApproved = dev.approved !== false;
                const isFeatured = Boolean(dev.featured || dev.isFeatured || dev.destacado);

                return (
                  <div
                    key={dev.id}
                    style={{
                      background: isApproved ? '#ffffff' : '#fffbeb',
                      border: isApproved ? '1px solid #e2e8f0' : '1.5px solid #fde68a',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <img
                          src={dev.avatar || getProfilePlaceholderSvg()}
                          alt={dev.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '1px solid rgba(0,0,0,0.08)',
                            flexShrink: 0
                          }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = getProfilePlaceholderSvg();
                          }}
                        />

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{dev.name}</strong>
                            <span style={{ fontSize: '10.5px', color: '#64748b' }}>({dev.city || 'Venezuela'})</span>
                            
                            {/* Approval Status Badge */}
                            {isApproved ? (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#0f766e',
                                background: '#f0fdfa',
                                border: '1px solid #ccfbf1',
                                padding: '1px 6px',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <CheckCircle size={10} /> Aprobado
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                color: '#b45309',
                                background: '#fef3c7',
                                border: '1px solid #fde68a',
                                padding: '2px 7px',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Clock size={10} /> Pendiente de Aprobación
                              </span>
                            )}

                            {/* Featured Star Badge */}
                            {isFeatured && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                color: '#b45309',
                                background: 'rgba(245, 158, 11, 0.12)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '1px 6px',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Star size={10} color="#f59e0b" fill="#f59e0b" /> Destacado
                              </span>
                            )}
                          </div>

                          <span style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: 600, display: 'block', marginTop: '1px' }}>
                            {dev.role} • <span style={{ color: '#64748b' }}>{dev.level || 'Junior'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Contact Channels (Phone / WhatsApp & Email) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {dev.phone && (
                          <a
                            href={`https://wa.me/${dev.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#065f46',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                            title="Abrir chat de WhatsApp"
                          >
                            <Phone size={11} color="#059669" />
                            <span>{dev.phone}</span>
                          </a>
                        )}

                        {dev.email && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            fontSize: '11px'
                          }}>
                            <Mail size={11} color="#64748b" />
                            <span>{dev.email}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rates, Setup & Bio */}
                    <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <span>
                          <strong>Tarifa:</strong> {dev.rate || 'No definida'} ({dev.hourlyRate || '$/h'})
                        </span>
                        <span>
                          <strong>Energía:</strong> {dev.setup?.power || 'Verificado'}
                        </span>
                        <span>
                          <strong>Internet:</strong> {dev.setup?.internet || 'Fibra'}
                        </span>
                      </div>
                      {dev.bio && (
                        <p style={{ margin: 0, color: '#64748b', fontStyle: 'italic' }}>
                          "{dev.bio}"
                        </p>
                      )}
                    </div>

                    {/* Admin Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {/* Approve Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleApproveDev(dev)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: isApproved ? '#f1f5f9' : '#0d9488',
                            color: isApproved ? '#475569' : '#ffffff',
                            boxShadow: isApproved ? 'none' : '0 2px 6px rgba(13, 148, 136, 0.3)'
                          }}
                        >
                          <Check size={13} strokeWidth={2.5} />
                          <span>{isApproved ? 'Desaprobar / Pausar' : 'Aprobar Perfil Ahora'}</span>
                        </button>

                        {/* Toggle Featured Star */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeaturedDev(dev)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: isFeatured ? '1px solid #fde68a' : '1px solid #e2e8f0',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: isFeatured ? '#fffbeb' : '#ffffff',
                            color: isFeatured ? '#b45309' : '#64748b'
                          }}
                        >
                          <Star size={13} color="#f59e0b" fill={isFeatured ? '#f59e0b' : 'none'} />
                          <span>{isFeatured ? 'Quitar Destacado' : '⭐ Marcar Destacado'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {/* View Profile */}
                        <button
                          type="button"
                          onClick={() => onSelectDev(dev)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={12} />
                          <span>Ver Ficha</span>
                        </button>

                        {/* Delete Button */}
                        {confirmDeleteId === dev.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteDeveloper(dev.id);
                                setConfirmDeleteId(null);
                              }}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#dc2626',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Confirmar Eliminar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                fontSize: '10.5px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(dev.id)}
                            style={{
                              padding: '6px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Eliminar registro"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                <User size={32} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>No se encontraron profesionales</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px' }}>Prueba cambiando el filtro o término de búsqueda.</p>
              </div>
            )
          ) : (
            filteredCompanies.length > 0 ? (
              filteredCompanies.map((comp) => {
                const isApproved = comp.approved !== false;
                const isFeatured = Boolean(comp.featured || comp.isFeatured || comp.destacado);

                return (
                  <div
                    key={comp.id}
                    style={{
                      background: isApproved ? '#ffffff' : '#fffbeb',
                      border: isApproved ? '1px solid #e2e8f0' : '1.5px solid #fde68a',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {comp.logoText || (comp.name || 'EM').substring(0, 2).toUpperCase()}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{comp.name || comp.companyName}</strong>
                            <span style={{ fontSize: '10.5px', color: '#64748b' }}>({comp.location || 'Remoto'})</span>

                            {/* Approval Status Badge */}
                            {isApproved ? (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#0f766e',
                                background: '#f0fdfa',
                                border: '1px solid #ccfbf1',
                                padding: '1px 6px',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <CheckCircle size={10} /> Aprobada
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                color: '#b45309',
                                background: '#fef3c7',
                                border: '1px solid #fde68a',
                                padding: '2px 7px',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Clock size={10} /> Pendiente de Aprobación
                              </span>
                            )}

                            {isFeatured && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                color: '#b45309',
                                background: 'rgba(245, 158, 11, 0.12)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '1px 6px',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <Star size={10} color="#f59e0b" fill="#f59e0b" /> Destacada
                              </span>
                            )}
                          </div>

                          <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 600, display: 'block', marginTop: '1px' }}>
                            {comp.industry || 'Empresa Tech'} • <span style={{ color: '#64748b' }}>{comp.companySize || '1-10 colaboradores'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Contact / Phone */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {comp.phone && (
                          <a
                            href={`https://wa.me/${comp.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#065f46',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            <Phone size={11} color="#059669" />
                            <span>{comp.phone}</span>
                          </a>
                        )}

                        {comp.website && (
                          <a
                            href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              color: '#2563eb',
                              fontSize: '11px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            <ExternalLink size={11} />
                            <span>Sitio Web</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {comp.description && (
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px' }}>
                        {comp.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '4px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleApproveCompany(comp)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: isApproved ? '#f1f5f9' : '#2563eb',
                            color: isApproved ? '#475569' : '#ffffff',
                            boxShadow: isApproved ? 'none' : '0 2px 6px rgba(37, 99, 235, 0.3)'
                          }}
                        >
                          <Check size={13} strokeWidth={2.5} />
                          <span>{isApproved ? 'Desaprobar / Pausar' : 'Aprobar Empresa Ahora'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFeaturedCompany(comp)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: isFeatured ? '1px solid #fde68a' : '1px solid #e2e8f0',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: isFeatured ? '#fffbeb' : '#ffffff',
                            color: isFeatured ? '#b45309' : '#64748b'
                          }}
                        >
                          <Star size={13} color="#f59e0b" fill={isFeatured ? '#f59e0b' : 'none'} />
                          <span>{isFeatured ? 'Quitar Destacada' : '⭐ Destacar Empresa'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => onSelectCompany(comp)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={12} />
                          <span>Ver Perfil</span>
                        </button>

                        {confirmDeleteId === comp.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteCompany(comp.id);
                                setConfirmDeleteId(null);
                              }}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#dc2626',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                fontSize: '10.5px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(comp.id)}
                            style={{
                              padding: '6px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Eliminar empresa"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                <Building2 size={32} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>No se encontraron empresas</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px' }}>Prueba cambiando el filtro o término de búsqueda.</p>
              </div>
            )
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '10px 20px',
          background: '#f8fafc',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748b'
        }}>
          <span>Sesión activa: <strong>adminhub@venstack.com</strong></span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '11.5px'
            }}
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
