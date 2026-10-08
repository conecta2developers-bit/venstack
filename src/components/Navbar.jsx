import React from 'react';
import { Code2, Search, Plus, Briefcase, X, LogIn, LogOut, User, Edit3 } from 'lucide-react';

export const Navbar = ({ 
  isIntro = false,
  activeTab, 
  setActiveTab, 
  onOpenCreateProfile, 
  onOpenPublishJob, 
  searchQuery, 
  setSearchQuery,
  currentUser = null,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Header Search Box */}
          <div className="apple-search-box" style={{ display: 'none' }} id="header-search">
            <Search size={14} color="#86868b" />
            <input
              type="text"
              placeholder="Buscar por rol, stack o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="apple-search-input"
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

          <button
            onClick={onOpenPublishJob}
            className="apple-btn-secondary"
            style={{ display: 'none' }}
            id="publish-btn"
          >
            <Briefcase size={13} />
            <span>Publicar Oferta</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '7px', 
                  background: '#f5f5f7', 
                  padding: '4px 10px 4px 6px', 
                  borderRadius: '999px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  cursor: 'pointer' 
                }}
                onClick={onOpenCreateProfile}
                title={hasProfile ? "Editar mi perfil" : "Crear mi perfil"}
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1d1d1f' }}>{currentUser.name}</span>
                  <span style={{ fontSize: '9px', color: '#0d9488', fontWeight: 600 }}>{currentUser.role}</span>
                </div>
              </div>

              <button
                onClick={onOpenCreateProfile}
                className="apple-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '11.5px', gap: '5px' }}
                title={hasProfile ? "Editar mi perfil" : "Crear mi perfil"}
              >
                {hasProfile ? <Edit3 size={12} /> : <Plus size={12} strokeWidth={2.5} />}
                <span>{hasProfile ? 'Editar mi Perfil' : 'Crear mi Perfil'}</span>
              </button>

              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: '#86868b',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.16s ease'
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={onOpenLogin}
                className="apple-btn-secondary"
                style={{ padding: '7px 12px', fontSize: '12px' }}
              >
                <LogIn size={13} />
                <span>Ingresar</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="apple-btn-primary"
                style={{ padding: '7px 14px', fontSize: '12px' }}
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
        }
      `}</style>
    </header>
  );
};
