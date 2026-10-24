
export const courses = [
  {
    category: "Software engineering",
    title: "Full Stack Engineering",
    meta: "30 sessions - Guided capstone",
    desc: "Build responsive web applications with React, APIs, MySQL and a Python or Java backend track.",
    short: "Front-end to backend, APIs, databases and AI-assisted development.",
    stack: "HTML5 - CSS3 - JavaScript - React - MySQL - REST APIs - Git - Python/Java",
    accent: "blue",
    icon: "</>",
    studentPrice: "Rs 24,999",
    studentOriginalPrice: "Rs 44,999",
    institutionPrice: "Rs 14,999 / learner",
    institutionOriginalPrice: "Rs 24,999 / learner"
  },
  {
    category: "Data & AI",
    title: "Data Analytics & Data Science",
    meta: "30 sessions - Guided capstone",
    desc: "Turn real-world datasets into business insights with hands-on analytics, visualization and AI.",
    short: "Analytics foundations, Python, SQL, BI dashboards and a guided industry-style project.",
    stack: "Excel - Python - NumPy - Pandas - MySQL - Power BI - Tableau - GenAI",
    accent: "violet",
    icon: "*",
    studentPrice: "Rs 21,999",
    studentOriginalPrice: "Rs 39,999",
    institutionPrice: "Rs 12,999 / learner",
    institutionOriginalPrice: "Rs 21,999 / learner"
  },
  {
    category: "Security & Defense",
    title: "Cybersecurity",
    meta: "30 sessions - Guided capstone",
    desc: "Learn to protect networks, identify vulnerabilities and respond to threats through practical security labs and real-world scenarios.",
    short: "Build security foundations and investigate threats in authorized, isolated lab environments, with a guided security assessment capstone.",
    stack: "Networking - Linux - Python - Wireshark - OWASP Top 10 - Vulnerability assessment - SIEM - Incident response",
    accent: "cyan",
    icon: "shield",
    studentPrice: "Contact for pricing",
    studentOriginalPrice: "4",
    institutionPrice: "Rs 9,999 / learner",
    institutionOriginalPrice: "Rs 17,999 / learner"
  },
  {
    category: "AI & Machine Learning",
    title: "Artificial Intelligence & Machine Learning",
    meta: "30 sessions - Guided capstone",
    desc: "Build intelligent applications using Python, machine learning, deep learning and generative AI through hands-on projects and real-world datasets.",
    short: "From Python foundations to trained models and a deployable AI application.",
    stack: "Python - NumPy - Pandas - Scikit-learn - TensorFlow - Deep learning - Generative AI - Model evaluation",
    accent: "violet",
    icon: "brain",
    studentPrice: "Rs 29,999",
    studentOriginalPrice: "Rs 49,999",
    institutionPrice: "Rs 14,999 / learner",
    institutionOriginalPrice: "Rs 24,999 / learner"
  },
  {
    category: "Cloud & DevOps",
    title: "Cloud Engineering",
    meta: "12 weeks - Hybrid",
    desc: "Build and deploy reliable cloud infrastructure with hands-on labs in Linux, AWS, containers, automation and monitoring.",
    short: "Learn cloud fundamentals, infrastructure automation and deployment workflows through a guided cloud project.",
    stack: "Linux - AWS - Azure fundamentals - Docker - Terraform - CI/CD - Monitoring",
    accent: "cyan",
    icon: "cloud",
    studentPrice: "Rs 34,000",
    studentOriginalPrice: "Rs 19,000",
    institutionPrice: "Rs 19,999 / learner",
    institutionOriginalPrice: "Rs 29,999 / learner"
  },
];


export const interviewPreparation = {
  title: "Interview Preparation Add-on",
  description: "Add career-readiness support to any course and prepare for the conversations that open doors.",
  topics: ["Soft skill training", "Aptitude & reasoning", "Resume and profile review", "Mock interviews"],
};

export const trainers = [
  { slug: "surya", name: "Surya", isLead: true, role: "Cybersecurity & Data Analytics Mentor - Airtel", initials: "S", tone: "blue", image: "/trainer-surya.png", experience: "4+ years", credential: "IBM certified & Microsoft Certified", institutions: "2+ training institutions", specialties: "Cybersecurity, Data Analyst, Data Scientist", learners: "500+ students trained" },
  { slug: "nivetha", name: "Nivetha", isLead: false, role: "Product & Cloud Lead - Blue Yonder", initials: "N", tone: "cyan", image: "/trainer-nivetha.png", experience: "3+ years", credential: "Microsoft Certified", specialties: "Product Engineering, Cloud, Automation" },
  { slug: "mullai", name: "Mullai", isLead: false, role: "Cloud Architect - Munzen", initials: "M", tone: "violet", image: "/trainer-mullai.png", experience: "3+ years", credential: "Microsoft Certified", specialties: "Cloud, DevOps, Infrastructure" },
];

export const faqs = [
  { q: "Is the curriculum the same for students and institutions?", a: "Yes. Every learner follows the same project-led curriculum, trainer standards, and career preparation. Only the enrollment format and pricing change." },
  { q: "What happens after I enroll?", a: "You get a cohort schedule, a learning workspace, trainer office hours, project milestones, and a clear weekly plan from day one." },
  { q: "Do you offer campus and corporate programs?", a: "We do. Partner programs can be run on campus, online, or in a hybrid format, with reporting for placement cells and L&D teams." },
  { q: "Are there any prerequisites?", a: "Most programs start from foundations and build up. A short readiness call helps us place you in the right cohort and pace." },
];

export const outcomes = [
  { value: "92%", label: "completion rate", note: "across the last 12 cohorts" },
  { value: "4.8/5", label: "learner rating", note: "from 1,200+ responses" },
  { value: "3.2x", label: "more interview ready", note: "self-reported confidence lift" },
];

export const studentTestimonials = [
  { quote: "The projects made everything click. I stopped learning tools separately and started thinking like a real analyst.", name: "Priya S.", track: "Data Analytics · Cohort 07", initials: "PS", tone: "bg-[#7c5ce1]" },
  { quote: "My mentor helped me turn a rough idea into a portfolio project I could confidently explain in interviews.", name: "Arjun R.", track: "Full Stack Engineering · Cohort 08", initials: "AR", tone: "bg-[#1c9ac8]" },
  { quote: "The cloud pathway gave me a clear weekly rhythm, practical labs, and the confidence to take on my first deployment.", name: "Meena K.", track: "Cloud Engineering · Cohort 06", initials: "MK", tone: "bg-[#5c9b2f]" },
];
