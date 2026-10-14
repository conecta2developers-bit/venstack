import React from 'react';
import { Users, Briefcase, Layers, MessageSquare, Plus, Edit3, Building2, UserCheck, Send, Shield } from 'lucide-react';

export const MobileTabBar = ({
  activeTab,
  setActiveTab,
  onOpenCreateProfile,
  hasProfile = false,
  isCompanyUser = false,
  currentUser = null,
  onOpenApplicants,
  applicantsCount = 0,
  onOpenMyApplications = null,
  myApplicationsCount = 0,
  onOpenAdminPanel = null,
  pendingApprovalCount = 0
}) => {
  const tabs = [
    { id: 'developers', label: 'Talento', icon: Users },
    { id: 'jobs', label: 'Empleos', icon: Briefcase, hasBadge: true },
    { id: 'community', label: 'Comunidad', icon: MessageSquare },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '12px',
      left: '12px',
      right: '12px',
      zIndex: 50,
      display: 'none'
    }} id="mobile-floating-dock-container">
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'saturate(180%) blur(28px)',
        WebkitBackdropFilter: 'saturate(180%) blur(28px)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '26px',
        padding: '5px 8px',
        boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '6px 2px',
                borderRadius: '18px',
                border: 'none',
                background: isActive ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                color: isActive ? '#0d9488' : '#71717a',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? '#0d9488' : '#86868b'}
                />
                {tab.hasBadge && (
                  <span style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-3px',
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff'
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                marginTop: '2px',
                letterSpacing: '-0.01em',
                lineHeight: 1
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Dedicated "Postulantes" Button for Company / Recruiter */}
        {isCompanyUser && onOpenApplicants && (
          <button
            onClick={onOpenApplicants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 4px',
              borderRadius: '18px',
              border: 'none',
              background: 'rgba(37, 99, 235, 0.08)',
              color: '#2563eb',
              cursor: 'pointer',
              position: 'relative',
              flex: 1,
              transition: 'all 0.18s ease'
            }}
            title="Ver Postulantes de mis vacantes"
          >
            <div style={{ position: 'relative' }}>
              <UserCheck size={18} strokeWidth={2.4} color="#2563eb" />
              {applicantsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-7px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 800,
                  borderRadius: '10px',
                  padding: '1px 4px',
                  minWidth: '13px',
                  textAlign: 'center',
                  lineHeight: '1'
                }}>
                  {applicantsCount}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#2563eb',
              marginTop: '2px',
              letterSpacing: '-0.01em',
              lineHeight: 1
            }}>
              Postulados
            </span>
          </button>
        )}

        {/* Dedicated "Mis Postulaciones" Button for Candidate / Developer */}
        {currentUser && !isCompanyUser && onOpenMyApplications && (
          <button
            onClick={onOpenMyApplications}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 4px',
              borderRadius: '18px',
              border: 'none',
              background: 'rgba(13, 148, 136, 0.08)',
              color: '#0d9488',
              cursor: 'pointer',
              position: 'relative',
              flex: 1,
              transition: 'all 0.18s ease'
            }}
            title="Ver el estado de mis postulaciones"
          >
            <div style={{ position: 'relative' }}>
              <Send size={17} strokeWidth={2.4} color="#0d9488" />
              {myApplicationsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-7px',
                  background: '#0d9488',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 800,
                  borderRadius: '10px',
                  padding: '1px 4px',
                  minWidth: '13px',
                  textAlign: 'center',
                  lineHeight: '1'
                }}>
                  {myApplicationsCount}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#0d9488',
              marginTop: '2px',
              letterSpacing: '-0.01em',
              lineHeight: 1
            }}>
              Postulaciones
            </span>
          </button>
        )}

        {/* Admin Moderation Button on Mobile */}
        {(currentUser?.isAdmin || currentUser?.email === 'adminhub@venstack.com' || currentUser?.email === 'adminhub@venstackcom') && onOpenAdminPanel && (
          <button
            onClick={onOpenAdminPanel}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px 8px',
              borderRadius: '18px',
              border: 'none',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#38bdf8',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Panel de Administración"
          >
            <Shield size={18} strokeWidth={2.4} color="#38bdf8" />
            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              color: '#ffffff',
              marginTop: '2px',
              lineHeight: 1
            }}>
              Admin
            </span>
            {pendingApprovalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ea580c',
                borderRadius: '50%',
                border: '1.5px solid #ffffff'
              }} />
            )}
          </button>
        )}

        {/* Elevated "Mi Perfil" / "Mi Empresa" Button */}
        <button
          onClick={onOpenCreateProfile}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 10px',
            borderRadius: '18px',
            border: 'none',
            background: isCompanyUser
              ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: isCompanyUser
              ? '0 2px 8px rgba(37, 99, 235, 0.3)'
              : '0 2px 8px rgba(13, 148, 136, 0.3)',
            transition: 'all 0.18s ease'
          }}
          title={isCompanyUser ? "Gestionar Perfil de Empresa" : hasProfile ? "Editar mi Perfil" : "Crear mi Perfil"}
        >
          {isCompanyUser ? (
            <Building2 size={16} strokeWidth={2.4} color="#ffffff" />
          ) : hasProfile ? (
            <Edit3 size={16} strokeWidth={2.4} color="#ffffff" />
          ) : (
            <Plus size={16} strokeWidth={2.6} color="#ffffff" />
          )}
          <span style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#ffffff',
            marginTop: '2px',
            lineHeight: 1
          }}>
            {isCompanyUser ? 'Empresa' : hasProfile ? 'Editar' : 'Mi Perfil'}
          </span>
        </button>
      </nav>

      <style>{`
        @media (max-width: 767px) {
          #mobile-floating-dock-container {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
