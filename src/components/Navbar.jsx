import React from 'react';
import { Code2, Search, Plus, Briefcase, X, LogIn, LogOut, User, Building2, Smartphone, Users, Send, Shield, Sparkles } from 'lucide-react';
import { getFallbackAvatar } from '../utils/avatar';

export const Navbar = ({ 
  isIntro = false,
  activeTab, 
  setActiveTab, 
  onOpenCreateProfile, 
  onOpenPublishJob, 
  onOpenPwaInstall,
  onOpenOnboardingTour = null,
  onOpenApplicants = null,
  applicantsCount = 0,
  onOpenMyApplications = null,
  myApplicationsCount = 0,
  onOpenAdminPanel = null,
  pendingApprovalCount = 0,
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
            overflow: 'visible',
            flexShrink: 0
          }}
          title="Venstack — Venezuela Tech Community"
        >
          <img 
            src="/img/venstack.png" 
            alt="Venstack - Venezuela Tech Community" 
            className="navbar-brand-logo-img"
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
          {/* Squads oculto temporalmente según solicitud */}
          <button
            onClick={() => setActiveTab('community')}
            className={`apple-nav-btn ${activeTab === 'community' ? 'active' : ''}`}
          >
            Comunidad
          </button>
        </nav>

        {/* Actions */}
        <div className="apple-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          {/* Button: Publicar Oferta */}
          <button
            onClick={onOpenPublishJob}
            style={{ 
              display: 'none',
              height: '35px',
              padding: '0 12px',
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
              boxSizing: 'border-box',
              flexShrink: 0
            }}
            id="publish-btn"
            title="Publicar Oferta de Empleo o Bounty"
          >
            <Briefcase size={13.5} color={isCompanyUser ? '#ffffff' : '#4b5563'} />
            <span>Publicar Oferta</span>
          </button>

          {/* Button: Postulantes a mis vacantes (para Empresas) */}
          {isCompanyUser && onOpenApplicants && (
            <button
              onClick={onOpenApplicants}
              id="applicants-btn"
              className="navbar-applicants-btn"
              style={{
                display: 'inline-flex',
                height: '35px',
                padding: '0 12px',
                borderRadius: '999px',
                border: '1px solid #bfdbfe',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 4px rgba(37,99,235,0.12)',
                transition: 'all 0.16s ease',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                flexShrink: 0
              }}
              title="Ver postulantes a las vacantes de mi empresa"
            >
              <Users size={14} color="#2563eb" />
              <span className="navbar-applicants-text">Postulantes</span>
              {applicantsCount > 0 && (
                <span 
                  className="navbar-applicants-count"
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '1px 6px',
                    lineHeight: 1.2
                  }}
                >
                  {applicantsCount}
                </span>
              )}
            </button>
          )}

          {/* Button: Mis Postulaciones (para Profesionales/Candidatos) */}
          {currentUser && !isCompanyUser && onOpenMyApplications && (
            <button
              onClick={onOpenMyApplications}
              id="my-applications-btn"
              className="navbar-applicants-btn"
              style={{
                display: 'inline-flex',
                height: '35px',
                padding: '0 12px',
                borderRadius: '999px',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                background: 'rgba(13, 148, 136, 0.08)',
                color: '#0d9488',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 4px rgba(13, 148, 136, 0.1)',
                transition: 'all 0.16s ease',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                flexShrink: 0
              }}
              title="Ver el estado de mis postulaciones"
            >
              <Send size={13.5} color="#0d9488" />
              <span className="navbar-applicants-text">Mis Postulaciones</span>
              {myApplicationsCount > 0 && (
                <span 
                  className="navbar-applicants-count"
                  style={{
                    background: '#0d9488',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '1px 6px',
                    lineHeight: 1.2
                  }}
                >
                  {myApplicationsCount}
                </span>
              )}
            </button>
          )}

          {/* Button: Instalar App */}
          {onOpenPwaInstall && (
            <button
              onClick={onOpenPwaInstall}
              style={{ 
                display: 'none',
                height: '35px',
                padding: '0 12px',
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
                boxSizing: 'border-box',
                flexShrink: 0
              }}
              id="install-pwa-btn"
              title="Instalar Venstack en tu pantalla de inicio"
            >
              <Smartphone size={13.5} color="#0d9488" />
              <span>Instalar App</span>
            </button>
          )}

          {/* Botón de Pruebas: Tour Onboarding Full Screen */}
          {onOpenOnboardingTour && (
            <button
              onClick={onOpenOnboardingTour}
              id="tour-onboarding-btn"
              className="navbar-tour-btn"
              style={{
                height: '35px',
                padding: '0 12px',
                borderRadius: '999px',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(15, 118, 110, 0.03) 100%)',
                color: '#0f766e',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.16s ease',
                flexShrink: 0
              }}
              title="Probar vista interactiva Full Screen de Onboarding"
            >
              <Sparkles size={13} color="#0d9488" />
              <span>Tour Onboarding</span>
            </button>
          )}

          {/* User Auth Section */}
          {currentUser ? (() => {
            const effectiveAvatar = isCompanyUser ? (companyProfile?.avatar || currentUser?.avatar) : (userProfile?.avatar || currentUser?.avatar);
            const effectiveName = isCompanyUser ? (companyProfile?.name || companyProfile?.companyName || currentUser?.name || 'Mi Empresa') : (userProfile?.name || currentUser?.name || 'Miembro Venstack');
            const effectiveRole = isCompanyUser ? 'Empresa Verificada' : (userProfile?.role || currentUser?.role || 'Software Engineer');
            const firstLetter = (effectiveName || 'U').charAt(0).toUpperCase();

            return (
              <div className="navbar-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* Admin Panel Button */}
                {(currentUser.isAdmin || currentUser.email === 'adminhub@venstack.com' || currentUser.email === 'adminhub@venstackcom') && onOpenAdminPanel && (
                  <button
                    onClick={onOpenAdminPanel}
                    style={{
                      height: '35px',
                      padding: '0 12px',
                      borderRadius: '999px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.3)',
                      transition: 'all 0.16s ease',
                      flexShrink: 0
                    }}
                    title="Abrir Panel de Administración Venstack"
                  >
                    <Shield size={14} color="#38bdf8" />
                    <span>Panel Admin</span>
                    {pendingApprovalCount > 0 && (
                      <span style={{
                        background: '#ea580c',
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '999px',
                        boxShadow: '0 1px 4px rgba(234, 88, 12, 0.4)'
                      }}>
                        {pendingApprovalCount}
                      </span>
                    )}
                  </button>
                )}

                <div 
                  id="user-profile-badge"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    height: '35px',
                    boxSizing: 'border-box',
                    background: isCompanyUser ? 'rgba(37, 99, 235, 0.08)' : '#f5f5f7', 
                    padding: '0 10px 0 5px', 
                    borderRadius: '999px',
                    border: isCompanyUser ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.16s ease',
                    flexShrink: 0,
                    maxWidth: '160px'
                  }}
                  onClick={onOpenCreateProfile}
                  title={isCompanyUser ? "Ver y editar perfil de mi empresa" : "Ver y editar mi perfil profesional"}
                >
                  {effectiveAvatar ? (
                    <img 
                      src={effectiveAvatar} 
                      alt={effectiveName} 
                      className="navbar-profile-avatar"
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        display: 'block',
                        flexShrink: 0
                      }} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getFallbackAvatar(effectiveName);
                      }}
                    />
                  ) : isCompanyUser ? (
                    <div 
                      className="navbar-profile-avatar"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Building2 size={12.5} />
                    </div>
                  ) : (
                    <div 
                      className="navbar-profile-avatar"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        color: '#64748b',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <User size={13} strokeWidth={2.2} />
                    </div>
                  )}
                  <div className="navbar-profile-text-col" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, justifyContent: 'center', overflow: 'hidden' }}>
                    <span className="navbar-profile-name" style={{ fontSize: '11px', fontWeight: 700, color: '#1d1d1f', maxWidth: '95px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {effectiveName}
                    </span>
                    <span className="navbar-profile-role" style={{ fontSize: '8.5px', color: isCompanyUser ? '#2563eb' : '#0d9488', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {effectiveRole}
                    </span>
                  </div>
                </div>

                <button
                  id="navbar-logout-btn"
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  style={{
                    width: '35px',
                    height: '35px',
                    minWidth: '35px',
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
            <div className="navbar-auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button
                onClick={onOpenLogin}
                className="apple-btn-secondary navbar-login-btn"
                style={{ 
                  height: '35px',
                  padding: '0 14px',
                  fontSize: '12px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
                }}
              >
                <LogIn size={13} />
                <span>Ingresar</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="apple-btn-primary navbar-register-btn"
                style={{ 
                  height: '35px',
                  padding: '0 15px',
                  fontSize: '12px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
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
        @media (max-width: 1280px) {
          #header-search { width: 130px !important; }
          .apple-nav-btn { padding: 5px 9px !important; font-size: 11.5px !important; }
        }
        @media (max-width: 1140px) {
          #install-pwa-btn span { display: none !important; }
          #install-pwa-btn { padding: 0 10px !important; }
          #header-search { width: 115px !important; }
        }
        @media (max-width: 1024px) {
          #publish-btn span { display: none !important; }
          #publish-btn { padding: 0 10px !important; }
          #header-search { display: none !important; }
          .navbar-tour-btn span { display: none !important; }
          .navbar-tour-btn { padding: 0 10px !important; }
        }

        /* Responsive Mobile Header Tweaks */
        @media (max-width: 767px) {
          .apple-header-inner {
            padding: 0 10px !important;
            gap: 6px !important;
          }
          .navbar-brand-logo-img {
            height: 50px !important;
            margin: -6px -6px -6px -4px !important;
          }
          .apple-header-actions {
            gap: 5px !important;
          }
          .navbar-user-actions {
            gap: 4px !important;
          }

          /* Applicants Button: Compact icon + notification badge */
          #applicants-btn {
            height: 33px !important;
            width: 33px !important;
            min-width: 33px !important;
            padding: 0 !important;
            justify-content: center !important;
            position: relative !important;
            border-radius: 50% !important;
          }
          .navbar-applicants-text {
            display: none !important;
          }
          .navbar-applicants-count {
            position: absolute !important;
            top: -3px !important;
            right: -3px !important;
            font-size: 9px !important;
            padding: 1px 4px !important;
            min-width: 14px !important;
            text-align: center !important;
            border: 2px solid #ffffff !important;
            box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3) !important;
          }

          /* User Profile Badge: Slim and single line */
          #user-profile-badge {
            height: 33px !important;
            padding: 0 8px 0 4px !important;
            max-width: 100px !important;
            gap: 5px !important;
          }
          .navbar-profile-role {
            display: none !important;
          }
          .navbar-profile-name {
            max-width: 60px !important;
            font-size: 11px !important;
          }

          /* Logout Button */
          #navbar-logout-btn {
            width: 33px !important;
            height: 33px !important;
            min-width: 33px !important;
          }
        }

        /* Extra compact mobile (phones <= 400px width like iPhone SE, small Androids) */
        @media (max-width: 400px) {
          .apple-header-inner {
            padding: 0 8px !important;
            gap: 4px !important;
          }
          .navbar-brand-logo-img {
            height: 44px !important;
            margin: -4px -4px -4px -2px !important;
          }
          #user-profile-badge {
            padding: 0 4px !important;
            max-width: 33px !important;
            border-radius: 50% !important;
            justify-content: center !important;
          }
          .navbar-profile-text-col {
            display: none !important;
          }
          #applicants-btn {
            width: 32px !important;
            min-width: 32px !important;
            height: 32px !important;
          }
          #navbar-logout-btn {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
          }
        }
      `}</style>
    </header>
  );
};
