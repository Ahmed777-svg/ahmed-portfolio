import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowUp,
  CheckCircle2,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  ShieldCheck,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const skills = [
  'C++',
  'Object Oriented Programming',
  'Data Structures',
  'Algorithms',
  'Shell Scripting',
  'Linux Administration',
  'Kali Linux',
  'Red Team Operations',
  'Burp Suite',
  'Wireshark',
  'NMAP',
  'Aircrack-ng',
];

const particles = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61 + 8) % 100}%`,
  delay: `${(index % 7) * -0.7}s`,
  duration: `${7 + (index % 5)}s`,
}));

function useRevealAnimations(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const revealNodes = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.13 },
    );
    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled]);
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${event.clientX}px`;
        dotRef.current.style.top = `${event.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${event.clientX}px`;
        ringRef.current.style.top = `${event.clientY}px`;
      }
    };
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button, input, textarea')) ringRef.current?.classList.add('is-hovering');
    };
    const onOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button, input, textarea')) ringRef.current?.classList.remove('is-hovering');
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return <>
    <div aria-hidden="true" className="cursor-dot" ref={dotRef} />
    <div aria-hidden="true" className="cursor-ring" ref={ringRef} />
  </>;
}

function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  useRevealAnimations(!isLoading);

  useEffect(() => {
    const savedTheme = localStorage.getItem('akm-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
    const timer = window.setTimeout(() => setIsLoading(false), 1250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('akm-theme', theme);
  }, [theme]);

  useEffect(() => {
    const phrases = ['building reliable systems.', 'learning the security mindset.', 'turning logic into momentum.'];
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeout = 0;
    const tick = () => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      setTypedText(phrase.slice(0, characterIndex));
      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        timeout = window.setTimeout(tick, 1900);
        return;
      }
      if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      timeout = window.setTimeout(tick, deleting ? 38 : 72);
    };
    timeout = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const current = sections.reduce((closest, section) => {
        const element = document.getElementById(section);
        if (!element) return closest;
        return element.getBoundingClientRect().top <= window.innerHeight * .35 ? section : closest;
      }, 'home');
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState('sending');
    setFormMessage('');
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const visitorEmail = formData.get('email');
      if (typeof visitorEmail === 'string' && visitorEmail) {
        formData.set('_replyto', visitorEmail);
      }
      formData.set('_subject', 'New portfolio message for Ahmed Khaled Mahmoud');
      const response = await fetch('https://formspree.io/f/mrejbwgg', {
        body: formData,
        headers: { Accept: 'application/json' },
        method: 'POST',
      });
      if (!response.ok) throw new Error('Unable to send');
      form.reset();
      setFormState('success');
      setFormMessage('Signal received. Ahmed will get back to you soon.');
    } catch {
      setFormState('error');
      setFormMessage('The signal dropped. Please try again or use email directly.');
    }
  };

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark');

  if (isLoading) {
    return <div className="loader" aria-label="Loading Ahmed Khaled Mahmoud portfolio">
      <div className="loader-card">
        <div className="loader-mark">AKM</div>
        <div className="loader-line" />
        <div className="loader-label">initializing portfolio.exe</div>
      </div>
    </div>;
  }

  return <div className="portfolio-page">
    <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
    <CustomCursor />
    <header className="site-header">
      <div className="container-wide nav-shell">
        <a className="brand" href="#home" data-testid="link-brand">
          <span className="brand-mark">AK</span>
          <span>Ahmed Khaled</span>
        </a>
        <nav className={`nav-links ${isMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className={`nav-link ${activeSection === item.href.slice(1) ? 'is-active' : ''}`}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
              href={item.href}
              key={item.href}
              onClick={() => setIsMenuOpen(false)}
            >{item.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="icon-button" data-testid="button-theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button aria-expanded={isMenuOpen} aria-label="Toggle navigation menu" className="menu-button" data-testid="button-menu-toggle" onClick={() => setIsMenuOpen((open) => !open)}>
            {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
    </header>

    <main className="site-main">
      <section className="hero" id="home">
        <div className="particle-field" aria-hidden="true">
          {particles.map((particle) => <span className="particle" key={particle.id} style={{ left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration }} />)}
        </div>
        <div className="container-wide hero-grid">
          <div className="hero-copy">
          <div className="hero-kicker reveal">BENHA UNIVERSITY / COMPUTER SCIENCE / 2025—2029</div>
            <h1 className="hero-title reveal stagger-1">
              Ahmed <span className="accent">Khaled</span><span className="violet">Mahmoud.</span>
            </h1>
            <p className="hero-subtitle reveal stagger-2">
              Software Engineer &amp; C++ Developer <span className="typing-caret">{typedText}</span>
            </p>
            <div className="hero-actions reveal stagger-3">
              <a className="button-primary" data-testid="link-view-projects" href="#projects">View my work <ArrowDownRight size={15} /></a>
              <a className="button-ghost" data-testid="link-view-cv" href="/Ahmed_CV.pdf" rel="noreferrer" target="_blank">View CV <ExternalLink size={15} /></a>
              <a className="button-ghost" data-testid="link-download-cv" href="/Ahmed_CV.pdf" download="Ahmed_Khaled_CV.pdf">Download CV <Download size={15} /></a>
            </div>
            <div className="hero-meta reveal stagger-4">
              <span className="availability">Open to meaningful opportunities</span>
              <span className="hero-socials">
                <a aria-label="Ahmed Khaled on GitHub" className="social-link" data-testid="link-github-hero" href="https://github.com/Ahmed777-svg" rel="noreferrer" target="_blank"><Github size={16} /></a>
                <a aria-label="Ahmed Khaled on LinkedIn" className="social-link" data-testid="link-linkedin-hero" href="https://linkedin.com/in/ahmed-khaled-28ab933b4" rel="noreferrer" target="_blank"><Linkedin size={16} /></a>
              </span>
            </div>
          </div>
          <div className="hero-visual reveal stagger-2" aria-label="Portrait of Ahmed Khaled Mahmoud">
            <div className="visual-orbit" />
            <div className="visual-core">
              <img
                alt="Ahmed Khaled Mahmoud in a suit"
                className="visual-image"
                height="310"
                src="/Profile2.jpeg"
                width="310"
              />
            </div>
            <div className="visual-tag tag-top">[ profile.identity ]</div>
            <div className="visual-tag tag-bottom">focus: secure / useful / clear</div>
            <div className="visual-corner">01 / 05</div>
          </div>
        </div>
        <a className="scroll-cue" href="#about">scroll to inspect</a>
      </section>

      <section className="section" id="about">
        <div className="container-wide about-grid">
          <div className="portrait-frame reveal">
            <div className="portrait-inner">
              <img
                alt="Ahmed Khaled Mahmoud standing outdoors"
                className="portrait-image"
                height="340"
                src="/Profile.jpeg"
                width="340"
              />
              <div className="portrait-caption">profile.photo // Ahmed Khaled</div>
            </div>
          </div>
          <div className="about-copy">
            <div className="reveal">
              <div className="eyebrow">01 / about the operator</div>
              <h2 className="section-heading">Curious by nature.<br /><em>Precise by practice.</em></h2>
            </div>
            <p className="reveal stagger-1">I’m Ahmed Khaled Mahmoud, a Computer Science student at Benha University specializing in software engineering, Red Team operations, and Linux system administration. C++ is where I sharpen my thinking; cybersecurity is where I’m learning to apply it with responsibility.</p>
            <p className="reveal stagger-2">I care about dependable software, readable logic, and the small decisions that make a system easier to trust. Through NTI training and the ICPC Benha Community, I’m building a practical foundation across systems, algorithms, and security.</p>
            <div className="info-strip reveal stagger-3">
              <div className="info-item"><span>Based in</span><strong>Qalyubia, Egypt</strong></div>
              <div className="info-item"><span>Education</span><strong>Benha University · CS</strong></div>
              <div className="info-item"><span>Experience</span><strong>NTI · Linux Admin · 2026</strong></div>
            </div>
            <div className="credentials-grid reveal stagger-4">
              <article className="credential-card">
                <span>Experience</span>
                <strong>Linux Administration Specialist Trainee</strong>
                <small>National Telecommunication Institute · 2026</small>
              </article>
              <article className="credential-card">
                <span>Certifications</span>
                <strong>NTI Linux Administration · NTI Soft Skills</strong>
                <small>Cyber Security GDG · C1 English MODLI</small>
              </article>
              <article className="credential-card">
                <span>Activity</span>
                <strong>ICPC Benha Community</strong>
                <small>Competitive Programmer · 2025—Present</small>
              </article>
            </div>
            <div className="reveal stagger-4">
              <a className="social-link" data-testid="link-linkedin-about" href="https://linkedin.com/in/ahmed-khaled-28ab933b4" rel="noreferrer" target="_blank"><Linkedin size={16} /> LinkedIn <ExternalLink size={12} /></a>
              <a className="social-link" data-testid="link-github-about" href="https://github.com/Ahmed777-svg" rel="noreferrer" target="_blank"><Github size={16} /> GitHub <ExternalLink size={12} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section skills-section" id="skills">
        <div className="container-wide skills-layout">
          <div>
            <div className="reveal">
              <div className="eyebrow">02 / working toolkit</div>
              <h2 className="section-heading">The stack is a<br /><em>way of thinking.</em></h2>
              <p className="section-copy" style={{ marginTop: '1.5rem' }}>A practical mix of systems programming, web fundamentals, and the tools that help me see a system from both sides.</p>
            </div>
            <div className="skill-note reveal stagger-2">Currently deepening my understanding of networking, secure development, and the discipline behind a good penetration test.</div>
          </div>
          <div className="skill-cloud reveal stagger-1">
            {skills.map((skill, index) => <span className="skill-badge" data-testid={`badge-skill-${index}`} key={skill}>{skill}</span>)}
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container-wide">
          <div className="projects-header reveal">
            <div>
              <div className="eyebrow">03 / selected builds</div>
              <h2 className="section-heading">Small systems.<br /><em>Serious intent.</em></h2>
            </div>
            <span className="mono" style={{ color: 'var(--ink-soft)', fontSize: '.68rem' }}>projects.log // 01—03</span>
          </div>
          <div className="project-grid">
            <article className="project-card project-featured glass reveal">
              <div>
                <div className="project-index">PROJECT / 001</div>
                <h3 className="project-title">C++ Data Structures &amp; Algorithmic Systems</h3>
                <p className="project-desc">Custom C++ modules implementing linked lists, trees, hash tables, pointers, and memory management algorithms, with a focus on computational complexity and high-performance execution.</p>
              </div>
              <div className="project-footer">
                <div className="project-tags"><span className="project-tag">C++</span><span className="project-tag">Algorithms</span><span className="project-tag">Systems</span></div>
                <a className="project-link" data-testid="link-project-password-checker" href="https://github.com/Ahmed777-svg" rel="noreferrer" target="_blank">inspect repo <ExternalLink size={13} /></a>
              </div>
            </article>
            <article className="project-card project-placeholder glass reveal stagger-1">
              <div className="project-index">PROJECT / 002</div>
              <h3 className="project-title">Password Strength Checker</h3>
              <p className="project-desc">A focused C++ utility that evaluates password quality against practical rules and gives clear feedback instead of hiding behind a single score.</p>
              <span className="project-tag" style={{ width: 'fit-content', marginTop: '1.2rem' }}>C++ / BUILT</span>
            </article>
            <article className="project-card project-placeholder glass reveal stagger-2">
              <div className="project-index">PROJECT / 003</div>
              <h3 className="project-title">Something useful is compiling</h3>
              <p className="project-desc">The next build will be shaped by a real problem, not a tutorial.</p>
              <span className="project-tag" style={{ width: 'fit-content', marginTop: '1.2rem' }}>COMING SOON</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container-wide contact-grid">
          <div className="contact-aside">
            <div className="reveal">
              <div className="eyebrow">04 / open channel</div>
              <h2 className="section-heading">Have a problem<br /><em>worth solving?</em></h2>
              <p className="section-copy">Tell me what you’re working on, what is unclear, or what needs to be made more dependable. I read every message.</p>
            </div>
            <div className="contact-details reveal stagger-2">
              <a className="contact-detail" data-testid="link-contact-email" href="mailto:eng.ahmed.khaleddd@gmail.com"><Mail size={16} /> eng.ahmed.khaleddd@gmail.com</a>
              <a className="contact-detail" data-testid="link-contact-phone" href="tel:+201153051040"><Phone size={16} /> +20 1153051040</a>
              <span className="contact-detail"><MapPin size={16} /> Qalyubia, Egypt</span>
              <span className="contact-detail"><ShieldCheck size={16} /> Response target: 48 hours</span>
            </div>
          </div>
          <form action="https://formspree.io/f/mrejbwgg" className="contact-form glass reveal stagger-1" data-testid="form-contact" method="POST" onSubmit={handle-view-projects" href="#projects">View my work <ArrowDownRight size={15} /></a>
              <a className="button-ghost" data-testid="link-view-cv" href="/Ahmed_Khaled_CV.pdf" rel="noreferrer" target="_blank">View CV <ExternalLink size={15} /></a>
              <a className="button-ghost" data-testid="link-download-cv" href="/Ahmed_Khaled_CV.pdf" download="Ahmed_Khaled_CV.pdf">Download CV <Download size={15} /></a>
            </div>
            <div className="hero-meta reveal stagger-4">
              <span className="availability">Open to meaningful opportunities</span>
              <span className="hero-socials">
                <a aria-label="Ahmed Khaled on GitHub" className="social-link" data-testid="link-github-hero" href="https://github.com/Ahmed777-svg" rel="noreferrer" target="_blank"><Github size={16} /></a>
                <a aria-label="Ahmed Khaled on LinkedIn" className="social-link" data-testid="link-linkedin-hero" href="https://linkedin.com/in/ahmed-khaled-28ab933b4" rel="noreferrer" target="_blank"><Linkedin size={16} /></a>
              </span>
            </div>
          </div>
          <div className="hero-visual reveal stagger-2" aria-label="Portrait of Ahmed Khaled Mahmoud">
            <div className="visual-orbit" />
            <div className="visual-core">
              <img
                alt="Ahmed Khaled Mahmoud in a suit"
                className="visual-image"
                height="310"
                src="/Profile2.jpeg"
                width="310"
              />
            </div>
            <div className="visual-tag tag-top">[ profile.identity ]</div>
            <div className="visual-tag tag-bottom">focus: secure / useful / clear</div>
            <div className="visual-corner">01 / 05</div>
          </div>
        </div>
        <a className="scroll-cue" href="#about">scroll to inspect</a>
      </section>

      <section className="section" id="about">
        <div className="container-wide about-grid">
          <div className="portrait-frame reveal">
            <div className="portrait-inner">
              <img
                alt="Ahmed Khaled Mahmoud standing outdoors"
                className="portrait-image"
                height="340"
                src="/Profile.jpeg"
                width="340"
              />
              <div className="portrait-caption">profile.photo // Ahmed Khaled</div>
            </div>
          </div>
          <div className="about-copy">
            <div className="reveal">
              <div className="eyebrow">01 / about the operator</div>
              <h2 className="section-heading">Curious by nature.<br /><em>Precise by practice.</em></h2>
            </div>
            <p className="reveal stagger-1">I’m Ahmed Khaled Mahmoud, a Computer Science student at Benha University specializing in software engineering, Red Team operations, and Linux system administration. C++ is where I sharpen my thinking; cybersecurity is where I’m learning to apply it with responsibility.</p>
            <p className="reveal stagger-2">I care about dependable software, readable logic, and the small decisions that make a system easier to trust. Through NTI training and the ICPC Benha Community, I’m building a practical foundation across systems, algorithms, and security.</p>
            <div className="info-strip reveal stagger-3">
              <div className="info-item"><span>Based in</span><strong>Qalyubia, Egypt</strong></div>
              <div className="info-item"><span>Education</span><strong>Benha University · CS</strong></div>
              <div className="info-item"><span>Experience</span><strong>NTI · Linux Admin · 2026</strong></div>
            </div>
            <div className="credentials-grid reveal stagger-4">
              <article className="credential-card">
                <span>Experience</span>
                <strong>Linux Administration Specialist Trainee</strong>
                <small>National Telecommunication Institute · 2026</small>
              </article>
              <article className="credential-card">
                <span>Certifications</span>
                <strong>NTI Linux Administration · NTI Soft Skills</strong>
                <small>Cyber Security GDG · C1 English MODLI</small>
              </article>
              <article className="credential-card">
                <span>Activity</span>
                <strong>ICPC Benha Community</strong>
                <small>Competitive Programmer · 2025—Present</small>
              </article>
            </div>
            <div className="reveal stagger-4">
              <a className="social-link" data-testid="link-linkedin-about" href="https://linkedin.com/in/ahmed-khaled-28ab933b4" rel="noreferrer" target="_blank"><Linkedin size={16} /> LinkedIn <ExternalLink size={12} /></a>
              <a className="social-link" data-testid="link-github-about" href="https://github.com/Ahmed777-svg" rel="noreferrer" target="_blank"><Github size={16} /> GitHub <ExternalLink size={12} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section skills-section" id="skills">
        <div className="container-wide skills-layout">
          <div>
            <div className="reveal">
              <div className="eyebrow">02 / working toolkit</div>
              <h2 className="section-heading">The stack is a<br /><em>way of thinking.</em></h2>
              <p className="section-copy" style={{ marginTop: '1.5rem' }}>A practical mix of systems programming, web fundamentals, and the tools that help me see a system from both sides.</p>
            </div>
            <div className="skill-note reveal stagger-2">Currently deepening my understanding of networking, secure development, and the discipline behind a good penetration test.</div>
          </div>
          <div className="skill-cloud reveal stagger-1">
            {skills.map((skill, index) => <span className="skill-badge" data-testid={`badge-skill-${index}`} key={skill}>{skill}</span>)}
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container-wide">
          <div className="projects-header reveal">
            <div>
              <div className="eyebrow">03 / selected builds</div>
              <h2 className="section-heading">Small systems.<br /><em>Serious intent.</em></h2>
            </div>
            <span className="mono" style={{ color: 'var(--ink-soft)', fontSize: '.68rem' }}>projects.log // 01—03</span>
          </div>
          <div className="project-grid">
            <article className="project-card project-featured glass reveal">
              <div>
                <div className="project-index">PROJECT / 001</div>
                <h3 className="project-title">C++ Data Structures &amp; Algorithmic Systems</h3>
                <p className="project-desc">Custom C++ modules implementing linked lists, trees, hash tables, pointers, and memory management algorithms, with a focus on computational complexity and high-performance execution.</p>
              </div>
              <div className="project-footer">
                <div className="project-tags"><span className="project-tag">C++</span><span className="project-tag">Algorithms</span><span className="project-tag">Systems</span></div>
                <a className="project-link" data-testid="link-project-password-checker" href="https://github.com/Ahmed777-svg" rel="noreferrer" target="_blank">inspect repo <ExternalLink size={13} /></a>
              </div>
            </article>
            <article className="project-card project-placeholder glass reveal stagger-1">
              <div className="project-index">PROJECT / 002</div>
              <h3 className="project-title">Password Strength Checker</h3>
              <p className="project-desc">A focused C++ utility that evaluates password quality against practical rules and gives clear feedback instead of hiding behind a single score.</p>
              <span className="project-tag" style={{ width: 'fit-content', marginTop: '1.2rem' }}>C++ / BUILT</span>
            </article>
            <article className="project-card project-placeholder glass reveal stagger-2">
              <div className="project-index">PROJECT / 003</div>
              <h3 className="project-title">Something useful is compiling</h3>
              <p className="project-desc">The next build will be shaped by a real problem, not a tutorial.</p>
              <span className="project-tag" style={{ width: 'fit-content', marginTop: '1.2rem' }}>COMING SOON</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container-wide contact-grid">
          <div className="contact-aside">
            <div className="reveal">
              <div className="eyebrow">04 / open channel</div>
              <h2 className="section-heading">Have a problem<br /><em>worth solving?</em></h2>
              <p className="section-copy">Tell me what you’re working on, what is unclear, or what needs to be made more dependable. I read every message.</p>
            </div>
              <div className="contact-details reveal stagger-2">
              <a className="contact-detail" data-testid="link-contact-email" href="mailto:eng.ahmed.khaleddd@gmail.com"><Mail size={16} /> eng.ahmed.khaleddd@gmail.com</a>
              <a className="contact-detail" data-testid="link-contact-phone" href="tel:+201153051040"><Phone size={16} /> +20 1153051040</a>
              <span className="contact-detail"><MapPin size={16} /> Qalyubia, Egypt</span>
              <span className="contact-detail"><ShieldCheck size={16} /> Response target: 48 hours</span>
            </div>
          </div>
          <form action="https://formspree.io/f/mrejbwgg" className="contact-form glass reveal stagger-1" data-testid="form-contact" method="POST" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <div className="field"><label htmlFor="contact-name">Your name</label><input data-testid="input-contact-name" id="contact-name" name="name" placeholder="How should I address you?" required /></div>
              <div className="field"><label htmlFor="contact-email">Email address</label><input data-testid="input-contact-email" id="contact-email" name="email" placeholder="you@company.com" required type="email" /></div>
            </div>
            <div className="field"><label htmlFor="contact-subject">Subject</label><input data-testid="input-contact-subject" id="contact-subject" name="subject" placeholder="A quick idea, a role, a hard problem..." required /></div>
            <div className="field"><label htmlFor="contact-message">Message</label><textarea data-testid="input-contact-message" id="contact-message" name="message" placeholder="Give me the context. I’ll bring the curiosity." required /></div>
            {formMessage && <div className={`form-message ${formState}`} role="status">{formState === 'success' ? <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '.45rem', verticalAlign: 'middle' }} /> : null}{formMessage}</div>}
            <button className="button-primary form-submit" data-testid="button-contact-submit" disabled={formState === 'sending'} type="submit">{formState === 'sending' ? 'Transmitting...' : 'Send signal'} {formState === 'sending' ? <Terminal size={15} /> : <Send size={15} />}</button>
          </form>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="container-wide footer-inner">
        <span className="footer-copy">© {new Date().getFullYear()} Ahmed Khaled Mahmoud. Built with intent.</span>
        <span className="footer-mark">AKM / 05</span>
        <button className="back-top" data-testid="button-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>back to top <ArrowUp size={13} /></button>
      </div>
    </footer>
  </div>;
}

function Home() {
  return <Portfolio />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
