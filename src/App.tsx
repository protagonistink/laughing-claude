import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MailIcon, LinkedinIcon, InstagramIcon } from './components/Icons';
import { StoryCard } from './components/StoryCard';
import CursorTrail from './components/CursorTrail';
import { MOCK_STORIES } from './services/geminiService';
import { fetchWebflowStories } from './services/webflowService';
import { Story } from './types';

const App = () => {
  // Default to false for Production (Webflow triggers it).
  // If you are previewing locally and see nothing, temporarily change this to true.
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [email, setEmail] = useState('');

  // Interaction States
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isWorkHovered, setIsWorkHovered] = useState(false);

  // --- WEBFLOW EVENT LISTENER ---
  // Webflow hamburger toggles menu state
  useEffect(() => {
    const handleToggle = () => {
      console.log('🎯 React: toggleMenu event received');
      setIsOpen(prev => {
        console.log('🎯 React: Menu state changing from', prev, 'to', !prev);
        return !prev;
      });
    };

    console.log('🎯 React: Menu component mounted, listening for toggleMenu events');
    window.addEventListener('toggleMenu', handleToggle);
    return () => window.removeEventListener('toggleMenu', handleToggle);
  }, []);

  // Fetch Stories from Webflow on Mount
  useEffect(() => {
    const loadStories = async () => {
      const webflowStories = await fetchWebflowStories();
      setStories(webflowStories);
    };
    loadStories();
  }, []);

  // Lock Body Scroll when Menu is Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Keep the hamburger visible and clickable - it's now an X to close
      const hamburger = document.querySelector('.menu-burger-light') ||
                        document.querySelector('.menu-burger') ||
                        document.querySelector('.w-nav-button') ||
                        document.querySelector('.hamburger-trigger') ||
                        document.querySelector('[data-nav-trigger]');
      if (hamburger && hamburger instanceof HTMLElement) {
        // Make sure it stays on top and clickable
        hamburger.style.zIndex = '10001';
        hamburger.style.pointerEvents = 'auto';
      }
    } else {
      document.body.style.overflow = '';
      // Reset hamburger z-index when menu closes
      const hamburger = document.querySelector('.menu-burger-light') ||
                        document.querySelector('.menu-burger') ||
                        document.querySelector('.w-nav-button') ||
                        document.querySelector('.hamburger-trigger') ||
                        document.querySelector('[data-nav-trigger]');
      if (hamburger && hamburger instanceof HTMLElement) {
        hamburger.style.zIndex = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('closeMenu'));
  };

  const navItems = [
    { label: "Our Story", href: "/about" },
    { label: "What We Do", href: "/whatwedo" },
    { label: "Get in Touch", href: "/contact" }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { y: '-100%' },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }
    },
    exit: {
      y: '-100%',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="app-container"
            className="fixed inset-0 min-h-screen w-full bg-brand-dark text-brand-text font-sans z-[9999] flex flex-col p-4 md:p-8 lg:p-12 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            {/* Cursor Trail - Only on menu overlay */}
            <CursorTrail />

            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-highlightBlue/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-highlightRed/5 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none z-0" />

            {/* BACKGROUND TEXTURE */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />

            {/* MAIN GRID */}
            {/* pt-24/pt-32 to clear the Webflow navbar - reduced on smaller screens */}
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 z-10 relative pt-24 lg:pt-32 pb-8">
              {/* LEFT COLUMN: Main Navigation */}
              <div className="lg:col-span-7 flex flex-col justify-start">
                <motion.nav
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col mb-8 lg:mb-16"
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {navItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      variants={fadeUp}
                      className="group block w-fit cursor-pointer relative pointer-events-auto"
                      onMouseEnter={() => setHoveredNav(item.label)}
                      onClick={() => {
                        // Close menu and let link navigate
                        handleClose();
                      }}
                      animate={{
                        opacity: hoveredNav && hoveredNav !== item.label ? 0.3 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span
                        className="block text-5xl md:text-7xl lg:text-9xl font-serif font-medium tracking-tighter leading-[0.9] text-white transition-colors duration-300 group-hover:text-brand-highlightRed pb-2"
                      >
                        {item.label}
                      </span>
                    </motion.a>
                  ))}
                </motion.nav>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-wrap items-center gap-8 pl-1"
                >
                  {/* Main CTA Button */}
                  <motion.a
                    href="mailto:hello@protagonist.ink"
                    layout
                    variants={fadeUp}
                    onMouseEnter={() => setIsWorkHovered(true)}
                    onMouseLeave={() => setIsWorkHovered(false)}
                    className="bg-brand-highlightRed text-white px-10 py-5 rounded-full text-sm font-bold font-sans tracking-wide hover:bg-[#A02F23] transition-colors relative overflow-hidden min-w-[220px] text-center flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(200,60,47,0.2)] hover:shadow-[0_0_25px_rgba(200,60,47,0.4)] cursor-pointer"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isWorkHovered ? (
                        <motion.span
                          key="email"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[#f9f9f9]"
                        >
                          hello@protagonist.ink
                        </motion.span>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2"
                        >
                          Write your story
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.a>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Stories (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-5 relative">
                {/* Centered Stories Panel */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full max-w-xl bg-white/5 bg-opacity-[0.03] rounded-3xl p-6 lg:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-sm space-y-4 pointer-events-auto">
                    <AnimatePresence mode="wait">
                      {stories.map((story, index) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.08 }}
                        >
                          <StoryCard story={story} index={index} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </main>

            {/* FOOTER */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 lg:mt-8 flex flex-col md:flex-row justify-end items-end gap-4 md:gap-12 border-t border-white/5 pt-4 lg:pt-6 relative z-10 shrink-0"
            >
              {/* Newsletter */}
              <div className="hidden md:flex w-full md:w-auto flex-row items-center gap-6">
                <p className="text-xs uppercase tracking-widest text-white/50 font-sans whitespace-nowrap">
                  Become a Protagonist
                </p>
                <div className="relative w-full md:w-80">
                  <MailIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-transparent border-b border-white/20 rounded-none py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-highlightRed transition-colors placeholder:text-white/20 font-sans cursor-text text-right md:text-left"
                  />
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-6 text-white/60 items-center pb-3 w-full md:w-auto justify-end">
                <a
                  href="https://linkedin.com/company/protagonistink"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-highlightBlue transition-colors hover:scale-110 transform duration-200 cursor-pointer"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/protagonist.ink"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-highlightBlue transition-colors hover:scale-110 transform duration-200 cursor-pointer"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
