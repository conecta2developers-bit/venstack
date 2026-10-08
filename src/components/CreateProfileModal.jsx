import React, { useState, useRef } from 'react';
import { X, CheckCircle, Zap, AlertCircle, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { saveDeveloperToFirestore } from '../firebase';

export const CreateProfileModal = ({ onClose, onSaveProfile, currentUser }) => {
  const fileInputRef = useRef(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    role: currentUser?.role || 'Frontend Developer',
    category: 'software',
    level: 'Junior',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    city: 'Caracas, VE',
    bio: '',
    rate: '$1,000 - $1,500 / mes',
    hourlyRate: '$15 - $22 / hora',
    powerSetup: 'Inversor 2.4kVA con batería LiFePO4',
    internetSetup: 'Fibra Óptica 400 Mbps Simétrica',
    backupMobile: 'Línea 4G LTE Digitel / Movistar',
    skills: 'React, TypeScript, Tailwind CSS, Git',
    projectTitle: 'Mi Aplicación Web',
    projectDesc: 'Plataforma para comercio local con pasarela de pagos integrada.',
    projectDemo: 'https://mi-proyecto.vercel.app',
    projectGithub: 'https://github.com/miusuario/proyecto',
    payments: ['Binance (USDT)', 'Zinli', 'Pago Móvil'],
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, avatar: compressedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const devId = currentUser?.uid ? `dev-${currentUser.uid}` : `dev-${Date.now()}`;
    const newDev = {
      id: devId,
      userId: currentUser?.uid || null,
      name: formData.name || currentUser?.name || 'Desarrollador Criollo',
      role: formData.role || 'Frontend Developer',
      category: formData.category || 'software',
      level: formData.level,
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
      city: formData.city || 'Caracas, VE',
      verified: true,
      available: true,
      availabilityText: 'Disponible de inmediato',
      rate: formData.rate,
      hourlyRate: formData.hourlyRate,
      bio: formData.bio || 'Desarrollador enfocado en crear interfaces limpias y código mantenible.',
      setup: {
        power: formData.powerSetup,
        internet: formData.internetSetup,
        backupInternet: formData.backupMobile,
        tested: true,
      },
      payments: formData.payments,
      skills: skillsArray.length > 0 ? skillsArray : ['React', 'TypeScript', 'Node.js'],
      featuredProject: {
        title: formData.projectTitle,
        description: formData.projectDesc,
        demoUrl: formData.projectDemo,
        githubUrl: formData.projectGithub,
        stars: 10,
      },
      endorsements: 1,
      karma: 120,
      githubUser: currentUser?.email ? currentUser.email.split('@')[0] : 'nuevodev',
      createdAt: Date.now()
    };

    try {
      await saveDeveloperToFirestore(newDev);
    } catch (err) {
      console.warn("Aviso Firestore al guardar (se guardará también localmente):", err);
    }

    onSaveProfile(newDev);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1400);
    setLoading(false);
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
              Crear Perfil Profesional
            </h2>
            <p style={{ fontSize: '11px', color: '#86868b', margin: '2px 0 0 0' }}>
              Ficha técnica visible en el directorio Venstack
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
                ¡Perfil Publicado con Éxito!
              </h3>
              <p style={{ fontSize: '12px', color: '#6e6e73', marginTop: '6px' }}>
                Tu ficha técnica ya está disponible con insignia auditada.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              
              {/* Información Personal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  1. Perfil Profesional
                </span>

                {/* Foto de Perfil & Avatar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '16px',
                  marginTop: '2px',
                  marginBottom: '6px'
                }}>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'relative',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      border: '2.5px solid #ffffff'
                    }}
                    title="Haz clic para subir o cambiar tu foto"
                  >
                    <img 
                      src={formData.avatar} 
                      alt="Vista previa foto de perfil" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.38)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.95
                    }}>
                      <Camera size={18} color="#ffffff" />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.15)',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#1d1d1f',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Upload size={12} />
                        <span>Subir Foto</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11px',
                          color: '#0d9488',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        {showUrlInput ? 'Cerrar enlace' : 'O usar URL'}
                      </button>
                    </div>

                    <p style={{ margin: 0, fontSize: '10.5px', color: '#64748b' }}>
                      Foto visible en tu tarjeta y directorio. Admite JPG/PNG.
                    </p>

                    {showUrlInput && (
                      <input 
                        type="url"
                        placeholder="https://ejemplo.com/tu-foto.jpg"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        style={{
                          marginTop: '6px',
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(0,0,0,0.12)',
                          fontSize: '11px'
                        }}
                      />
                    )}

                    <input 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Disciplina Principal */}
                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '4px' }}>
                    Área o Disciplina Tech
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'software', label: '💻 Software & Código' },
                      { id: 'uiux', label: '🎨 UI/UX & Producto' },
                      { id: 'ai', label: '🤖 Inteligencia Artificial' },
                      { id: 'security', label: '🛡️ Ciberseguridad' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: formData.category === cat.id ? '1.5px solid #0d9488' : '1px solid rgba(0,0,0,0.12)',
                          background: formData.category === cat.id ? '#f0fdfa' : '#ffffff',
                          color: formData.category === cat.id ? '#0f766e' : '#4b5563',
                          fontWeight: formData.category === cat.id ? 700 : 500,
                          fontSize: '11px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Luis Ramírez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Rol Técnico
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Frontend Engineer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Seniority
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    >
                      <option value="Junior">Junior (Primer Empleo)</option>
                      <option value="Mid">Mid-Level (1-3 años)</option>
                      <option value="Senior">Senior (+4 años)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Ciudad en Venezuela
                    </label>
                    <input
                      type="text"
                      placeholder="Caracas / Valencia"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                    Bio Resumen
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Enfocado en crear aplicaciones modernas con React y TypeScript..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px', resize: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                    Stack (separado por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Hardware Setup Resiliente */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0d9488', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={13} color="#0d9488" />
                  2. Setup Resiliente
                </span>

                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                    Respaldo Eléctrico (UPS, Inversor, Planta)
                  </label>
                  <input
                    type="text"
                    value={formData.powerSetup}
                    onChange={(e) => setFormData({ ...formData, powerSetup: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Conexión de Fibra
                    </label>
                    <input
                      type="text"
                      value={formData.internetSetup}
                      onChange={(e) => setFormData({ ...formData, internetSetup: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Respaldo Móvil LTE
                    </label>
                    <input
                      type="text"
                      value={formData.backupMobile}
                      onChange={(e) => setFormData({ ...formData, backupMobile: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Proof of Work */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  3. Proof of Work & Tarifa
                </span>

                <div>
                  <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                    Nombre del Proyecto Real (Proof of Work)
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Tarifa Mensual ($/mes)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. $1,000 - $1,500 / mes"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      Tarifa por Hora ($/hora)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. $15 - $22 / hora"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      URL Live Demo
                    </label>
                    <input
                      type="url"
                      value={formData.projectDemo}
                      onChange={(e) => setFormData({ ...formData, projectDemo: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#424245', display: 'block', marginBottom: '3px' }}>
                      URL Repositorio GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.projectGithub}
                      onChange={(e) => setFormData({ ...formData, projectGithub: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="apple-btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginTop: '8px',
                  opacity: loading ? 0.75 : 1
                }}
              >
                {loading ? 'Guardando en Firebase...' : 'Publicar Perfil Verificado'}
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
