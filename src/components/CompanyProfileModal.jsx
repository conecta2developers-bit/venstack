import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Building2, CheckCircle2, ShieldCheck, Plus, Check, AlertCircle 
} from 'lucide-react';
import { saveCompanyToFirestore } from '../firebase';

const INDUSTRY_OPTIONS = [
  'Fintech & Pagos Digitales',
  'Inteligencia Artificial & ML',
  'Software Factory & Apps',
  'Estudio UI/UX & Producto',
  'Ciberseguridad & Auditoría',
  'E-commerce & Retail',
  'SaaS & Cloud Solutions',
  'Consultoría & Servicios TI'
];

const COMPANY_SIZES = [
  '1-10 colaboradores (Startup)',
  '11-50 colaboradores (Crecimiento)',
  '51-200 colaboradores (Mediana)',
  '+200 colaboradores (Corporación)'
];

const COMMON_BENEFITS = [
  'Salarios en USDT / Moneda Fuerte',
  'Modalidad 100% Remoto Flexible',
  'Bono de Conectividad (Fibra Óptica)',
  'Bono de Respaldo Eléctrico (Inversor/UPS)',
  'Horario Flexible Orientado a Resultados',
  'Equipos de Trabajo / Hardware',
  'Oportunidades de Crecimiento & Carrera',
  'Presupuesto para Cursos & Certificaciones'
];

const PAYMENT_OPTIONS = [
  'Binance (USDT)',
  'Zinli',
  'Deel',
  'Wise',
  'Transferencia Internacional (Wire/Zelle)',
  'Pago Móvil / Banco Nacional'
];

export const CompanyProfileModal = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  existingCompany, 
  onSaveCompany,
  onOpenPublishJob,
  companyJobs = [] 
}) => {
  const fileInputRef = useRef(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formData, setFormData] = useState({
    name: existingCompany?.name || existingCompany?.companyName || currentUser?.name || 'Mi Empresa Tech',
    industry: existingCompany?.industry || 'Software Factory & Apps',
    location: existingCompany?.location || 'Caracas, VE • 100% Remoto',
    website: existingCompany?.website || '',
    companySize: existingCompany?.companySize || '11-50 colaboradores (Crecimiento)',
    avatar: existingCompany?.avatar || currentUser?.avatar || '',
    description: existingCompany?.description || 'Buscamos y contratamos talento tecnológico venezolano para proyectos globales y productos de alto impacto.',
    techStack: existingCompany?.techStack ? existingCompany.techStack.join(', ') : 'React, TypeScript, Node.js, Python, AWS',
    benefits: existingCompany?.benefits || [
      'Salarios en USDT / Moneda Fuerte',
      'Modalidad 100% Remoto Flexible',
      'Bono de Conectividad (Fibra Óptica)',
      'Horario Flexible Orientado a Resultados'
    ],
    paymentMethods: existingCompany?.paymentMethods || ['Binance (USDT)', 'Zinli', 'Deel'],
  });

  useEffect(() => {
    if (existingCompany) {
      setFormData({
        name: existingCompany.name || existingCompany.companyName || currentUser?.name || 'Mi Empresa Tech',
        industry: existingCompany.industry || 'Software Factory & Apps',
        location: existingCompany.location || 'Caracas, VE • 100% Remoto',
        website: existingCompany.website || '',
        companySize: existingCompany.companySize || '11-50 colaboradores (Crecimiento)',
        avatar: existingCompany.avatar || currentUser?.avatar || '',
        description: existingCompany.description || 'Buscamos y contratamos talento tecnológico venezolano para proyectos globales y productos de alto impacto.',
        techStack: Array.isArray(existingCompany.techStack) ? existingCompany.techStack.join(', ') : (existingCompany.techStack || 'React, TypeScript, Node.js, Python, AWS'),
        benefits: existingCompany.benefits || [
          'Salarios en USDT / Moneda Fuerte',
          'Modalidad 100% Remoto Flexible',
          'Bono de Conectividad (Fibra Óptica)',
          'Horario Flexible Orientado a Resultados'
        ],
        paymentMethods: existingCompany.paymentMethods || ['Binance (USDT)', 'Zinli', 'Deel'],
      });
    }
  }, [existingCompany, currentUser]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogoFileChange = (e) => {
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

  const toggleBenefit = (benefit) => {
    setFormData((prev) => {
      const exists = prev.benefits.includes(benefit);
      if (exists) {
        return { ...prev, benefits: prev.benefits.filter((b) => b !== benefit) };
      } else {
        return { ...prev, benefits: [...prev.benefits, benefit] };
      }
    });
  };

  const togglePaymentMethod = (method) => {
    setFormData((prev) => {
      const exists = prev.paymentMethods.includes(method);
      if (exists) {
        return { ...prev, paymentMethods: prev.paymentMethods.filter((m) => m !== method) };
      } else {
        return { ...prev, paymentMethods: [...prev.paymentMethods, method] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const techArray = formData.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const compId = existingCompany?.id || (currentUser?.uid ? `comp-${currentUser.uid}` : `comp-${Date.now()}`);
    
    const companyPayload = {
      id: compId,
      userId: currentUser?.uid || existingCompany?.userId || null,
      name: formData.name.trim(),
      companyName: formData.name.trim(),
      logoText: (formData.name.trim() || 'EM').substring(0, 2).toUpperCase(),
      role: 'Empresa / Contratante',
      accountType: 'company',
      industry: formData.industry,
      location: formData.location.trim(),
      website: formData.website.trim(),
      companySize: formData.companySize,
      avatar: formData.avatar,
      description: formData.description.trim(),
      techStack: techArray,
      benefits: formData.benefits,
      paymentMethods: formData.paymentMethods,
      verified: true,
      updatedAt: Date.now()
    };

    try {
      await saveCompanyToFirestore(companyPayload);
      if (companyPayload.userId) {
        localStorage.setItem(`venstack_account_type_${companyPayload.userId}`, 'company');
      }
      onSaveCompany?.(companyPayload);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error al guardar perfil de empresa:', err);
      setErrorMsg('No se pudo guardar el perfil empresarial. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apple-modal-overlay" onClick={onClose}>
      <div 
        className="apple-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        
        {/* Header */}
        <div className="apple-modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Building2 size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em' }}>
                {existingCompany ? 'Editar Perfil de Empresa' : 'Perfil de Empresa & Contratante'}
              </h2>
              <p style={{ fontSize: '11px', color: '#6e6e73', margin: '1px 0 0 0' }}>
                {existingCompany ? 'Actualiza los datos corporativos, beneficios y stack de tu organización' : 'Identidad corporativa, stack requerido y propuesta de valor'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex'
            }}
            title="Cerrar"
          >
            <X size={15} color="#1d1d1f" strokeWidth={2.4} />
          </button>
        </div>

        {/* Body */}
        <div className="apple-modal-body" style={{ padding: '20px 22px 28px' }}>
          
          {submitted ? (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <CheckCircle2 size={46} color="#2563eb" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1d1d1f', margin: 0 }}>
                ¡Perfil Empresarial Guardado!
              </h3>
              <p style={{ fontSize: '12.5px', color: '#6e6e73', marginTop: '6px' }}>
                Tu perfil de empresa ha sido actualizado y sincronizado en tiempo real.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {errorMsg && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12px'
                }}>
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Status Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="#2563eb" />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', display: 'block' }}>
                      Cuenta de Empresa Verificada
                    </span>
                    <span style={{ fontSize: '11px', color: '#3b82f6' }}>
                      Publica ofertas con salario transparente y atrae a los mejores desarrolladores de Venezuela.
                    </span>
                  </div>
                </div>

                {onOpenPublishJob && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPublishJob();
                    }}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Publicar Vacante</span>
                  </button>
                )}
              </div>

              {/* SECTION 1: Identidad Corporativa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  1. Identidad de la Empresa
                </span>

                {/* Logo & Basic Info */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  
                  {/* Logo Uploader */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: '82px',
                        height: '82px',
                        borderRadius: '20px',
                        background: formData.avatar ? '#ffffff' : 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
                        border: '2px dashed #93c5fd',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                      }}
                      title="Subir logo de la empresa"
                    >
                      {formData.avatar ? (
                        <img 
                          src={formData.avatar} 
                          alt="Logo Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                        />
                      ) : (
                        <>
                          <Building2 size={24} color="#3b82f6" />
                          <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
                            Subir Logo
                          </span>
                        </>
                      )}

                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        fontSize: '9px',
                        fontWeight: 600,
                        textAlign: 'center',
                        padding: '2px 0'
                      }}>
                        Cambiar
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoFileChange} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {showUrlInput ? 'Cerrar URL' : 'O usar URL'}
                    </button>
                  </div>

                  {/* Company Name & Industry */}
                  <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Nombre Comercial de la Empresa / Startup *
                      </label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej. Fintech Caribe o Cognitive Studio"
                        className="apple-input"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.14)',
                          fontSize: '13px',
                          background: '#ffffff',
                          color: '#1d1d1f',
                          outline: 'none',
                          display: 'block'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                        Sector o Industria Principal
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="apple-input"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.14)',
                          fontSize: '13px',
                          background: '#ffffff',
                          color: '#1d1d1f',
                          outline: 'none',
                          cursor: 'pointer',
                          display: 'block',
                          height: '42px'
                        }}
                      >
                        {INDUSTRY_OPTIONS.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {showUrlInput && (
                  <div style={{ marginTop: '-4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Enlace directo al Logo (URL)
                    </label>
                    <input 
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://ejemplo.com/logo.png"
                      className="apple-input"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.14)',
                        fontSize: '12.5px',
                        background: '#ffffff',
                        color: '#1d1d1f',
                        outline: 'none',
                        display: 'block'
                      }}
                    />
                  </div>
                )}

                {/* Location, Size & Website Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Ubicación / Modalidad
                    </label>
                    <input 
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Caracas, VE • Remoto"
                      className="apple-input"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.14)',
                        fontSize: '13px',
                        background: '#ffffff',
                        color: '#1d1d1f',
                        outline: 'none',
                        display: 'block'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Tamaño del Equipo
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="apple-input"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.14)',
                        fontSize: '13px',
                        background: '#ffffff',
                        color: '#1d1d1f',
                        outline: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        height: '42px'
                      }}
                    >
                      {COMPANY_SIZES.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                      Sitio Web Oficial o Perfil de LinkedIn
                    </label>
                    <input 
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://miempresa.com o https://linkedin.com/company/..."
                      className="apple-input"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.14)',
                        fontSize: '13px',
                        background: '#ffffff',
                        color: '#1d1d1f',
                        outline: 'none',
                        display: 'block'
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Sobre la Empresa & Misión (¿Qué construyen y por qué unirse?)
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe los productos, servicios o misión de tu compañía para motivar al talento a postularse..."
                    className="apple-input"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.14)',
                      fontSize: '13px',
                      background: '#ffffff',
                      color: '#1d1d1f',
                      outline: 'none',
                      minHeight: '86px',
                      resize: 'vertical',
                      lineHeight: 1.5,
                      fontFamily: 'inherit',
                      display: 'block'
                    }}
                  />
                </div>
              </div>

              {/* SECTION 2: Stack Tecnológico */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  2. Tecnologías & Perfiles que Contratan
                </span>
                <p style={{ fontSize: '11px', color: '#6e6e73', margin: 0 }}>
                  Indica las tecnologías principales que utiliza tu equipo (separadas por coma):
                </p>
                <input 
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React, Next.js, Node.js, Python, AWS, Figma, Docker"
                  className="apple-input"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.14)',
                    fontSize: '13px',
                    background: '#ffffff',
                    color: '#1d1d1f',
                    outline: 'none',
                    display: 'block'
                  }}
                />
              </div>

              {/* SECTION 3: Beneficios para el Talento */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  3. Beneficios Ofrecidos a los Desarrolladores
                </span>
                <p style={{ fontSize: '11px', color: '#6e6e73', margin: 0 }}>
                  Selecciona los beneficios que ofrece tu empresa para destacar ante el talento local:
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {COMMON_BENEFITS.map((benefit) => {
                    const isSelected = formData.benefits.includes(benefit);
                    return (
                      <button
                        key={benefit}
                        type="button"
                        onClick={() => toggleBenefit(benefit)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '11.5px',
                          fontWeight: isSelected ? 700 : 500,
                          background: isSelected ? '#eff6ff' : '#f9fafb',
                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                          color: isSelected ? '#1d4ed8' : '#4b5563',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} color="#2563eb" />}
                        <span>{benefit}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: Métodos de Pago */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86868b' }}>
                  4. Canales de Pago para Contrataciones
                </span>
                <p style={{ fontSize: '11px', color: '#6e6e73', margin: 0 }}>
                  Métodos transparentes y directos para el pago a profesionales venezolanos:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                  {PAYMENT_OPTIONS.map((method) => {
                    const isChecked = formData.paymentMethods.includes(method);
                    return (
                      <label 
                        key={method} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: isChecked ? '#f0fdf4' : '#f9fafb',
                          border: isChecked ? '1px solid #86efac' : '1px solid #e5e7eb',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: isChecked ? 600 : 400,
                          color: isChecked ? '#15803d' : '#374151'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePaymentMethod(method)}
                        />
                        <span>{method}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: Vacantes Publicadas */}
              {companyJobs.length > 0 && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                      Tus Ofertas Publicadas ({companyJobs.length})
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Visibles en Empleos & Bounties
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {companyJobs.map((job) => (
                      <div 
                        key={job.id} 
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>
                            {job.title}
                          </strong>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {job.salary} • {job.type}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#059669',
                          background: '#ecfdf5',
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}>
                          Activa
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="apple-btn-secondary"
                  style={{ fontSize: '12.5px', padding: '8px 16px' }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 20px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {loading ? 'Guardando...' : existingCompany ? 'Actualizar Perfil de Empresa' : 'Guardar Perfil de Empresa'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
