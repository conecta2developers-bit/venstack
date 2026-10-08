import React from 'react';
import { Users, Briefcase, Layers, MessageSquare, Plus, Sparkles, Edit3 } from 'lucide-react';

export const MobileTabBar = ({ activeTab, setActiveTab, onOpenCreateProfile, hasProfile = false }) => {
  const tabs = [
    { id: 'developers', label: 'Talento', icon: Users },
    { id: 'jobs', label: 'Empleos', icon: Briefcase, hasBadge: true },
    { id: 'squads', label: 'Squads', icon: Layers },
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

        {/* Elevated "Mi Perfil" Button */}
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
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
            transition: 'all 0.18s ease'
          }}
          title={hasProfile ? "Editar mi Perfil" : "Crear mi Perfil"}
        >
          {hasProfile ? (
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
            {hasProfile ? 'Editar' : 'Mi Perfil'}
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
