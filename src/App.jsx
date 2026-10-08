import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, Briefcase, Layers, MessageSquare, Plus, Search, 
  ShieldCheck, Zap, Sparkles, Filter, CheckCircle2, ArrowRight
} from 'lucide-react';

import { INITIAL_DEVELOPERS, INITIAL_JOBS, INITIAL_SQUADS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { OnboardingHero } from './components/OnboardingHero';
import { MobileTabBar } from './components/MobileTabBar';
import { DeveloperCard } from './components/DeveloperCard';
import { DeveloperModal } from './components/DeveloperModal';
import { JobCard } from './components/JobCard';
import { JobModal } from './components/JobModal';
import { SquadCard } from './components/SquadCard';
import { SquadModal } from './components/SquadModal';
import { CommunityFeed } from './components/CommunityFeed';
import { CreateProfileModal } from './components/CreateProfileModal';
import { PublishJobModal } from './components/PublishJobModal';
import { AuthModal } from './components/AuthModal';
import { subscribeToAuthChanges, logoutUser, subscribeToDevelopers, subscribeToJobs } from './firebase';

export function App() {
  const [activeTab, setActiveTab] = useState('developers'); // 'developers' | 'jobs' | 'squads' | 'community'
  const [searchQuery, setSearchQuery] = useState('');
  const directoryRef = useRef(null);

  // Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(null);

  // Subscribe to Firebase Auth state for real persistence
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((fbUser) => {
      if (fbUser) {
        setCurrentUser({
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Miembro Venstack',
          email: fbUser.email,
          role: 'Software Engineer',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
          verified: true,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Data (Initialized with mocks, synchronized with Firestore in real-time)
  const [developers, setDevelopers] = useState(INITIAL_DEVELOPERS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [squads, setSquads] = useState(INITIAL_SQUADS);

  // Subscribe to real-time developers and jobs from Firestore
  useEffect(() => {
    const unsubDevs = subscribeToDevelopers((firestoreDevs) => {
      if (firestoreDevs && firestoreDevs.length > 0) {
        setDevelopers((prev) => {
          const firestoreIds = new Set(firestoreDevs.map((d) => d.id));
          const existingWithoutOverlap = prev.filter((d) => !firestoreIds.has(d.id));
          return [...firestoreDevs, ...existingWithoutOverlap];
        });
      }
    });

    const unsubJobs = subscribeToJobs((firestoreJobs) => {
      if (firestoreJobs && firestoreJobs.length > 0) {
        setJobs((prev) => {
          const firestoreIds = new Set(firestoreJobs.map((j) => j.id));
          const existingWithoutOverlap = prev.filter((j) => !firestoreIds.has(j.id));
          return [...firestoreJobs, ...existingWithoutOverlap];
        });
      }
    });

    return () => {
      if (unsubDevs) unsubDevs();
      if (unsubJobs) unsubJobs();
    };
  }, []);

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleOpenCreateProfile = () => {
    if (!currentUser) {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
    } else {
      setIsCreateProfileOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Error logging out:', err);
    }
    setCurrentUser(null);
  };

  // Filters
  const [devFilter, setDevFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');

  // Modals
  const [selectedDev, setSelectedDev] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isPublishJobOpen, setIsPublishJobOpen] = useState(false);

  // Cinematic 2-second fullscreen onboarding transition
  const [isIntro, setIsIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntro(false);
    }, 2000);

    const handleEarlyExit = () => {
      setIsIntro(false);
    };

    window.addEventListener('wheel', handleEarlyExit, { passive: true });
    window.addEventListener('touchstart', handleEarlyExit, { passive: true });
    window.addEventListener('keydown', handleEarlyExit, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', handleEarlyExit);
      window.removeEventListener('touchstart', handleEarlyExit);
      window.removeEventListener('keydown', handleEarlyExit);
    };
  }, []);

  // Scroll to directory
  const handleScrollToDirectory = () => {
    setActiveTab('developers');
    setTimeout(() => {
      directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Filter discipline from hero
  const handleSelectDiscipline = (category) => {
    setDevFilter(category);
    setActiveTab('developers');
    setTimeout(() => {
      directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Handle Endorsement
  const handleEndorseDev = (devId) => {
    setDevelopers((prev) =>
      prev.map((d) => (d.id === devId ? { ...d, karma: d.karma + 10, endorsements: d.endorsements + 1 } : d))
    );
  };

  const handleSaveProfile = (newDev) => {
    setDevelopers((prev) => [newDev, ...prev.filter((d) => d.id !== newDev.id)]);
    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        avatar: newDev.avatar,
        name: newDev.name,
        role: newDev.role,
      }));
    }
  };

  const handleSaveJob = (newJob) => {
    setJobs([newJob, ...jobs]);
  };

  // Filter developers
  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dev.name.toLowerCase().includes(q) ||
        dev.role.toLowerCase().includes(q) ||
        dev.city.toLowerCase().includes(q) ||
        dev.skills.some((s) => s.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Category filter by discipline
      if (devFilter === 'software') {
        return dev.category === 'software' || dev.role.toLowerCase().includes('engineer') || dev.role.toLowerCase().includes('developer') || dev.skills.includes('React') || dev.skills.includes('Go');
      }
      if (devFilter === 'uiux') {
        return dev.category === 'uiux' || dev.role.toLowerCase().includes('ui') || dev.role.toLowerCase().includes('ux') || dev.role.toLowerCase().includes('design');
      }
      if (devFilter === 'ai') {
        return dev.category === 'ai' || dev.role.toLowerCase().includes('ai') || dev.role.toLowerCase().includes('machine learning') || dev.skills.includes('LangChain');
      }
      if (devFilter === 'security') {
        return dev.category === 'security' || dev.role.toLowerCase().includes('security') || dev.role.toLowerCase().includes('hacker') || dev.skills.includes('Pentesting');
      }
      if (devFilter === 'junior') {
        return dev.level === 'Junior';
      }

      return true;
    });
  }, [developers, searchQuery, devFilter]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (jobFilter === 'fulltime') return job.type === 'Tiempo Completo';
      if (jobFilter === 'bounty') return job.isBounty;
      if (jobFilter === 'junior') return job.juniorFriendly;

      return true;
    });
  }, [jobs, searchQuery, jobFilter]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '96px', overflowX: 'hidden', width: '100%' }}>
      
      {/* Apple Header */}
      <Navbar
        isIntro={isIntro}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateProfile={handleOpenCreateProfile}
        onOpenPublishJob={() => setIsPublishJobOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onLogout={handleLogout}
      />

      {/* FULL SCREEN ONBOARDING HERO STAGE (The Apple Signature Touch) */}
      <OnboardingHero
        isIntro={isIntro}
        onEndIntro={() => setIsIntro(false)}
        onExploreClick={handleScrollToDirectory}
        onCreateProfileClick={handleOpenCreateProfile}
        onSelectTab={setActiveTab}
        onSelectDiscipline={handleSelectDiscipline}
      />

      {/* Main Content Area */}
      <main 
        ref={directoryRef} 
        id="directory-section"
        className="main-content-wrapper" 
        style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', flex: '1', boxSizing: 'border-box', scrollMarginTop: '64px' }}
      >
        
        {/* Mobile quick search input */}
        <div style={{ margin: '10px 0 14px', display: 'none' }} id="mobile-directory-search">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '999px',
            padding: '8px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Search size={14} color="#86868b" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Filtrar por stack, rol o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12.5px',
                width: '100%',
                marginLeft: '8px',
                padding: 0
              }}
            />
          </div>
        </div>

        {/* ----------------------------------------------------
            TAB 1: DESARROLLADORES
            ---------------------------------------------------- */}
        {activeTab === 'developers' && (
          <div style={{ width: '100%', minWidth: 0 }}>
            
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em', margin: 0 }}>
                  Directorio de Profesionales Tech
                </h2>
                <p style={{ fontSize: '12px', color: '#86868b', margin: '2px 0 0 0' }}>
                  {filteredDevelopers.length} perfiles en Software, UI/UX, IA y Ciberseguridad
                </p>
              </div>
            </div>

            {/* Filter Strip with all 4 tech disciplines */}
            <div className="apple-filter-strip">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'software', label: '💻 Software & Código' },
                { id: 'uiux', label: '🎨 UI/UX & Producto' },
                { id: 'ai', label: '🤖 Inteligencia Artificial' },
                { id: 'security', label: '🛡️ Ciberseguridad' },
                { id: 'junior', label: '🌱 Junior Friendly' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setDevFilter(chip.id)}
                  className={`apple-chip ${devFilter === chip.id ? 'active' : ''}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Developers Grid */}
            {filteredDevelopers.length > 0 ? (
              <div className="cards-grid">
                {filteredDevelopers.map((dev) => (
                  <DeveloperCard
                    key={dev.id}
                    dev={dev}
                    onSelectDev={(d) => setSelectedDev(d)}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '40px 20px',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.06)',
                maxWidth: '400px',
                margin: '20px auto'
              }}>
                <Search size={32} color="#86868b" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
                  No se encontraron desarrolladores
                </h3>
                <p style={{ fontSize: '12px', color: '#86868b', margin: '4px 0 14px 0' }}>
                  Intenta cambiar el término de búsqueda o el filtro activo.
                </p>
                <button
                  onClick={() => {
                    setDevFilter('all');
                    setSearchQuery('');
                  }}
                  className="apple-btn-secondary"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: EMPLEOS & BOUNTIES
            ---------------------------------------------------- */}
        {activeTab === 'jobs' && (
          <div style={{ width: '100%', minWidth: 0 }}>
            
            {/* Sub-header & Filters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.02em', margin: 0 }}>
                  Oportunidades & Micro-Bounties
                </h2>
                <p style={{ fontSize: '12px', color: '#86868b', margin: '2px 0 0 0' }}>
                  Vacantes remotas con pagos directos en USDT, Zinli y Deel
                </p>
              </div>

              <button
                onClick={() => setIsPublishJobOpen(true)}
                className="apple-btn-primary"
                style={{ fontSize: '12px' }}
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Publicar Oferta</span>
              </button>
            </div>

            <div className="apple-filter-strip" style={{ padding: '4px 0', margin: '4px 0 10px' }}>
              {[
                { id: 'all', label: 'Todas las Oportunidades' },
                { id: 'fulltime', label: 'Empleos Fijos' },
                { id: 'bounty', label: 'Micro-Bounties ($)' },
                { id: 'junior', label: '🌱 Junior Friendly' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setJobFilter(chip.id)}
                  className={`apple-chip ${jobFilter === chip.id ? 'active' : ''}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Jobs Grid */}
            <div className="cards-grid">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelectJob={(j) => setSelectedJob(j)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: SQUADS COMUNITARIOS
            ---------------------------------------------------- */}
        {activeTab === 'squads' && (
          <div style={{ width: '100%', minWidth: 0 }}>
            
            {/* Apple Banner Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: '24px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              boxSizing: 'border-box'
            }}>
              <div style={{ maxWidth: '640px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0d9488' }}>
                  El Antídoto al "Requiere 3 años de experiencia"
                </span>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#1d1d1f', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  Squads de Código Abierto & Mentoría
                </h2>
                <p style={{ fontSize: '12.5px', color: '#6e6e73', margin: 0, lineHeight: 1.55 }}>
                  Forma equipos con otros desarrolladores bajo la tutela de un Senior. Construyan un producto real durante 3 semanas, hagan Pull Requests y obtengan un certificado de <strong>Proof of Work</strong> listo para sus entrevistas de trabajo.
                </p>
              </div>

              <div style={{
                background: '#f0fdfa',
                border: '1px solid #ccfbf1',
                padding: '10px 16px',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#0f766e', display: 'block' }}>100%</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d9488' }}>Gratuito & Comunitario</span>
              </div>
            </div>

            {/* Squads Grid */}
            <div className="cards-grid">
              {squads.map((squad) => (
                <SquadCard
                  key={squad.id}
                  squad={squad}
                  onJoinSquad={(s) => setSelectedSquad(s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: COMUNIDAD & FEED
            ---------------------------------------------------- */}
        {activeTab === 'community' && (
          <div style={{ width: '100%', minWidth: 0 }}>
            <CommunityFeed />
          </div>
        )}

      </main>

      {/* ----------------------------------------------------
          MODALS
          ---------------------------------------------------- */}
      {selectedDev && (
        <DeveloperModal
          dev={selectedDev}
          onClose={() => setSelectedDev(null)}
          onEndorse={handleEndorseDev}
        />
      )}

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {selectedSquad && (
        <SquadModal
          squad={selectedSquad}
          onClose={() => setSelectedSquad(null)}
        />
      )}

      {isCreateProfileOpen && (
        <CreateProfileModal
          currentUser={currentUser}
          existingDev={developers.find(d => (currentUser?.uid && d.userId === currentUser.uid) || (currentUser?.uid && d.id === `dev-${currentUser.uid}`))}
          onClose={() => setIsCreateProfileOpen(false)}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {isPublishJobOpen && (
        <PublishJobModal
          onClose={() => setIsPublishJobOpen(false)}
          onSaveJob={handleSaveJob}
        />
      )}

      {/* Luxury Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Clean Apple Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '36px 20px 48px',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        textAlign: 'center',
        background: '#ffffff'
      }}>
        <img 
          src="/img/venstack.png" 
          alt="Venstack - Venezuela Tech Community" 
          style={{ height: '64px', width: 'auto', objectFit: 'contain', margin: '-8px 0' }} 
        />
        <p style={{ fontSize: '12px', color: '#6e6e73', margin: 0, fontWeight: 500, maxWidth: '540px', lineHeight: 1.5 }}>
          Comunidad y red de profesionales en Software, UI/UX, Inteligencia Artificial y Ciberseguridad. Impulsando el talento de Venezuela para el mundo 🇻🇪
        </p>
        <span style={{ fontSize: '11px', color: '#a1a1a6' }}>
          © {new Date().getFullYear()} Venstack. Todos los derechos reservados.
        </span>
      </footer>

      {/* Native iOS Bottom Floating Dock */}
      <MobileTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateProfile={handleOpenCreateProfile}
      />

      <style>{`
        .main-content-wrapper {
          padding: 0 20px;
        }
        @media (max-width: 639px) {
          .main-content-wrapper {
            padding: 0 12px !important;
          }
          #mobile-directory-search {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
