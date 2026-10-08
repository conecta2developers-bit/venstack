import React from 'react';
import { ShieldCheck, Zap, Wifi, ExternalLink, Star } from 'lucide-react';

export const DeveloperCard = ({ dev, onSelectDev }) => {
  return (
    <div 
      onClick={() => onSelectDev(dev)}
      className="apple-dev-card"
    >
      <div style={{ width: '100%', minWidth: 0 }}>
        {/* Header: Avatar, Name, Verification, Karma */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={dev.avatar}
                alt={dev.name}
                className="apple-dev-avatar"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dev.name || 'Dev')}`;
                }}
              />
              {dev.available && (
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#16a34a',
                    borderRadius: '50%',
                    border: '2px solid #ffffff'
                  }}
                  title="Disponible de inmediato"
                />
              )}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                <h3 style={{
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: '#1d1d1f',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {dev.name}
                </h3>
                {dev.verified && (
                  <ShieldCheck size={14} color="#0d9488" fill="#f0fdfa" style={{ flexShrink: 0 }} />
                )}
              </div>
              <p style={{
                fontSize: '11.5px',
                color: '#6e6e73',
                margin: '1px 0 0 0',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {dev.city} • <strong style={{ color: '#1d1d1f' }}>{dev.level}</strong>
              </p>
            </div>
          </div>

          {/* Karma Score (Always protected with flexShrink: 0) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '3px 7px',
            background: 'rgba(0, 0, 0, 0.04)',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#515154',
            flexShrink: 0
          }}>
            <Star size={11} color="#f59e0b" fill="#f59e0b" />
            <span>{dev.karma}</span>
          </div>
        </div>

        {/* Role & Bio */}
        <div style={{ marginTop: '10px', minWidth: 0 }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#1d1d1f',
            margin: '0 0 3px 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {dev.role}
          </h4>
          <p style={{
            fontSize: '11.5px',
            color: '#6e6e73',
            lineHeight: 1.45,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}>
            {dev.bio}
          </p>
        </div>

        {/* Hardware & Setup Spec Pill (Fixed overflow with minWidth: 0) */}
        <div className="apple-spec-pill">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <Zap size={13} color="#0d9488" style={{ flexShrink: 0 }} />
            <span style={{ color: '#0f766e', fontWeight: 600, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {dev.setup?.power || 'Setup Eléctrico Verificado'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#0d9488', fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>
            <Wifi size={11} />
            <span>Fibra</span>
          </div>
        </div>

        {/* Skills Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px', minWidth: 0, overflow: 'hidden' }}>
          {dev.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="apple-skill-pill">
              {skill}
            </span>
          ))}
          {dev.skills.length > 3 && (
            <span style={{ fontSize: '10.5px', color: '#86868b', alignSelf: 'center', padding: '0 2px' }}>
              +{dev.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Rate & Action Button */}
      <div style={{
        marginTop: '14px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        width: '100%',
        minWidth: 0
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
            Tarifas (Mes / Hora)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
            <span className="apple-salary-badge" style={{ fontSize: '10.5px' }} title="Tarifa Mensual">
              {dev.rate}
            </span>
            {dev.hourlyRate && (
              <span style={{
                fontSize: '10.5px',
                fontWeight: 650,
                color: '#0d9488',
                background: '#f0fdfa',
                border: '1px solid #ccfbf1',
                padding: '2px 7px',
                borderRadius: '999px',
                whiteSpace: 'nowrap'
              }} title="Tarifa por Hora">
                {dev.hourlyRate}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelectDev(dev);
          }}
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1d1d1f',
            background: 'rgba(0, 0, 0, 0.05)',
            padding: '5px 10px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <span>Ficha Técnica</span>
          <ExternalLink size={11} color="#6e6e73" />
        </button>
      </div>
    </div>
  );
};
