import React, { useState } from 'react';
import { 
  X, Eye, EyeOff, CheckCircle2, Shield, AlertCircle,
  Code2, Palette, Brain, Building2, Sparkles, ArrowRight
} from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  loginWithGithub,
  saveDeveloperToFirestore,
  saveCompanyToFirestore
} from '../firebase';
import { updateProfile } from 'firebase/auth';

export const AuthModal = ({ 
  isOpen, 
  initialMode = 'login', // 'login' | 'register'
  onClose, 
  onLoginSuccess 
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('software');
  const [workPreference, setWorkPreference] = useState('both');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleFirebaseError = (err) => {
    console.error("Firebase Auth Error:", err);
    let msg = "Ocurrió un error al procesar tu solicitud.";
    if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
      msg = "Credenciales incorrectas. Verifica tu correo y contraseña.";
    } else if (err.code === "auth/email-already-in-use") {
      msg = "Este correo ya está registrado. Intenta iniciar sesión.";
    } else if (err.code === "auth/weak-password") {
      msg = "La contraseña debe tener al menos 6 caracteres.";
    } else if (err.code === "auth/popup-closed-by-user") {
      msg = "La ventana de inicio de sesión fue cerrada antes de completar.";
    } else if (err.code === "auth/network-request-failed") {
      msg = "Error de red. Por favor verifica tu conexión a internet.";
    } else if (err.message) {
      msg = err.message;
    }
    setErrorMessage(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let userCredential;
      if (mode === 'login') {
        userCredential = await loginWithEmail(email, password);
      } else {
        userCredential = await registerWithEmail(email, password);
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: name
          });
        }
      }

      const fbUser = userCredential.user;
      const isCompany = selectedDiscipline === 'company';
      
      const user = {
        uid: fbUser.uid,
        name: fbUser.displayName || name || (isCompany ? 'Empresa Tech' : (mode === 'login' ? 'Miembro Venstack' : 'Nuevo Miembro')),
        email: fbUser.email,
        role: isCompany ? 'Empresa / Contratante' :
              selectedDiscipline === 'software' ? 'Software Engineer' :
              selectedDiscipline === 'uiux' ? 'UI/UX Designer' :
              selectedDiscipline === 'ai' ? 'AI Engineer' : 'Cybersecurity Analyst',
        accountType: isCompany ? 'company' : 'developer',
        avatar: fbUser.photoURL || '',
        verified: true,
      };

      // Si es un registro nuevo, guardar perfil profesional según corresponda
      if (mode === 'register') {
        if (isCompany) {
          // PERFIL DE EMPRESA (Diferente al desarrollador: sin tarifa de dev ni inversores personales)
          const initialCompanyProfile = {
            id: `comp-${fbUser.uid}`,
            userId: fbUser.uid,
            name: user.name,
            companyName: user.name,
            logoText: (user.name || 'EM').substring(0, 2).toUpperCase(),
            role: 'Empresa / Contratante',
            accountType: 'company',
            industry: 'Tecnología & Software',
            location: 'Caracas, VE • Remoto',
            website: '',
            companySize: '1-10 colaboradores',
            description: `Empresa tech activa en Venstack contratando y conectando con el mejor talento venezolano.`,
            techStack: ['React', 'Node.js', 'Python', 'AWS', 'Figma'],
            benefits: [
              'Salarios en USDT / Deel puntuales',
              'Modalidad 100% Remoto Flexible',
              'Bono mensual de respaldo eléctrico e internet',
              'Oportunidades de crecimiento y proyectos globales'
            ],
            paymentMethods: ['Binance (USDT)', 'Zinli', 'Deel'],
            verified: true,
            avatar: user.avatar || '',
            createdAt: Date.now()
          };

          try {
            await saveCompanyToFirestore(initialCompanyProfile);
          } catch (saveErr) {
            console.warn("Aviso al guardar perfil de empresa en Firestore:", saveErr);
          }
        } else {
          // PERFIL DE DESARROLLADOR INDIVIDUAL
          const initialDevProfile = {
            id: `dev-${fbUser.uid}`,
            userId: fbUser.uid,
            name: user.name,
            email: fbUser.email,
            role: user.role,
            accountType: 'developer',
            category: selectedDiscipline,
            level: 'Junior',
            avatar: user.avatar || '',
            city: 'Caracas, VE',
            verified: true,
            available: true,
            availabilityText: workPreference === 'hourly' ? 'Disponible por Horas / Freelance' :
                              workPreference === 'fulltime' ? 'Disponible Full-time' : 'Disponible (Full-time & Por Horas)',
            rate: '$1,000 - $1,500 / mes',
            hourlyRate: '$15 - $22 / hora',
            bio: `Profesional venezolano en ${selectedDiscipline.toUpperCase()} listo para proyectos y oportunidades remotas.`,
            setup: {
              power: 'Inversor / Respaldo Eléctrico Verificado',
              internet: 'Fibra Óptica de Alta Velocidad',
              backupInternet: 'Conexión 4G LTE redundante',
              tested: true,
            },
            payments: ['Binance (USDT)', 'Zinli', 'Pago Móvil'],
            skills: selectedDiscipline === 'uiux' ? ['Figma', 'UI/UX', 'Design Systems', 'Wireframing'] :
                    selectedDiscipline === 'ai' ? ['Python', 'OpenAI API', 'LangChain', 'FastAPI'] :
                    selectedDiscipline === 'security' ? ['Pentesting', 'Linux', 'OWASP', 'Ciberseguridad'] :
                    ['React', 'TypeScript', 'Node.js', 'Next.js'],
            featuredProject: {
              title: 'Portafolio Profesional',
              description: 'Proyectos y soluciones desarrolladas para clientes remotos y globales.',
              demoUrl: 'https://venstack.dev',
              githubUrl: 'https://github.com',
              stars: 12,
            },
            endorsements: 1,
            karma: 150,
            githubUser: fbUser.email ? fbUser.email.split('@')[0] : 'venstack-dev',
            createdAt: Date.now()
          };

          try {
            await saveDeveloperToFirestore(initialDevProfile);
          } catch (saveErr) {
            console.warn("Aviso al guardar perfil en Firestore:", saveErr);
          }
        }
      }

      setSuccessMessage(
        mode === 'login'
          ? `¡Bienvenido de vuelta, ${user.name}!`
          : isCompany
          ? `¡Cuenta empresarial para "${user.name}" creada exitosamente!`
          : `¡Cuenta y perfil creados exitosamente en Firebase!`
      );

      setTimeout(() => {
        onLoginSuccess?.(user);
        onClose();
        setSuccessMessage('');
      }, 1200);
    } catch (err) {
      handleFirebaseError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSocial = async (provider) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const userCredential = provider === 'github' 
        ? await loginWithGithub()
        : await loginWithGoogle();

      const fbUser = userCredential.user;
      const user = {
        uid: fbUser.uid,
        name: fbUser.displayName || (provider === 'github' ? 'Dev Criollo (GitHub)' : 'Usuario Google'),
        email: fbUser.email,
        role: 'Full Stack Developer',
        avatar: fbUser.photoURL || '',
        verified: true,
      };

      setSuccessMessage(`Conectado exitosamente con ${provider === 'github' ? 'GitHub' : 'Google'}`);
      setTimeout(() => {
        onLoginSuccess?.(user);
        onClose();
        setSuccessMessage('');
      }, 1000);
    } catch (err) {
      handleFirebaseError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="venstack-auth-overlay" onClick={onClose}>
      <div 
        className="venstack-auth-container animate-fade"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LEFT COLUMN: Editorial Super-Premium Cover Header with Mount Ávila */}
        <div className="venstack-auth-cover">
          <div 
            className="venstack-auth-cover-bg"
            style={{ backgroundImage: `url('/auth-cover.jpg')` }}
          />
          <div className="venstack-auth-cover-gradient" />

          <div className="venstack-auth-cover-content">
            <div className="venstack-auth-logo-badge">
              <img 
                src="/img/venstack.png" 
                alt="Venstack Logo" 
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <div className="venstack-auth-cover-text">
              <h3 className="venstack-auth-cover-title">
                El epicentro del talento tecnológico de Venezuela.
              </h3>
              <p className="venstack-auth-cover-desc">
                Crea tu portafolio con proyectos reales, accede a vacantes remotas con salarios en USDT y colabora con los mejores profesionales del país.
              </p>
            </div>

            <div className="venstack-auth-pillars">
              <div className="venstack-auth-pillar-item">
                <Code2 size={14} color="#14b8a6" />
                <span>Software • UI/UX • IA • Seguridad</span>
              </div>
              <div className="venstack-auth-pillar-item">
                <Sparkles size={14} color="#f59e0b" />
                <span>Salarios por Mes y por Horas en USDT/Zinli</span>
              </div>
              <div className="venstack-auth-pillar-item">
                <Shield size={14} color="#10b981" />
                <span>Setup Eléctrico y Conectividad Verificada</span>
              </div>
            </div>

            <div className="venstack-auth-cover-footer">
              <span>Caracas • Valencia • Maracaibo • Lechería • Mérida</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clean Apple Auth Form */}
        <div className="venstack-auth-form-side">
          
          {/* Top Bar with Mode Switcher & Close */}
          <div className="venstack-auth-topbar">
            <div className="venstack-auth-switcher">
              <button
                type="button"
                className={`venstack-auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`venstack-auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Crear Cuenta
              </button>
            </div>

            <button 
              onClick={onClose} 
              className="venstack-auth-close-btn"
              title="Cerrar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Body */}
          <div className="venstack-auth-body">
            
            {successMessage ? (
              <div className="venstack-auth-success animate-fade">
                <CheckCircle2 size={48} color="#0d9488" />
                <h4>{successMessage}</h4>
                <p>Cargando tu sesión y sincronizando tu perfil...</p>
              </div>
            ) : (
              <>
                <div className="venstack-auth-header-text">
                  <h2>
                    {mode === 'login' ? 'Bienvenido a Venstack' : 'Crea tu perfil profesional'}
                  </h2>
                  <p>
                    {mode === 'login' 
                      ? 'Ingresa con tus credenciales para acceder a tus oportunidades.'
                      : 'Únete gratis a la comunidad y conecta con empresas globales.'}
                  </p>
                </div>

                {errorMessage && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '12.5px',
                    marginBottom: '14px',
                    lineHeight: 1.4
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Social Auth Buttons */}
                <div className="venstack-auth-social-row">
                  <button 
                    type="button" 
                    onClick={() => handleQuickSocial('github')}
                    className="venstack-social-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>Continuar con GitHub</span>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => handleQuickSocial('google')}
                    className="venstack-social-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.26v3.15C3.25 21.36 7.31 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.43l4.06-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.57l4.06 3.15c.94-2.82 3.58-4.97 6.68-4.97z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                </div>

                <div className="venstack-auth-divider">
                  <span>o con tu correo electrónico</span>
                </div>

                <form onSubmit={handleSubmit} className="venstack-auth-form">
                  {mode === 'register' && (
                    <div className="venstack-auth-field">
                      <label>
                        {selectedDiscipline === 'company' 
                          ? 'Nombre de la Empresa o Startup' 
                          : 'Nombre y Apellido'}
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder={selectedDiscipline === 'company' ? 'Ej. Fintech Caribe o Quantum Studio' : 'Ej. Luis Ramírez'} 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="venstack-auth-field">
                    <label>
                      {selectedDiscipline === 'company' ? 'Correo Corporativo o de Contacto' : 'Correo Electrónico'}
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder={selectedDiscipline === 'company' ? 'contacto@empresa.com' : 'nombre@ejemplo.com'} 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="venstack-auth-field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ margin: 0 }}>Contraseña</label>
                      {mode === 'login' && (
                        <a href="#recuperar" onClick={(e) => { e.preventDefault(); alert('Enlace de recuperación enviado a tu correo.'); }} className="venstack-auth-forgot">
                          ¿Olvidaste tu contraseña?
                        </a>
                      )}
                    </div>
                    <div className="venstack-password-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="venstack-eye-btn"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Register-only discipline & modality selection */}
                  {mode === 'register' && (
                    <>
                      <div className="venstack-auth-field">
                        <label>Tipo de Perfil a Crear</label>
                        <div className="venstack-discipline-selector">
                          {[
                            { id: 'software', label: 'Software', icon: Code2, color: '#0d9488' },
                            { id: 'uiux', label: 'UI/UX', icon: Palette, color: '#d97706' },
                            { id: 'ai', label: 'IA / ML', icon: Brain, color: '#8b5cf6' },
                            { id: 'security', label: 'Seguridad', icon: Shield, color: '#059669' },
                            { id: 'company', label: 'Empresa', icon: Building2, color: '#2563eb' }
                          ].map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedDiscipline(item.id)}
                                className={`venstack-disc-pill ${selectedDiscipline === item.id ? 'active' : ''}`}
                              >
                                <Icon size={12} color={selectedDiscipline === item.id ? '#ffffff' : item.color} />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="venstack-auth-field">
                        <label>
                          {selectedDiscipline === 'company' 
                            ? 'Modalidad de Contratación Ofrecida' 
                            : 'Preferencia de Contratación'}
                        </label>
                        <div className="venstack-radio-group">
                          <label className={`venstack-radio-option ${workPreference === 'fulltime' ? 'selected' : ''}`}>
                            <input 
                              type="radio" 
                              name="workPref" 
                              checked={workPreference === 'fulltime'} 
                              onChange={() => setWorkPreference('fulltime')} 
                            />
                            <span>Remoto Full-time</span>
                          </label>
                          <label className={`venstack-radio-option ${workPreference === 'hourly' ? 'selected' : ''}`}>
                            <input 
                              type="radio" 
                              name="workPref" 
                              checked={workPreference === 'hourly'} 
                              onChange={() => setWorkPreference('hourly')} 
                            />
                            <span>{selectedDiscipline === 'company' ? 'Por Horas / Bounties' : 'Por Horas / Freelance'}</span>
                          </label>
                          <label className={`venstack-radio-option ${workPreference === 'both' ? 'selected' : ''}`}>
                            <input 
                              type="radio" 
                              name="workPref" 
                              checked={workPreference === 'both'} 
                              onChange={() => setWorkPreference('both')} 
                            />
                            <span>Ambas</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <button 
                    type="submit" 
                    className="venstack-auth-submit-btn"
                    disabled={loading}
                  >
                    <span>
                      {loading 
                        ? 'Procesando...' 
                        : mode === 'login' 
                        ? 'Iniciar Sesión' 
                        : selectedDiscipline === 'company'
                        ? 'Crear Perfil de Empresa'
                        : 'Crear Mi Cuenta Gratis'}
                    </span>
                    {!loading && <ArrowRight size={15} />}
                  </button>
                </form>

                <div className="venstack-auth-footer-note">
                  {mode === 'login' ? (
                    <span>
                      ¿No tienes una cuenta aún?{' '}
                      <button type="button" onClick={() => setMode('register')} className="venstack-text-btn">
                        Regístrate gratis
                      </button>
                    </span>
                  ) : (
                    <span>
                      ¿Ya tienes cuenta?{' '}
                      <button type="button" onClick={() => setMode('login')} className="venstack-text-btn">
                        Inicia sesión aquí
                      </button>
                    </span>
                  )}
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
