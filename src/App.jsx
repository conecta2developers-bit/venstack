import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Search, Smartphone } from 'lucide-react';

import { INITIAL_DEVELOPERS, INITIAL_JOBS, INITIAL_SQUADS, INITIAL_COMPANIES, INITIAL_APPLICATIONS } from './data/mockData';
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
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { CompanyApplicantsModal } from './components/CompanyApplicantsModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { AuthModal } from './components/AuthModal';
import { 
  subscribeToAuthChanges, 
  logoutUser, 
  subscribeToDevelopers, 
  subscribeToJobs,
  subscribeToCompanies,
  subscribeToApplications,
  saveApplicationToFirestore,
  updateApplicationStatusInFirestore,
  deleteDeveloperFromFirestore,
  saveCompanyToFirestore 
} from './firebase';

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
        const isStoredComp = localStorage.getItem(`venstack_account_type_${fbUser.uid}`) === 'company';
        setCurrentUser((prev) => ({
          ...prev,
          uid: fbUser.uid,
          name: fbUser.displayName || prev?.name || fbUser.email?.split('@')[0] || 'Miembro Venstack',
          email: fbUser.email,
          role: (isStoredComp || prev?.accountType === 'company') ? 'Empresa / Contratante' : (prev?.role || 'Miembro de la Comunidad'),
          accountType: (isStoredComp || prev?.accountType === 'company') ? 'company' : (prev?.accountType || 'developer'),
          avatar: fbUser.photoURL || prev?.avatar || '',
          verified: true,
        }));
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Data (Initialized with localStorage or mock data, synchronized with Firestore in real-time)
  const [developers, setDevelopers] = useState(() => {
    try {
      const saved = localStorage.getItem('venstack_custom_developers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((d) => d.id));
          return [...parsed, ...INITIAL_DEVELOPERS.filter((d) => !customIds.has(d.id))];
        }
      }
    } catch (e) {
      console.warn('Aviso cargando desarrolladores locales:', e);
    }
    return INITIAL_DEVELOPERS;
  });

  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('venstack_custom_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((j) => j.id));
          return [...parsed, ...INITIAL_JOBS.filter((j) => !customIds.has(j.id))];
        }
      }
    } catch (e) {
      console.warn('Aviso cargando empleos locales:', e);
    }
    return INITIAL_JOBS;
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem('venstack_custom_companies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((c) => c.id));
          return [...parsed, ...INITIAL_COMPANIES.filter((c) => !customIds.has(c.id))];
        }
      }
    } catch (e) {
      console.warn('Aviso cargando empresas locales:', e);
    }
    return INITIAL_COMPANIES;
  });

  const [squads, setSquads] = useState(INITIAL_SQUADS);

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('venstack_custom_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((a) => a.id));
          return [...parsed, ...INITIAL_APPLICATIONS.filter((a) => !customIds.has(a.id))];
        }
      }
    } catch (e) {
      console.warn('Aviso cargando postulaciones locales:', e);
    }
    return INITIAL_APPLICATIONS;
  });

  const [isCompanyApplicantsOpen, setIsCompanyApplicantsOpen] = useState(false);
  const [applicantsFilterJobId, setApplicantsFilterJobId] = useState(null);

  // Subscribe to real-time developers, jobs and companies from Firestore
  useEffect(() => {
    const unsubDevs = subscribeToDevelopers((firestoreDevs) => {
      if (firestoreDevs && firestoreDevs.length > 0) {
        // Separar desarrolladores legítimos de perfiles creados para empresas o reclutadores
        const companyLikeDevs = [];
        const cleanDevs = [];

        firestoreDevs.forEach((d) => {
          const isCompanyRecord = Boolean(
            d.accountType === 'company' ||
            d.category === 'company' ||
            d.role?.toLowerCase().includes('empresa') ||
            d.role?.toLowerCase().includes('contratante') ||
            d.role?.toLowerCase().includes('reclutador') ||
            d.role?.toLowerCase().includes('recruiter') ||
            d.role?.toLowerCase().includes('rrhh') ||
            d.role?.toLowerCase().includes('talent') ||
            d.bio?.toUpperCase().includes('COMPANY') ||
            d.name?.toLowerCase().includes('wolves lab')
          );

          if (isCompanyRecord) {
            companyLikeDevs.push(d);
          } else {
            cleanDevs.push(d);
          }
        });

        setDevelopers((prev) => {
          const firestoreIds = new Set(cleanDevs.map((d) => d.id));
          const existingWithoutOverlap = prev.filter((d) => !firestoreIds.has(d.id));
          return [...cleanDevs, ...existingWithoutOverlap];
        });

        // Migrar automáticamente las empresas detectadas a la colección de companies
        if (companyLikeDevs.length > 0) {
          const migratedCompanies = companyLikeDevs.map((d) => ({
            id: `comp-${d.userId || d.id.replace('dev-', '')}`,
            userId: d.userId || (d.id.startsWith('dev-') ? d.id.replace('dev-', '') : null),
            name: d.name || 'Empresa Tech',
            companyName: d.name || 'Empresa Tech',
            logoText: (d.name || 'EM').substring(0, 2).toUpperCase(),
            role: 'Empresa / Contratante',
            accountType: 'company',
            industry: 'Software Factory & Apps',
            location: d.city || 'Caracas, VE • Remoto',
            website: d.featuredProject?.demoUrl || '',
            companySize: '1-10 colaboradores (Startup)',
            avatar: d.avatar || '',
            description: (d.bio && !d.bio.toUpperCase().includes('COMPANY'))
              ? d.bio 
              : 'Organización de tecnología contratando talento tecnológico en Venstack.',
            techStack: Array.isArray(d.skills) ? d.skills : ['React', 'TypeScript', 'Node.js', 'Python'],
            benefits: [
              'Salarios en USDT / Moneda Fuerte',
              'Modalidad 100% Remoto Flexible',
              'Bono de Conectividad (Fibra Óptica)',
              'Horario Flexible Orientado a Resultados'
            ],
            paymentMethods: d.payments || ['Binance (USDT)', 'Zinli', 'Deel'],
            verified: true,
            updatedAt: Date.now()
          }));

          setCompanies((prev) => {
            const migratedIds = new Set(migratedCompanies.map((c) => c.id));
            const existingWithoutOverlap = prev.filter((c) => !migratedIds.has(c.id));
            return [...migratedCompanies, ...existingWithoutOverlap];
          });
        }
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

    const unsubCompanies = subscribeToCompanies((firestoreCompanies) => {
      if (firestoreCompanies && firestoreCompanies.length > 0) {
        setCompanies((prev) => {
          const firestoreIds = new Set(firestoreCompanies.map((c) => c.id));
          const existingWithoutOverlap = prev.filter((c) => !firestoreIds.has(c.id));
          return [...firestoreCompanies, ...existingWithoutOverlap];
        });
      }
    });

    const unsubApps = subscribeToApplications((firestoreApps) => {
      if (firestoreApps && firestoreApps.length > 0) {
        setApplications((prev) => {
          const firestoreIds = new Set(firestoreApps.map((a) => a.id));
          const existingWithoutOverlap = prev.filter((a) => !firestoreIds.has(a.id));
          return [...firestoreApps, ...existingWithoutOverlap];
        });
      }
    });

    return () => {
      if (unsubDevs) unsubDevs();
      if (unsubJobs) unsubJobs();
      if (unsubCompanies) unsubCompanies();
      if (unsubApps) unsubApps();
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
    } else if (isCompanyUser || currentUser?.accountType === 'company' || companyProfile) {
      setIsCompanyProfileOpen(true);
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
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [isPublishJobOpen, setIsPublishJobOpen] = useState(false);
  const [isManualPwaOpen, setIsManualPwaOpen] = useState(false);

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
    setDevelopers((prev) => {
      const updated = [newDev, ...prev.filter((d) => d.id !== newDev.id)];
      try {
        const custom = JSON.parse(localStorage.getItem('venstack_custom_developers') || '[]');
        const filtered = custom.filter((d) => d.id !== newDev.id);
        localStorage.setItem('venstack_custom_developers', JSON.stringify([newDev, ...filtered]));
      } catch (err) {
        console.warn('Aviso guardando desarrollador en localStorage:', err);
      }
      return updated;
    });
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
    setJobs((prev) => {
      const updated = [newJob, ...prev.filter((j) => j.id !== newJob.id)];
      try {
        const custom = JSON.parse(localStorage.getItem('venstack_custom_jobs') || '[]');
        const filtered = custom.filter((j) => j.id !== newJob.id);
        localStorage.setItem('venstack_custom_jobs', JSON.stringify([newJob, ...filtered]));
      } catch (err) {
        console.warn('Aviso guardando empleo en localStorage:', err);
      }
      return updated;
    });
  };

  const handleApplyToJob = async (appPayload) => {
    setApplications((prev) => {
      const updated = [appPayload, ...prev.filter((a) => a.id !== appPayload.id)];
      try {
        const custom = JSON.parse(localStorage.getItem('venstack_custom_applications') || '[]');
        const filtered = custom.filter((a) => a.id !== appPayload.id);
        localStorage.setItem('venstack_custom_applications', JSON.stringify([appPayload, ...filtered]));
      } catch (e) {}
      return updated;
    });
    try {
      await saveApplicationToFirestore(appPayload);
    } catch (err) {
      console.warn("Aviso guardando postulación en Firestore:", err);
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus, notes) => {
    setApplications((prev) => {
      const updated = prev.map((a) => 
        a.id === appId ? { ...a, status: newStatus, ...(notes !== undefined ? { notes } : {}) } : a
      );
      try {
        localStorage.setItem('venstack_custom_applications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      await updateApplicationStatusInFirestore(appId, newStatus, notes);
    } catch (err) {
      console.warn("Aviso actualizando postulación en Firestore:", err);
    }
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

  const userProfile = useMemo(() => {
    if (!currentUser) return null;
    return developers.find(
      (d) => (d.userId && d.userId === currentUser.uid) || d.id === `dev-${currentUser.uid}`
    );
  }, [currentUser, developers]);

  // Check if current user has a company or developer profile
  const companyProfile = useMemo(() => {
    if (!currentUser) return null;
    const directComp = companies.find(
      (c) => (c.userId && c.userId === currentUser.uid) || c.id === `comp-${currentUser.uid}`
    );
    if (directComp) return directComp;

    // Detect if this account was created as a company/recruiter under legacy code
    const isCompanyByRoleOrName = Boolean(
      currentUser?.accountType === 'company' ||
      currentUser?.role?.toLowerCase().includes('empresa') ||
      currentUser?.role?.toLowerCase().includes('contratante') ||
      currentUser?.role?.toLowerCase().includes('reclutador') ||
      currentUser?.role?.toLowerCase().includes('recruiter') ||
      currentUser?.role?.toLowerCase().includes('rrhh') ||
      currentUser?.role?.toLowerCase().includes('talent') ||
      currentUser?.name?.toLowerCase().includes('wolves lab') ||
      userProfile?.category === 'company' ||
      userProfile?.role?.toLowerCase().includes('reclutador') ||
      userProfile?.role?.toLowerCase().includes('recruiter') ||
      userProfile?.bio?.toUpperCase().includes('COMPANY') ||
      (currentUser?.uid && localStorage.getItem(`venstack_account_type_${currentUser.uid}`) === 'company')
    );

    if (isCompanyByRoleOrName) {
      return {
        id: `comp-${currentUser.uid}`,
        userId: currentUser.uid,
        name: currentUser.name || userProfile?.name || 'Wolves lab',
        companyName: currentUser.name || userProfile?.name || 'Wolves lab',
        logoText: (currentUser.name || userProfile?.name || 'WL').substring(0, 2).toUpperCase(),
        role: 'Empresa / Contratante',
        accountType: 'company',
        industry: 'Software Factory & Apps',
        location: userProfile?.city || 'Caracas, VE • Remoto',
        website: userProfile?.featuredProject?.demoUrl || '',
        companySize: '1-10 colaboradores (Startup)',
        avatar: currentUser.avatar || userProfile?.avatar || '',
        description: (userProfile?.bio && !userProfile.bio.toUpperCase().includes('COMPANY'))
          ? userProfile.bio
          : 'Organización de tecnología contratando talento tecnológico en Venstack.',
        techStack: Array.isArray(userProfile?.skills) ? userProfile.skills : ['React', 'TypeScript', 'Node.js', 'Python'],
        benefits: [
          'Salarios en USDT / Moneda Fuerte',
          'Modalidad 100% Remoto Flexible',
          'Bono de Conectividad (Fibra Óptica)',
          'Horario Flexible Orientado a Resultados'
        ],
        paymentMethods: userProfile?.payments || ['Binance (USDT)', 'Zinli', 'Deel'],
        verified: true,
      };
    }

    return null;
  }, [currentUser, companies, userProfile]);

  const isCompanyUser = Boolean(
    companyProfile ||
    currentUser?.accountType === 'company' ||
    currentUser?.role?.toLowerCase().includes('empresa') ||
    currentUser?.role?.toLowerCase().includes('contratante') ||
    currentUser?.role?.toLowerCase().includes('reclutador') ||
    currentUser?.role?.toLowerCase().includes('recruiter') ||
    currentUser?.role?.toLowerCase().includes('rrhh') ||
    currentUser?.role?.toLowerCase().includes('talent') ||
    currentUser?.name?.toLowerCase().includes('wolves lab') ||
    userProfile?.category === 'company' ||
    userProfile?.role?.toLowerCase().includes('reclutador') ||
    userProfile?.role?.toLowerCase().includes('recruiter') ||
    userProfile?.bio?.toUpperCase().includes('COMPANY') ||
    (currentUser?.uid && localStorage.getItem(`venstack_account_type_${currentUser.uid}`) === 'company')
  );

  const hasProfile = Boolean(isCompanyUser ? companyProfile : userProfile);

  // Synchronize currentUser with real profile from Firestore
  useEffect(() => {
    if (isCompanyUser && companyProfile) {
      if (
        (companyProfile.avatar && companyProfile.avatar !== currentUser?.avatar) ||
        (companyProfile.name && companyProfile.name !== currentUser?.name) ||
        currentUser?.role !== 'Empresa / Contratante' ||
        currentUser?.accountType !== 'company'
      ) {
        setCurrentUser((prev) => ({
          ...prev,
          avatar: companyProfile.avatar || prev?.avatar,
          name: companyProfile.name || companyProfile.companyName || prev?.name,
          role: 'Empresa / Contratante',
          accountType: 'company',
        }));
      }
    } else if (userProfile && currentUser && !isCompanyUser) {
      if (
        (userProfile.avatar && userProfile.avatar !== currentUser.avatar) ||
        (userProfile.name && userProfile.name !== currentUser.name) ||
        (userProfile.role && userProfile.role !== currentUser.role)
      ) {
        setCurrentUser((prev) => ({
          ...prev,
          avatar: userProfile.avatar || prev?.avatar,
          name: userProfile.name || prev?.name,
          role: userProfile.role || prev?.role,
          accountType: 'developer',
        }));
      }
    }
  }, [companyProfile, userProfile, isCompanyUser, currentUser?.avatar, currentUser?.name, currentUser?.role, currentUser?.accountType]);

  const handleSaveCompany = async (savedCompany) => {
    if (savedCompany?.userId) {
      localStorage.setItem(`venstack_account_type_${savedCompany.userId}`, 'company');
      // Clean up legacy developer record in Firestore
      try {
        await deleteDeveloperFromFirestore(`dev-${savedCompany.userId}`);
      } catch (err) {
        console.warn("Aviso eliminando dev obsoleto:", err);
      }
    }

    // Clean up local developers state & localStorage
    setDevelopers((prev) => {
      const updated = prev.filter((d) => d.userId !== savedCompany.userId && d.id !== `dev-${savedCompany.userId}`);
      try {
        const custom = JSON.parse(localStorage.getItem('venstack_custom_developers') || '[]');
        const filtered = custom.filter((d) => d.userId !== savedCompany.userId && d.id !== `dev-${savedCompany.userId}`);
        localStorage.setItem('venstack_custom_developers', JSON.stringify(filtered));
      } catch (e) {}
      return updated;
    });

    setCompanies((prev) => {
      const idx = prev.findIndex((c) => c.id === savedCompany.id);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = savedCompany;
      } else {
        updated = [savedCompany, ...prev];
      }
      try {
        const custom = JSON.parse(localStorage.getItem('venstack_custom_companies') || '[]');
        const filtered = custom.filter((c) => c.id !== savedCompany.id);
        localStorage.setItem('venstack_custom_companies', JSON.stringify([savedCompany, ...filtered]));
      } catch (e) {}
      return updated;
    });

    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        avatar: savedCompany.avatar || prev?.avatar,
        name: savedCompany.name || savedCompany.companyName || prev?.name,
        role: 'Empresa / Contratante',
        accountType: 'company',
      }));
    }
  };

  const handleSelectCompany = (companyNameOrObj) => {
    if (!companyNameOrObj) return;
    if (typeof companyNameOrObj === 'object') {
      setSelectedCompany(companyNameOrObj);
      return;
    }
    const cleanName = companyNameOrObj.toLowerCase().trim();
    const found = companies.find((c) => 
      c.name?.toLowerCase().includes(cleanName) || 
      cleanName.includes(c.name?.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(cleanName)
    );
    if (found) {
      setSelectedCompany(found);
    } else {
      setSelectedCompany({
        id: `comp-temp-${Date.now()}`,
        name: companyNameOrObj,
        companyName: companyNameOrObj,
        logoText: companyNameOrObj.substring(0, 2).toUpperCase(),
        industry: 'Empresa de Tecnología',
        location: 'Remoto LatAm',
        description: 'Organización contratando y colaborando con talento tecnológico venezolano en Venstack.',
        verified: true,
        benefits: ['Salarios en USDT', 'Modalidad Remota'],
        paymentMethods: ['Binance (USDT)', 'Zinli', 'Deel'],
        techStack: ['Desarrollo Web', 'Mobile', 'Cloud']
      });
    }
  };

  const currentCompanyJobs = useMemo(() => {
    if (!currentUser) return [];
    const compName = (companyProfile?.name || currentUser?.name || '').toLowerCase();
    return jobs.filter((j) => 
      (j.companyId && companyProfile?.id && j.companyId === companyProfile.id) ||
      (compName && j.company?.toLowerCase().includes(compName))
    );
  }, [jobs, companyProfile, currentUser]);

  const companyApplicants = useMemo(() => {
    if (!isCompanyUser) return [];
    const compName = (companyProfile?.name || currentUser?.name || '').toLowerCase().trim();
    const compId = companyProfile?.id;
    return applications.filter((app) => {
      if (compId && app.companyId && app.companyId === compId) return true;
      if (compName && app.companyName && app.companyName.toLowerCase().includes(compName)) return true;
      if (currentCompanyJobs.some((j) => j.id === app.jobId)) return true;
      return false;
    });
  }, [applications, isCompanyUser, companyProfile, currentUser?.name, currentCompanyJobs]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '96px', overflowX: 'hidden', width: '100%' }}>
      
      {/* Apple Header */}
      <Navbar
        isIntro={isIntro}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateProfile={handleOpenCreateProfile}
        onOpenPublishJob={() => setIsPublishJobOpen(true)}
        onOpenPwaInstall={() => setIsManualPwaOpen(true)}
        onOpenApplicants={() => {
          setApplicantsFilterJobId(null);
          setIsCompanyApplicantsOpen(true);
        }}
        applicantsCount={companyApplicants.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        userProfile={userProfile}
        companyProfile={companyProfile}
        isCompanyUser={isCompanyUser}
        hasProfile={hasProfile}
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
        hasProfile={hasProfile}
        isCompanyUser={isCompanyUser}
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
                  onSelectCompany={handleSelectCompany}
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
          onSelectCompany={handleSelectCompany}
          currentUser={currentUser}
          userProfile={userProfile}
          onApplyToJob={handleApplyToJob}
        />
      )}

      {selectedSquad && (
        <SquadModal
          squad={selectedSquad}
          onClose={() => setSelectedSquad(null)}
        />
      )}

      {isCreateProfileOpen && !isCompanyUser && (
        <CreateProfileModal
          currentUser={currentUser}
          existingDev={userProfile}
          onClose={() => setIsCreateProfileOpen(false)}
          onSaveProfile={handleSaveProfile}
          onSwitchToCompany={() => {
            setIsCreateProfileOpen(false);
            setIsCompanyProfileOpen(true);
          }}
        />
      )}

      {(isCompanyProfileOpen || (isCreateProfileOpen && isCompanyUser)) && (
        <CompanyProfileModal
          isOpen={true}
          currentUser={currentUser}
          existingCompany={companyProfile}
          onClose={() => {
            setIsCompanyProfileOpen(false);
            setIsCreateProfileOpen(false);
          }}
          onSaveCompany={handleSaveCompany}
          onOpenPublishJob={() => setIsPublishJobOpen(true)}
          onOpenApplicants={(jobId) => {
            setApplicantsFilterJobId(jobId || null);
            setIsCompanyApplicantsOpen(true);
          }}
          companyJobs={currentCompanyJobs}
        />
      )}

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSelectJob={(job) => {
            setSelectedJob(job);
          }}
          activeJobs={jobs}
          currentUser={currentUser}
          isOwner={Boolean(
            currentUser && (
              selectedCompany.userId === currentUser.uid ||
              selectedCompany.id === companyProfile?.id ||
              (companyProfile?.name && selectedCompany.name?.toLowerCase() === companyProfile.name.toLowerCase())
            )
          )}
          onEditCompany={() => {
            setSelectedCompany(null);
            setIsCompanyProfileOpen(true);
          }}
          onOpenApplicants={(jobId) => {
            setApplicantsFilterJobId(jobId || null);
            setIsCompanyApplicantsOpen(true);
          }}
          applicantsCount={companyApplicants.length}
        />
      )}

      {isCompanyApplicantsOpen && (
        <CompanyApplicantsModal
          isOpen={true}
          onClose={() => {
            setIsCompanyApplicantsOpen(false);
            setApplicantsFilterJobId(null);
          }}
          company={companyProfile}
          companyJobs={currentCompanyJobs}
          applications={applications}
          initialJobId={applicantsFilterJobId}
          onUpdateStatus={handleUpdateApplicationStatus}
          onViewDeveloper={(devId, devName) => {
            const found = developers.find((d) => d.id === devId || d.name?.toLowerCase() === devName?.toLowerCase());
            if (found) {
              setSelectedDev(found);
            }
          }}
        />
      )}

      {isPublishJobOpen && (
        <PublishJobModal
          onClose={() => setIsPublishJobOpen(false)}
          onSaveJob={handleSaveJob}
          currentUser={currentUser}
          companyProfile={companyProfile}
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

        <button
          onClick={() => setIsManualPwaOpen(true)}
          style={{
            background: 'rgba(13, 148, 136, 0.08)',
            border: '1px solid rgba(13, 148, 136, 0.2)',
            borderRadius: '999px',
            padding: '6px 14px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#0d9488',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.16s ease'
          }}
          title="Instalar Venstack como aplicación en tu pantalla de inicio"
        >
          <Smartphone size={13} />
          <span>Instalar App en tu Celular o PC</span>
        </button>

        <span style={{ fontSize: '11px', color: '#a1a1a6' }}>
          © {new Date().getFullYear()} Venstack. Todos los derechos reservados.
        </span>
      </footer>

      {/* Native iOS Bottom Floating Dock */}
      <MobileTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateProfile={handleOpenCreateProfile}
        hasProfile={hasProfile}
        isCompanyUser={isCompanyUser}
        onOpenApplicants={() => setIsApplicantsModalOpen(true)}
        applicantsCount={companyApplicants.length}
      />

      {/* Progressive Web App (PWA) Installer */}
      <PwaInstallPrompt
        manualTrigger={isManualPwaOpen}
        onManualClose={() => setIsManualPwaOpen(false)}
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
