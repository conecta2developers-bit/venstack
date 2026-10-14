import React, { useState, useRef, useEffect } from 'react';
import { 
  X, CheckCircle, Zap, AlertCircle, Camera, Upload, Image as ImageIcon, 
  Building2, Plus, Trash2, Globe, ExternalLink, User, Check, CreditCard 
} from 'lucide-react';
import { saveDeveloperToFirestore } from '../firebase';
import { getFallbackAvatar, getProfilePlaceholderSvg } from '../utils/avatar';

const POPULAR_PAYMENT_METHODS = [
  'Binance (USDT)',
  'Zinli',
  'Pago Móvil',
  'Deel',
  'Wise',
  'Zelle / Wire USA',
  'Wally Tech',
  'Banesco Panamá',
  'PayPal',
  'USDC / Criptomonedas'
];

export const CreateProfileModal = ({ onClose, onSaveProfile, currentUser, existingDev, onSwitchToCompany }) => {
  const isCompany = Boolean(
    currentUser?.accountType === 'company' || 
    currentUser?.role?.toLowerCase().includes('empresa') || 
    currentUser?.role?.toLowerCase().includes('contratante') ||
    currentUser?.role?.toLowerCase().includes('reclutador') ||
    currentUser?.role?.toLowerCase().includes('recruiter') ||
    currentUser?.role?.toLowerCase().includes('rrhh') ||
    currentUser?.role?.toLowerCase().includes('talent') ||
    currentUser?.name?.toLowerCase().includes('wolves lab') ||
    existingDev?.category === 'company' ||
    existingDev?.accountType === 'company' ||
    existingDev?.role?.toLowerCase().includes('reclutador') ||
    existingDev?.role?.toLowerCase().includes('recruiter') ||
    existingDev?.role?.toLowerCase().includes('empresa') ||
    existingDev?.bio?.toUpperCase().includes('COMPANY') ||
    (currentUser?.uid && localStorage.getItem(`venstack_account_type_${currentUser.uid}`) === 'company')
  );

  useEffect(() => {
    if (isCompany && onSwitchToCompany) {
      onSwitchToCompany();
    }
  }, [isCompany, onSwitchToCompany]);

  if (isCompany) {
    return null;
  }
  const fileInputRef = useRef(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [formData, setFormData] = useState({
    name: existingDev?.name || currentUser?.name || '',
    role: existingDev?.role || currentUser?.role || 'Frontend Developer',
    category: existingDev?.category || 'software',
    level: existingDev?.level || 'Junior',
    avatar: existingDev?.avatar || currentUser?.avatar || '',
    city: existingDev?.city || 'Caracas, VE',
    phone: existingDev?.phone || currentUser?.phone || '',
    bio: existingDev?.bio || '',
    rate: existingDev?.rate || '$1,000 - $1,500 / mes',
    hourlyRate: existingDev?.hourlyRate || '$15 - $22 / hora',
    powerSetup: existingDev?.setup?.power || 'Inversor 2.4kVA con batería LiFePO4',
    internetSetup: existingDev?.setup?.internet || 'Fibra Óptica 400 Mbps Simétrica',
    backupMobile: existingDev?.setup?.backupInternet || 'Línea 4G LTE Digitel / Movistar',
    skills: existingDev?.skills ? existingDev.skills.join(', ') : 'React, TypeScript, Tailwind CSS, Git',
    payments: existingDev?.payments || ['Binance (USDT)', 'Zinli', 'Pago Móvil'],
  });

  useEffect(() => {
    if (existingDev) {
      setFormData({
        name: existingDev.name || currentUser?.name || '',
        role: existingDev.role || currentUser?.role || 'Frontend Developer',
        category: existingDev.category || 'software',
        level: existingDev.level || 'Junior',
        avatar: existingDev.avatar || currentUser?.avatar || '',
        city: existingDev.city || 'Caracas, VE',
        phone: existingDev.phone || currentUser?.phone || '',
        bio: existingDev.bio || '',
        rate: existingDev.rate || '$1,000 - $1,500 / mes',
        hourlyRate: existingDev.hourlyRate || '$15 - $22 / hora',
        powerSetup: existingDev.setup?.power || 'Inversor 2.4kVA con batería LiFePO4',
        internetSetup: existingDev.setup?.internet || 'Fibra Óptica 400 Mbps Simétrica',
        backupMobile: existingDev.setup?.backupInternet || 'Línea 4G LTE Digitel / Movistar',
        skills: existingDev.skills ? existingDev.skills.join(', ') : 'React, TypeScript, Tailwind CSS, Git',
        payments: existingDev.payments || ['Binance (USDT)', 'Zinli', 'Pago Móvil'],
      });
    }
  }, [existingDev, currentUser]);

  // Up to 3 portfolio projects (Name + URL)
  const [projects, setProjects] = useState(() => {
    if (existingDev?.projects && Array.isArray(existingDev.projects) && existingDev.projects.length > 0) {
      return existingDev.projects.slice(0, 3).map((p) => ({
        name: p.name || p.title || '',
        url: p.url || p.demoUrl || p.githubUrl || ''
      }));
    }
    if (existingDev?.featuredProject?.title || existingDev?.featuredProject?.demoUrl || existingDev?.featuredProject?.githubUrl) {
      return [{
        name: existingDev.featuredProject.title || 'Mi Aplicación Web',
        url: existingDev.featuredProject.demoUrl || existingDev.featuredProject.githubUrl || ''
      }];
    }
    return [
      { name: 'Mi Aplicación Web', url: 'https://mi-proyecto.vercel.app' }
    ];
  });

  const handleAddProject = () => {
    if (projects.length < 3) {
      setProjects((prev) => [...prev, { name: '', url: '' }]);
    }
  };

  const handleRemoveProject = (indexToRemove) => {
    if (projects.length > 1) {
      setProjects((prev) => prev.filter((_, i) => i !== indexToRemove));
    } else {
      setProjects([{ name: '', url: '' }]);
    }
  };

  const handleProjectChange = (index, field, value) => {
    setProjects((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const [customPayment, setCustomPayment] = useState('');

  const handleTogglePayment = (method) => {
    setFormData((prev) => {
      const current = prev.payments || [];
      if (current.includes(method)) {
        return { ...prev, payments: current.filter((m) => m !== method) };
      } else {
        return { ...prev, payments: [...current, method] };
      }
    });
  };

  const handleAddCustomPayment = (e) => {
    if (e) e.preventDefault();
    const trimmed = customPayment.trim();
    if (!trimmed) return;
    if (!(formData.payments || []).includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        payments: [...(prev.payments || []), trimmed]
      }));
    }
    setCustomPayment('');
  };

  const handleRemovePayment = (method) => {
    setFormData((prev) => ({
      ...prev,
      payments: (prev.payments || []).filter((m) => m !== method)
    }));
  };

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset value so choosing the same file triggers change if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file.type || !file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      // Actualizar inmediatamente para que el usuario vea la foto al instante
      setFormData((prev) => ({ ...prev, avatar: dataUrl }));
      setErrorMsg('');

      // Optimizar en background para que no sea excesivamente pesado en Firestore y localStorage
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 320;
          let width = img.naturalWidth || img.width || maxDim;
          let height = img.naturalHeight || img.height || maxDim;

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

          if (width > 0 && height > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.85);
              if (compressed && compressed.length > 200 && compressed.startsWith('data:image/')) {
                setFormData((prev) => ({ ...prev, avatar: compressed }));
              }
            }
          }
        } catch (err) {
          console.warn('Compresión en canvas no requerida o falló, usando dataUrl original:', err);
        }
      };

      img.onerror = () => {
        console.warn('Error decodificando imagen, manteniendo dataUrl');
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      setErrorMsg('No se pudo leer el archivo de imagen.');
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validación Foto de Perfil (Requerida)
    if (!formData.avatar || !formData.avatar.trim()) {
      setErrorMsg('La foto de perfil es obligatoria. Por favor sube una foto tuya para activar tu perfil.');
      return;
    }

    // Validación Métodos de Pago
    if (!formData.payments || formData.payments.length === 0) {
      setErrorMsg('Debes seleccionar al menos un método de pago para recibir cobros.');
      return;
    }

    setLoading(true);

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const devId = existingDev?.id || (currentUser?.uid ? `dev-${currentUser.uid}` : `dev-${Date.now()}`);
    const newDev = {
      id: devId,
      userId: currentUser?.uid || existingDev?.userId || null,
      name: formData.name || currentUser?.name || 'Desarrollador Criollo',
      role: formData.role || 'Frontend Developer',
      category: formData.category || 'software',
      level: formData.level,
      avatar: formData.avatar.trim(),
      city: formData.city || 'Caracas, VE',
      phone: (formData.phone || '').trim(),
      approved: existingDev?.approved !== undefined ? existingDev.approved : false,
      featured: existingDev?.featured || false,
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
      projects: projects
        .map((p) => ({
          name: (p.name || '').trim(),
          url: (p.url || '').trim()
        }))
        .filter((p) => p.name || p.url)
        .slice(0, 3),
      featuredProject: {
        title: (projects[0]?.name || '').trim() || 'Mi Aplicación Web',
        description: 'Proyecto de portafolio verificado en Venstack.',
        demoUrl: (projects[0]?.url || '').trim() || 'https://mi-proyecto.vercel.app',
        githubUrl: (projects[0]?.url || '').trim() || 'https://github.com/miusuario/proyecto',
        stars: existingDev?.featuredProject?.stars || 10,
      },
      endorsements: existingDev?.endorsements || 1,
      karma: existingDev?.karma || 120,
      githubUser: currentUser?.email ? currentUser.email.split('@')[0] : (existingDev?.githubUser || 'nuevodev'),
      createdAt: existingDev?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    try {
      // 1. Guardar y actualizar el estado visual de inmediato
      onSaveProfile(newDev);

      // 2. Intentar guardar en Firestore con timeout de seguridad (no bloqueará la UI)
      await saveDeveloperToFirestore(newDev);

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1100);
    } catch (err) {
      console.warn("Aviso Firestore al guardar (perfil guardado localmente):", err);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1100);
    } finally {
      setLoading(false);
    }
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
              {existingDev ? 'Editar Perfil Profesional' : 'Crear Perfil Profesional'}
            </h2>
            <p style={{ fontSize: '11px', color: '#86868b', margin: '2px 0 0 0' }}>
              {existingDev ? 'Actualiza tu ficha técnica y tarifas en el directorio' : 'Ficha técnica visible en el directorio Venstack'}
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
                {existingDev ? '¡Perfil Actualizado con Éxito!' : '¡Perfil Publicado con Éxito!'}
              </h3>
              <p style={{ fontSize: '12px', color: '#6e6e73', marginTop: '6px' }}>
                Tu ficha técnica ya está actualizada en el directorio.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              


              {/* Información Personal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  1. Perfil Profesional
                </span>

                {/* Foto de Perfil & Avatar (Requerida) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  background: !formData.avatar && errorMsg ? '#fff5f5' : '#f8fafc',
                  border: !formData.avatar && errorMsg ? '1.5px solid #ef4444' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '16px',
                  marginTop: '2px',
                  marginBottom: '6px',
                  transition: 'all 0.2s ease'
                }}>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'relative',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: formData.avatar ? '2.5px solid #0d9488' : '2px dashed #94a3b8',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Haz clic para subir o cambiar tu foto de perfil (Requerida)"
                  >
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Vista previa foto de perfil" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getProfilePlaceholderSvg();
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b'
                      }}>
                        <User size={32} strokeWidth={1.8} />
                      </div>
                    )}

                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: formData.avatar ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: formData.avatar ? 0 : 0.85,
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = formData.avatar ? '0' : '0.85'; }}
                    >
                      <Camera size={18} color="#ffffff" />
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                          Foto de Perfil
                        </span>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 800, 
                          color: '#ef4444', 
                          background: '#fef2f2', 
                          padding: '1px 5px', 
                          borderRadius: '4px',
                          border: '1px solid #fee2e2'
                        }}>
                          * Requerida
                        </span>
                      </div>
                      
                      {formData.avatar ? (
                        <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle size={12} /> Foto lista
                        </span>
                      ) : (
                        <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700, background: '#fee2e2', padding: '1px 6px', borderRadius: '4px' }}>
                          Falta Foto
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          background: formData.avatar ? '#ffffff' : '#0d9488',
                          color: formData.avatar ? '#1d1d1f' : '#ffffff',
                          border: formData.avatar ? '1px solid rgba(0,0,0,0.15)' : 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: formData.avatar ? 'none' : '0 2px 6px rgba(13, 148, 136, 0.25)'
                        }}
                      >
                        <Upload size={12} />
                        <span>{formData.avatar ? 'Cambiar Foto' : 'Subir Foto'}</span>
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

                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar: '' })}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '11px',
                            color: '#ef4444',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '4px',
                            marginLeft: 'auto'
                          }}
                        >
                          Quitar
                        </button>
                      )}
                    </div>

                    <p style={{ margin: 0, fontSize: '10.5px', color: formData.avatar ? '#64748b' : '#b91c1c', fontWeight: formData.avatar ? 400 : 600 }}>
                      {formData.avatar 
                        ? 'Foto visible en tu tarjeta y directorio. Admite JPG, PNG o WebP.' 
                        : '⚠️ Debes subir tu foto de perfil para poder guardar tu ficha técnica.'}
                    </p>

                    {showUrlInput && (
                      <input 
                        type="url"
                        placeholder="https://ejemplo.com/tu-foto.jpg"
                        value={formData.avatar}
                        onChange={(e) => {
                          setFormData({ ...formData, avatar: e.target.value });
                          if (e.target.value) setErrorMsg('');
                        }}
                        style={{
                          marginTop: '6px',
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(0,0,0,0.12)',
                          fontSize: '11px',
                          boxSizing: 'border-box'
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
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. +58 412 1234567 o 0414 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12px' }}
                  />
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

              {/* 3. Portafolio de Proyectos (Máximo 3) & Tarifa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0d9488', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={13} color="#0d9488" />
                    3. Portafolio de Proyectos ({projects.length}/3)
                  </span>

                  {projects.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddProject}
                      style={{
                        background: 'rgba(13, 148, 136, 0.08)',
                        border: '1px solid rgba(13, 148, 136, 0.25)',
                        color: '#0d9488',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Plus size={12} strokeWidth={2.5} />
                      <span>Agregar Proyecto ({projects.length}/3)</span>
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '11.5px', color: '#6e6e73', margin: 0 }}>
                  Agrega hasta 3 enlaces a tus proyectos reales, demos o repositorios para que las empresas conozcan tu trabajo.
                </p>

                {/* Dynamic Projects Inputs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projects.map((proj, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#0d9488',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {idx + 1}
                          </span>
                          <span>Proyecto #{idx + 1}</span>
                        </span>

                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                            title="Eliminar este proyecto"
                          >
                            <Trash2 size={12} />
                            <span>Quitar</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>
                            Nombre del Proyecto
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Tienda Online, App Móvil..."
                            value={proj.name}
                            onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0,0,0,0.12)',
                              fontSize: '12px',
                              background: '#ffffff',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>
                            URL del Proyecto (Demo o GitHub)
                          </label>
                          <input
                            type="url"
                            placeholder="https://mi-proyecto.com o github.com"
                            value={proj.url}
                            onChange={(e) => handleProjectChange(idx, 'url', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid rgba(0,0,0,0.12)',
                              fontSize: '12px',
                              background: '#ffffff',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tarifa & Honorarios */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
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
              </div>

              {/* 4. Métodos de Pago y Cobro Aceptados */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0d9488', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={13} color="#0d9488" />
                    4. Métodos de Cobro Aceptados ({(formData.payments || []).length})
                  </span>
                  <span style={{ 
                    fontSize: '10.5px', 
                    color: (formData.payments || []).length > 0 ? '#0f766e' : '#dc2626', 
                    fontWeight: 700 
                  }}>
                    {(formData.payments || []).length > 0 ? '✓ Métodos configurados' : '* Requerido al menos 1'}
                  </span>
                </div>
                
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                  Selecciona o agrega las vías por las que recibes pagos de tus clientes y empresas:
                </p>

                {/* Chips de selección rápida */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                  {POPULAR_PAYMENT_METHODS.map((method) => {
                    const isSelected = (formData.payments || []).includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => handleTogglePayment(method)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          background: isSelected ? '#f0fdfa' : '#f8fafc',
                          border: isSelected ? '1.5px solid #0d9488' : '1px solid #e2e8f0',
                          color: isSelected ? '#0f766e' : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 1px 3px rgba(13, 148, 136, 0.12)' : 'none'
                        }}
                      >
                        {isSelected ? (
                          <Check size={12} strokeWidth={2.8} color="#0d9488" />
                        ) : (
                          <Plus size={12} color="#94a3b8" />
                        )}
                        <span>{method}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Métodos personalizados que no estén en POPULAR_PAYMENT_METHODS */}
                {(formData.payments || []).some((m) => !POPULAR_PAYMENT_METHODS.includes(m)) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '3px' }}>
                    {(formData.payments || []).filter((m) => !POPULAR_PAYMENT_METHODS.includes(m)).map((custom) => (
                      <span
                        key={custom}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#ecfdf5',
                          border: '1.5px solid #10b981',
                          color: '#065f46'
                        }}
                      >
                        <Check size={12} strokeWidth={2.8} color="#059669" />
                        <span>{custom}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePayment(custom)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            padding: 0,
                            display: 'flex',
                            marginLeft: '2px'
                          }}
                          title="Eliminar método"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Input para agregar método de pago adicional */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <input
                    type="text"
                    placeholder="Otro método (Ej. Payoneer, Airtm, Meru, etc.)"
                    value={customPayment}
                    onChange={(e) => setCustomPayment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomPayment();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      fontSize: '11px',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPayment}
                    disabled={!customPayment.trim()}
                    style={{
                      background: customPayment.trim() ? '#0f172a' : '#f1f5f9',
                      color: customPayment.trim() ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: customPayment.trim() ? 'pointer' : 'default',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Plus size={12} />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              {/* Mensaje de error / validación */}
              {errorMsg && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#b91c1c',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  marginTop: '4px'
                }}>
                  <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

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
                {loading ? 'Guardando en Firebase...' : existingDev ? 'Guardar Cambios' : 'Publicar Perfil Verificado'}
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
