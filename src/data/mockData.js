// Base de datos para Venstack — Red de Profesionales Tech de Venezuela
// Disciplinas: Software, UI/UX, Inteligencia Artificial, Ciberseguridad

export const INITIAL_DEVELOPERS = [
  {
    id: "dev-1",
    name: "Valentina Briceño",
    role: "Frontend Engineer & UI Specialist",
    category: "software",
    level: "Mid",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
    city: "Caracas, VE",
    verified: true,
    available: true,
    availabilityText: "Disponible (Full-time / Remoto)",
    rate: "$1,100 - $1,600 / mes",
    hourlyRate: "$15 - $22 / hora",
    bio: "Especialista en React, Next.js y desarrollo de interfaces accesibles. Apasionada por el diseño de sistemas y performance web.",
    setup: {
      power: "Inversor 2.4kVA + Batería LiFePO4",
      internet: "Fibra Óptica 400 Mbps (NetUno)",
      backupInternet: "Línea móvil Digitel LTE redundante",
      tested: true
    },
    payments: ["Binance (USDT)", "Zinli", "Deel", "Pago Móvil"],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma", "Zustand"],
    featuredProject: {
      title: "FinFlow LatAm",
      description: "Dashboard financiero para conciliación de pagos multimoneda y crypto.",
      demoUrl: "https://finflow-demo.vercel.app",
      githubUrl: "https://github.com/valentina/finflow",
      stars: 38
    },
    endorsements: 24,
    karma: 410,
    githubUser: "valentinab-dev"
  },
  {
    id: "dev-2",
    name: "Camila Navarro",
    role: "Lead Product & UI/UX Designer",
    category: "uiux",
    level: "Senior",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
    city: "Valencia, VE",
    verified: true,
    available: true,
    availabilityText: "Disponible para Proyectos y Consultorías",
    rate: "$1,400 - $2,000 / mes",
    hourlyRate: "$20 - $30 / hora",
    bio: "Diseñadora de productos digitales centrados en el usuario. Experta en Design Systems escalables, wireframing, prototipado avanzado y pruebas de usabilidad.",
    setup: {
      power: "UPS 1500VA + Batería Externa (6 hrs)",
      internet: "Fibra Óptica 300 Mbps (Fibex)",
      backupInternet: "Línea 4G LTE Movistar",
      tested: true
    },
    payments: ["Binance (USDT)", "Zinli", "Deel", "Wise"],
    skills: ["Figma", "Design Systems", "UI/UX Research", "Prototyping", "Design Tokens", "Wireframing"],
    featuredProject: {
      title: "Andes Bank Design System",
      description: "Sistema de diseño completo con +200 componentes reutilizables y tokens de accesibilidad WCAG AAA.",
      demoUrl: "https://figma.com/@camilanavarro",
      githubUrl: "https://behance.net/camilanavarro",
      stars: 64
    },
    endorsements: 38,
    karma: 620,
    githubUser: "camilanavarro-ui"
  },
  {
    id: "dev-3",
    name: "Dayana Rangel",
    role: "AI & Machine Learning Engineer",
    category: "ai",
    level: "Senior",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80",
    city: "Lechería, VE",
    verified: true,
    available: true,
    availabilityText: "Abierta a Contratos Remotos",
    rate: "$2,000 - $2,800 / mes",
    hourlyRate: "$25 - $40 / hora",
    bio: "Construyo pipelines de datos e integraciones con modelos LLM y visión por computador. Desarrollo de agentes autónomos y arquitecturas RAG para empresas.",
    setup: {
      power: "Planta Eléctrica Residencial + UPS",
      internet: "Fibra Óptica 500 Mbps (Inter)",
      backupInternet: "Conexión Satelital Starlink",
      tested: true
    },
    payments: ["Binance (USDT)", "Wise", "Deel"],
    skills: ["Python", "PyTorch", "LangChain", "OpenAI API", "Vector DBs", "FastAPI"],
    featuredProject: {
      title: "DocuQuery AI Agent",
      description: "Agente conversacional RAG para consulta y análisis de 100k+ documentos normativos en segundos.",
      demoUrl: "https://docuquery-demo.ai",
      githubUrl: "https://github.com/dayanar/docuquery",
      stars: 112
    },
    endorsements: 52,
    karma: 1250,
    githubUser: "dayanarangel"
  },
  {
    id: "dev-4",
    name: "Gabriel Uzcátegui",
    role: "Cybersecurity Analyst & Ethical Hacker",
    category: "security",
    level: "Senior",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
    city: "Mérida, VE",
    verified: true,
    available: true,
    availabilityText: "Auditorías de Seguridad & Pentesting",
    rate: "$1,800 - $2,600 / mes",
    hourlyRate: "$25 - $38 / hora",
    bio: "Especialista en seguridad ofensiva, pruebas de penetración web/móvil y auditorías de código seguro. Certificaciones OSCP y CEH.",
    setup: {
      power: "Sistema Solar Híbrido 3kW",
      internet: "Fibra Óptica Thundernet 300 Mbps",
      backupInternet: "Línea Digitel LTE 4G",
      tested: true
    },
    payments: ["Binance (USDT)", "Wally Tech", "Deel"],
    skills: ["Pentesting", "OWASP Top 10", "Burp Suite", "Network Security", "Python Security", "Linux Hardening"],
    featuredProject: {
      title: "SecAudit Toolkit",
      description: "Herramienta CLI automatizada para detección de vulnerabilidades y fugas de credenciales en repositorios Git.",
      demoUrl: "https://secaudit-cli.dev",
      githubUrl: "https://github.com/gabrieluz/secaudit",
      stars: 95
    },
    endorsements: 41,
    karma: 780,
    githubUser: "gabrieluz-sec"
  },
  {
    id: "dev-5",
    name: "Carlos Eduardo Silva",
    role: "Junior Full Stack Developer",
    category: "software",
    level: "Junior",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
    city: "Maracaibo, VE",
    verified: true,
    available: true,
    availabilityText: "Buscando 1er Empleo / Pasantía Remota",
    rate: "$600 - $900 / mes",
    hourlyRate: "$8 - $14 / hora",
    bio: "Desarrollador con ganas de aprender y aportar valor. Egresado de proyectos de código abierto creando apps con React y Node.js.",
    setup: {
      power: "UPS ForzA 1200VA + Mini-UPS para Router",
      internet: "Fibra Óptica Airtek 500 Mbps",
      backupInternet: "Línea Digitel LTE",
      tested: true
    },
    payments: ["Binance (USDT)", "Zinli", "Pago Móvil"],
    skills: ["React", "JavaScript", "Node.js", "Express", "Tailwind CSS", "Git"],
    featuredProject: {
      title: "MercadoCriollo",
      description: "Catálogo interactivo para comercios locales con pedidos directos vía WhatsApp.",
      demoUrl: "https://mercadocriollo.web.app",
      githubUrl: "https://github.com/carlossilva/mercadocriollo",
      stars: 18
    },
    endorsements: 12,
    karma: 210,
    githubUser: "carlossilva-dev"
  },
  {
    id: "dev-6",
    name: "Alejandro Miquilena",
    role: "Cloud & DevOps Architect",
    category: "software",
    level: "Senior",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80",
    city: "Valencia, VE",
    verified: true,
    available: true,
    availabilityText: "Consultorías Cloud & Microservicios",
    rate: "$2,200 - $3,000 / mes",
    hourlyRate: "$30 - $45 / hora",
    bio: "Diseño infraestructura escalable en AWS y Google Cloud con Kubernetes y Terraform. Automatización de pipelines CI/CD.",
    setup: {
      power: "Generador silencioso + UPS APC 1500VA",
      internet: "Fibra Óptica Fibex 600 Mbps",
      backupInternet: "Starlink Mini de respaldo",
      tested: true
    },
    payments: ["Binance (USDT)", "Deel", "Wise"],
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Go (Golang)", "PostgreSQL"],
    featuredProject: {
      title: "KubeScale Engine",
      description: "Operador de Kubernetes para autoescalado de microservicios basado en eventos de colas RabbitMQ.",
      demoUrl: "https://kubescale.dev",
      githubUrl: "https://github.com/alemiquilena/kubescale",
      stars: 89
    },
    endorsements: 45,
    karma: 890,
    githubUser: "alemiquilena"
  }
];

export const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Senior UI/UX & Product Designer",
    company: "Fintech Caribe (Remoto)",
    companyLogo: "FC",
    category: "uiux",
    type: "Tiempo Completo",
    juniorFriendly: false,
    isBounty: false,
    salary: "$1,600 - $2,200 / mes",
    paymentMethods: ["Binance USDT", "Deel", "Zinli"],
    tags: ["Figma", "Design Systems", "UX Research", "Mobile UI"],
    location: "Remoto LatAm",
    postedAt: "Hace 1 hora",
    description: "Buscamos un diseñador de producto para liderar la experiencia de usuario de nuestra aplicación financiera móvil y web.",
    verifiedHiring: true
  },
  {
    id: "job-2",
    title: "Ingeniero de Inteligencia Artificial (LLMs & RAG)",
    company: "Cognitive Studio (Miami / Remoto)",
    companyLogo: "CS",
    category: "ai",
    type: "Tiempo Completo",
    juniorFriendly: false,
    isBounty: false,
    salary: "$2,400 - $3,200 / mes",
    paymentMethods: ["Binance USDT", "Wise", "Deel"],
    tags: ["Python", "LangChain", "FastAPI", "Vector DBs"],
    location: "Remoto 100%",
    postedAt: "Hace 3 horas",
    description: "Desarrollo de asistentes de IA conversacionales y pipelines de embeddings para búsqueda semántica empresarial.",
    verifiedHiring: true
  },
  {
    id: "job-3",
    title: "Auditoría de Seguridad Web (Pentesting OWASP)",
    company: "CyberSec LatAm",
    companyLogo: "CS",
    category: "security",
    type: "Micro-Bounty ($)",
    juniorFriendly: false,
    isBounty: true,
    salary: "$350 USDT (Por Auditoría)",
    paymentMethods: ["Binance P2P", "USDT", "Zinli"],
    tags: ["Pentesting", "OWASP", "Burp Suite", "Reporte Ejecutivo"],
    location: "Proyecto Puntual",
    postedAt: "Hace 5 horas",
    description: "Requerimos pentesting de caja gris para una API REST y portal web antes de salir a producción.",
    verifiedHiring: true
  },
  {
    id: "job-4",
    title: "Frontend Developer (React / Next.js)",
    company: "Kubo Apps",
    companyLogo: "KA",
    category: "software",
    type: "Tiempo Completo",
    juniorFriendly: true,
    isBounty: false,
    salary: "$1,200 - $1,700 / mes",
    paymentMethods: ["Binance USDT", "Zinli", "Deel"],
    tags: ["React", "TypeScript", "Tailwind CSS"],
    location: "Remoto",
    postedAt: "Hace 1 día",
    description: "Desarrollo de interfaces modernas, maquetación pixel-perfect desde Figma y consumo de APIs GraphQL.",
    verifiedHiring: true
  }
];

export const INITIAL_SQUADS = [
  {
    id: "squad-1",
    name: "AI-Assistant Criollo — Chatbot Open Source",
    tagline: "Asistente inteligente con IA para trámites y consultas ciudadanas.",
    leader: "Dayana Rangel (AI Lead)",
    category: "Inteligencia Artificial",
    status: "Buscando Miembros",
    currentMembers: 2,
    totalSlots: 4,
    lookingFor: ["1 Diseñador UI/UX (Figma)", "1 Desarrollador Frontend (React)"],
    sprintDuration: "3 Semanas",
    tags: ["Python", "LangChain", "React", "Figma"],
    purpose: "Proyecto interdisciplinario para sumar experiencia real en IA aplicada al portafolio profesional."
  },
  {
    id: "squad-2",
    name: "SafePass — Gestor de Contraseñas Cifrado",
    tagline: "Bóveda de credenciales local con cifrado de grado militar y cero conocimiento.",
    leader: "Gabriel Uzcátegui (SecOps Lead)",
    category: "Ciberseguridad",
    status: "Nuevo Squad",
    currentMembers: 1,
    totalSlots: 4,
    lookingFor: ["1 Desarrollador Mobile (Flutter)", "1 Diseñador UI/UX", "1 Auditor de Código"],
    sprintDuration: "4 Semanas",
    tags: ["Criptografía", "Flutter", "Rust", "UI/UX"],
    purpose: "Aprender prácticas de desarrollo seguro y criptografía en equipo."
  },
  {
    id: "squad-3",
    name: "DesignSystem Ven — Componentes Abiertos",
    tagline: "Librería de componentes UI/UX accesibles y kit de Figma para la comunidad criolla.",
    leader: "Camila Navarro (UI/UX Lead)",
    category: "Diseño UI/UX",
    status: "Sprint en Marcha",
    currentMembers: 2,
    totalSlots: 3,
    lookingFor: ["1 Diseñador de Interacción", "1 Maquetador Web"],
    sprintDuration: "2 Semanas",
    tags: ["Figma", "Design Tokens", "CSS", "Storybook"],
    purpose: "Crear el sistema de diseño estándar de la comunidad tecnológica nacional."
  }
];

export const COMMUNITY_TOPICS = [
  {
    id: "post-1",
    author: "Camila Navarro",
    role: "Lead UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    timeAgo: "Hace 20 min",
    category: "Diseño & Producto",
    title: "¿Cómo estructuran sus entregables de Figma para los desarrolladores frontend?",
    content: "En el squad estamos usando Figma Dev Mode y design tokens organizados. Ha reducido los malentendidos a cero entre diseño y código. ¿Qué metodologías usan ustedes?",
    likes: 42,
    comments: 15,
    tag: "UI/UX"
  },
  {
    id: "post-2",
    author: "Gabriel Uzcátegui",
    role: "Especialista en Ciberseguridad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    timeAgo: "Hace 1 hora",
    category: "Seguridad",
    title: "Alerta: Nuevos ataques de phishing dirigidos a programadores con repositorios falsos",
    content: "Mucho cuidado con las ofertas de trabajo en LinkedIn o Telegram que les piden clonar un repositorio y correr un script de Node para una prueba técnica. Varios traen paquetes maliciosos para robar cookies de sesión y wallets.",
    likes: 89,
    comments: 31,
    tag: "Ciberseguridad"
  },
  {
    id: "post-3",
    author: "Dayana Rangel",
    role: "AI Engineer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    timeAgo: "Hace 3 horas",
    category: "Inteligencia Artificial",
    title: "¿Qué modelos locales (Ollama) están corriendo en sus laptops para desarrollo sin internet?",
    content: "Para cuando hay intermitencias de internet, correr DeepSeek Coder o Llama 3 localmente en la Mac o PC salva el día por completo. ¿Cuál recomiendan para autocompletado rápido?",
    likes: 67,
    comments: 24,
    tag: "IA"
  }
];
