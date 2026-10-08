import React from 'react';
import { Code2, Search, Plus, Briefcase, X, LogIn, LogOut, User, Building2, Smartphone } from 'lucide-react';

export const Navbar = ({ 
  isIntro = false,
  activeTab, 
  setActiveTab, 
  onOpenCreateProfile, 
  onOpenPublishJob, 
  onOpenPwaInstall,
  searchQuery, 
  setSearchQuery,
  currentUser = null,
  userProfile = null,
  companyProfile = null,
  isCompanyUser = false,
  hasProfile = false,
  onOpenLogin,
  onOpenRegister,
  onLogout
}) => {
  return (
    <header className={`apple-header ${isIntro ? 'navbar-intro-hidden' : 'navbar-intro-visible'}`}>
      <div className="apple-header-inner">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('developers')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer', 
            userSelect: 'none',
            overflow: 'visible' 
          }}
          title="Venstack — Venezuela Tech Community"
        >
          <img 
            src="/img/venstack.png" 
            alt="Venstack - Venezuela Tech Community" 
            style={{ 
              height: '74px', 
              width: 'auto', 
              objectFit: 'contain',
              display: 'block',
              margin: '-12px -10px -12px -6px'
            }} 
          />
        </div>

        {/* Desktop Segmented Nav (The ONLY primary tab navigation on desktop) */}
        <nav className="apple-nav-segmented" style={{ display: 'none' }} id="desktop-nav">
          <button
            onClick={() => setActiveTab('developers')}
            className={`apple-nav-btn ${activeTab === 'developers' ? 'active' : ''}`}
          >
            Desarrolladores
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`apple-nav-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          >
            Empleos & Bounties
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#d97706'
            }} />
          </button>
          <button
            onClick={() => setActiveTab('squads')}
            className={`apple-nav-btn ${activeTab === 'squads' ? 'active' : ''}`}
          >
            Squads
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`apple-nav-btn ${activeTab === 'community' ? 'active' : ''}`}
          >
            Comunidad
          </button>
        </nav>

        {/* Actions & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Header Search Box */}
          <div 
            className="apple-search-box" 
            style={{ 
              display: 'none',
              height: '35px',
              padding: '0 12px',
              boxSizing: 'border-box'
            }} 
            id="header-search"
          >
            <Search size={14} color="#86868b" />
            <input
              type="text"
              placeholder="Buscar por rol, stack o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="apple-search-input"
              style={{ fontSize: '12px' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'flex' }}
              >
                <X size={12} color="#86868b" />
              </button>
            )}
          </div>

          {/* Button: Publicar Oferta */}
          <button
            onClick={onOpenPublishJob}
            style={{ 
              display: 'none',
              height: '35px',
              padding: '0 13px',
              borderRadius: '999px',
              border: isCompanyUser ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
              background: isCompanyUser ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
              color: isCompanyUser ? '#ffffff' : '#1d1d1f',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isCompanyUser ? '0 2px 8px rgba(37,99,235,0.22)' : '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.16s ease',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
            id="publish-btn"
          >
            <Briefcase size={13.5} color={isCompanyUser ? '#ffffff' : '#4b5563'} />
            <span>Publicar Oferta</span>
          </button>

          {/* Button: Instalar App */}
          {onOpenPwaInstall && (
            <button
              onClick={onOpenPwaInstall}
              style={{ 
                display: 'none',
                height: '35px',
                padding: '0 13px',
                borderRadius: '999px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                background: '#ffffff',
                color: '#1d1d1f',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.16s ease',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
              id="install-pwa-btn"
              title="Instalar Venstack en tu pantalla de inicio"
            >
              <Smartphone size={13.5} color="#0d9488" />
              <span>Instalar App</span>
            </button>
          )}

          {/* User Auth Section */}
          {currentUser ? (() => {
            const effectiveAvatar = isCompanyUser ? (companyProfile?.avatar || currentUser?.avatar) : (userProfile?.avatar || currentUser?.avatar);
            const effectiveName = isCompanyUser ? (companyProfile?.name || companyProfile?.companyName || currentUser?.name || 'Mi Empresa') : (userProfile?.name || currentUser?.name || 'Miembro Venstack');
            const effectiveRole = isCompanyUser ? 'Empresa Verificada' : (userProfile?.role || currentUser?.role || 'Software Engineer');
            const firstLetter = (effectiveName || 'U').charAt(0).toUpperCase();

            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '7px', 
                    height: '35px',
                    boxSizing: 'border-box',
                    background: isCompanyUser ? 'rgba(37, 99, 235, 0.08)' : '#f5f5f7', 
                    padding: '0 11px 0 5px', 
                    borderRadius: '999px',
                    border: isCompanyUser ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.16s ease'
                  }}
                  onClick={onOpenCreateProfile}
                  title={isCompanyUser ? "Ver y editar perfil de mi empresa" : "Ver y editar mi perfil profesional"}
                >
                  {effectiveAvatar ? (
                    <img 
                      src={effectiveAvatar} 
                      alt={effectiveName} 
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        display: 'block',
                        flexShrink: 0
                      }} 
                    />
                  ) : isCompanyUser ? (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Building2 size={12.5} />
                    </div>
                  ) : (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#0d9488',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {firstLetter}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, justifyContent: 'center' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1d1d1f', maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {effectiveName}
                    </span>
                    <span style={{ fontSize: '8.5px', color: isCompanyUser ? '#2563eb' : '#0d9488', fontWeight: 700 }}>
                      {effectiveRole}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  style={{
                    width: '35px',
                    height: '35px',
                    boxSizing: 'border-box',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: '#86868b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.16s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#86868b';
                    e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                  }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            );
          })() : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={onOpenLogin}
                className="apple-btn-secondary"
                style={{ 
                  height: '35px',
                  padding: '0 14px',
                  fontSize: '12px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogIn size={13} />
                <span>Ingresar</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="apple-btn-primary"
                style={{ 
                  height: '35px',
                  padding: '0 15px',
                  fontSize: '12px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Crear Perfil</span>
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          #header-search { display: flex !important; }
          #publish-btn { display: inline-flex !important; }
          #install-pwa-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};
