import React, { useState } from 'react';
import { X, CheckCircle, Coins, Briefcase } from 'lucide-react';
import { saveJobToFirestore } from '../firebase';

export const PublishJobModal = ({ onClose, onSaveJob }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Tiempo Completo',
    isBounty: false,
    juniorFriendly: true,
    salary: '$1,200 - $1,700 / mes',
    paymentMethods: 'Binance USDT, Zinli, Deel',
    tags: 'React, TypeScript, Next.js',
    description: '',
    location: 'Remoto LatAm',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const methodsArray = formData.paymentMethods
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const newJob = {
      id: `job-${Date.now()}`,
      title: formData.title || 'Desarrollador Web',
      company: formData.company || 'Tech Startup',
      companyLogo: (formData.company || 'TS').substring(0, 2).toUpperCase(),
      type: formData.isBounty ? 'Micro-Bounty ($)' : formData.type,
      juniorFriendly: formData.juniorFriendly,
      isBounty: formData.isBounty,
      salary: formData.salary,
      paymentMethods: methodsArray,
      tags: tagsArray,
      location: formData.location,
      postedAt: 'Justo ahora',
      description: formData.description,
      verifiedHiring: true,
    };

    try {
      await saveJobToFirestore(newJob);
    } catch (err) {
      console.warn("Aviso Firestore jobs:", err);
    }

    onSaveJob(newJob);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div className="apple-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* iOS Handle */}
        <div className="apple-bottom-handle" style={{ display: 'none' }} id="modal-handle" />

        {/* Header */}
        <div className="apple-modal-header">
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
              Publicar Oportunidad
            </h2>
            <p style={{ fontSize: '11px', color: '#86868b', margin: '2px 0 0 0' }}>
              Transparencia salarial para la comunidad dev
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', display: 'flex' }}
          >
            <X size={14} color="#1d1d1f" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="apple-modal-body">
          {submitted ? (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <CheckCircle size={40} color="#0d9488" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1d1d1f', margin: 0 }}>
                ¡Oportunidad Publicada!
              </h3>
              <p style={{ fontSize: '12px', color: '#6e6e73', marginTop: '6px' }}>
                Ya está visible en la sección de Empleos & Bounties.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              
              {/* Selector Empleo vs Bounty */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '4px', background: '#f5f5f7', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isBounty: false })}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: !formData.isBounty ? '#ffffff' : 'transparent',
                    color: !formData.isBounty ? '#1d1d1f' : '#86868b',
                    boxShadow: !formData.isBounty ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Briefcase size={13} />
                  <span>Empleo Fijo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isBounty: true })}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: formData.isBounty ? '#ffffff' : 'transparent',
                    color: formData.isBounty ? '#92400e' : '#86868b',
                    boxShadow: formData.isBounty ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Coins size={13} color="#d97706" />
                  <span>Micro-Bounty ($)</span>
                </button>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                  Título del Puesto o Tarea
                </label>
                <input
                  type="text"
                  required
                  placeholder={formData.isBounty ? "Ej. Arreglar bug de WebSockets en React" : "Ej. Senior Backend Developer"}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                    Empresa / Contratante
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Startup Remota"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                    Salario Transparente
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={formData.isBounty ? "Ej. $90 USDT (Inmediato)" : "Ej. $1,400 - $1,800 / mes"}
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px', fontWeight: 700, color: '#78350f', background: '#fffbeb' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                  Formas de pago aceptadas
                </label>
                <input
                  type="text"
                  value={formData.paymentMethods}
                  onChange={(e) => setFormData({ ...formData, paymentMethods: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                  Stack Requerido
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                  Descripción
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detalles de la posición y entregables esperados..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px', resize: 'none' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.juniorFriendly}
                  onChange={(e) => setFormData({ ...formData, juniorFriendly: e.target.checked })}
                  style={{ accentColor: '#0d9488' }}
                />
                <span style={{ fontWeight: 600, color: '#166534' }}>
                  🌱 Acepta candidatos Junior o recién egresados de bootcamp
                </span>
              </label>

              <button
                type="submit"
                className="apple-btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginTop: '6px'
                }}
              >
                Publicar Oportunidad
              </button>
            </form>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 639px) {
          #modal-handle { display: block !important; }
        }
      `}</style>
    </div>
  );
};
