import React from 'react';
import { Users, Calendar, ArrowRight, Layers } from 'lucide-react';

export const SquadCard = ({ squad, onJoinSquad }) => {
  return (
    <div className="apple-dev-card">
      <div>
        {/* Category & Members Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#0f766e',
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '999px',
            padding: '2px 8px'
          }}>
            {squad.category}
          </span>
          <span style={{ fontSize: '11.5px', color: '#6e6e73', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Users size={12} color="#86868b" />
            <span>{squad.currentMembers} de {squad.totalSlots} plazas</span>
          </span>
        </div>

        {/* Squad Title */}
        <div style={{ marginTop: '12px' }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1d1d1f',
            letterSpacing: '-0.02em',
            margin: '0 0 4px 0'
          }}>
            {squad.name}
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#6e6e73',
            lineHeight: 1.5,
            margin: 0
          }}>
            {squad.tagline}
          </p>
        </div>

        {/* Mentor Leader */}
        <div style={{
          marginTop: '12px',
          padding: '8px 10px',
          background: '#f5f5f7',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px'
        }}>
          <span style={{ color: '#86868b' }}>Mentor:</span>
          <strong style={{ color: '#1d1d1f' }}>{squad.leader}</strong>
        </div>

        {/* Open Slots */}
        <div style={{ marginTop: '12px' }}>
          <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            Buscamos para este Sprint:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {squad.lookingFor.map((role, idx) => (
              <div key={idx} style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#0f766e',
                background: '#f0fdfa',
                border: '1px solid rgba(13,148,136,0.15)',
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0d9488' }} />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '12px' }}>
          {squad.tags.map((tag, idx) => (
            <span key={idx} className="apple-skill-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: '#86868b'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={12} />
          {squad.sprintDuration}
        </span>

        <button
          onClick={() => onJoinSquad(squad)}
          className="apple-btn-primary"
          style={{ padding: '5px 12px', fontSize: '11.5px' }}
        >
          <span>Unirme</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};
