import React from 'react';
import { Clock, ArrowRight, Coins, Briefcase, Users } from 'lucide-react';

export const JobCard = ({
  job,
  onSelectJob,
  onSelectCompany,
  isOwnJob = false,
  applicantsCount = 0,
  onViewApplicants
}) => {
  return (
    <div 
      onClick={() => onSelectJob(job)}
      className="apple-dev-card"
    >
      <div>
        {/* Header: Company Avatar & Role */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              onClick={(e) => {
                if (onSelectCompany) {
                  e.stopPropagation();
                  onSelectCompany(job.company);
                }
              }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
                border: '1px solid #ccfbf1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                color: '#0f766e',
                cursor: onSelectCompany ? 'pointer' : 'inherit'
              }}
              title="Ver perfil de la empresa"
            >
              {job.companyLogo}
            </div>

            <div>
              <span 
                onClick={(e) => {
                  if (onSelectCompany) {
                    e.stopPropagation();
                    onSelectCompany(job.company);
                  }
                }}
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: onSelectCompany ? '#2563eb' : '#6e6e73', 
                  display: 'block',
                  cursor: onSelectCompany ? 'pointer' : 'inherit'
                }}
                title="Ver perfil de la empresa"
              >
                {job.company}
              </span>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#1d1d1f',
                letterSpacing: '-0.02em',
                margin: '2px 0 0 0',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {job.title}
              </h3>
            </div>
          </div>

          {job.isBounty ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '999px',
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              fontSize: '11px',
              fontWeight: 700,
              color: '#92400e',
              flexShrink: 0
            }}>
              <Coins size={12} color="#d97706" />
              Micro-Bounty
            </span>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '999px',
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              fontSize: '11px',
              fontWeight: 700,
              color: '#0d9488',
              flexShrink: 0
            }}>
              <Briefcase size={12} />
              {job.type}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p style={{
          fontSize: '12px',
          color: '#6e6e73',
          lineHeight: 1.5,
          margin: '10px 0 0 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description}
        </p>

        {/* Salary Pill Bar */}
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: '#fbfbfd',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b', fontWeight: 700, display: 'block' }}>
              {job.isBounty ? 'Recompensa Fija' : 'Compensación Mensual'}
            </span>
            <span className="apple-salary-badge" style={{ marginTop: '2px' }}>
              {job.salary}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '9.5px', color: '#86868b', display: 'block' }}>Cobro directo</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#424245' }}>
              {job.paymentMethods[0]} • {job.paymentMethods[1] || 'Zinli'}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {job.juniorFriendly && (
            <span style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              🌱 Junior Friendly
            </span>
          )}
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="apple-skill-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '14px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: '#86868b'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          {job.postedAt}
        </span>

        {isOwnJob ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onViewApplicants) {
                onViewApplicants(job);
              } else {
                onSelectJob(job);
              }
            }}
            style={{
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#2563eb',
              background: 'rgba(37, 99, 235, 0.08)',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
            title="Ver postulantes a esta vacante"
          >
            <Users size={12} />
            <span>Postulantes ({applicantsCount})</span>
          </button>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectJob(job);
            }}
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#0d9488',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>Postularme</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
