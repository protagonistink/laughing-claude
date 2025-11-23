import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MailIcon, SparklesIcon, LinkedinIcon, InstagramIcon } from './components/Icons';
import { StoryCard } from './components/StoryCard';
import CursorTrail from './components/CursorTrail';
import { generateCreativeStories, MOCK_STORIES } from './services/geminiService';
import { Story } from './types';

const App = () => {
  // Default to false for Production (Webflow triggers it).
  // If you are previewing locally and see nothing, change this to true.
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');

  // Interaction States
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isWorkHovered, setIsWorkHovered] = useState(false);

  // --- WEBFLOW EVENT LISTENER ---
  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
    };

    window.addEventListener('toggleMenu', handleToggle as EventListener);
    return () => window.removeEventListener('toggleMenu', handleToggle as EventListener);
  }, []);



  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const newStories = await generateCreativeStories();
      setStories(newStories);
    } finally {
      setIsGenerating(false);
    }
  };

  const navItems = [
    { label: "What's our Story", href: "#" },
    { label: "What We Do", href: "#" },
    { label: "Get in Touch", href: "#" }
  ];

  // Animation Variants
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
      <CursorTrail />

      {/* CUSTOM HAMBURGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-[2147483647] p-2 group text-white pointer-events-auto drop-shadow-lg"
        aria-label="Toggle Menu"
        style={{ cursor: 'pointer' }}
      >
        <div className="relative w-8 h-6 flex flex-col justify-between items-center">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 11 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-white block transition-all duration-300 origin-center shadow-sm"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-full h-0.5 bg-white block transition-all duration-300 shadow-sm"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -11 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-white block transition-all duration-300 origin-center shadow-sm"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="app-container"
            // Fixed background color to bg-brand-dark
            className="fixed inset-0 min-h-screen w-full bg-brand-dark text-brand-text font-sans overflow-hidden z-[9999] flex flex-col p-6 md:p-12 cursor-none pointer-events-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-highlightBlue/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-highlightRed/5 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none z-0" />

            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }} />

            {/* HEADER REMOVED - Handled by Webflow */}

            {/* MAIN GRID */}
            {/* Added pt-32 to push content down below Webflow header */}
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 z-10 relative h-full overflow-hidden pt-32">

              {/* LEFT COLUMN: Main Navigation */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <motion.nav
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col mb-16"
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {navItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      variants={fadeUp}
                      className="group block w-fit cursor-none relative"
                      onMouseEnter={() => setHoveredNav(item.label)}
                      animate={{
                        opacity: hoveredNav && hoveredNav !== item.label ? 0.3 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span
                        // Updated to lg:text-9xl and leading-[0.9] for massive cinematic typography
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
                  <motion.a
                    href="mailto:hello@protagonist.ink"
                    layout
                    variants={fadeUp}
                    onMouseEnter={() => setIsWorkHovered(true)}
                    onMouseLeave={() => setIsWorkHovered(false)}
                    className="bg-brand-highlightRed text-white px-10 py-5 rounded-full text-sm font-bold font-sans tracking-wide hover:bg-[#A02F23] transition-colors relative overflow-hidden min-w-[220px] text-center flex justify-center items-center shadow-[0_0_20px_rgba(200,60,47,0.2)] hover:shadow-[0_0_25px_rgba(200,60,47,0.4)] cursor-none"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isWorkHovered ? (
                        <motion.span
                          key="email"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
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
                        >
                          Start Your Journey
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.a>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Stories List */}
              {/* Hidden on tablet/mobile */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-4 md:space-y-6 relative">
                <motion.button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-16 right-0 text-[10px] flex items-center gap-2 text-white/40 hover:text-brand-highlightBlue transition-colors font-sans uppercase tracking-[0.2em] cursor-none"
                >
                  <SparklesIcon className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Dreaming...' : 'Refresh Stories'}
                </motion.button>

                <AnimatePresence mode="wait">
                  {stories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <StoryCard story={story} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </main>

            {/* FOOTER */}
            {/* Moved to bottom right: justify-end items-end */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 flex flex-col md:flex-row justify-end items-end gap-8 md:gap-12 border-t border-white/5 pt-6 relative z-10 shrink-0"
            >

              {/* Newsletter */}
              <div className="hidden md:flex w-full md:w-auto flex-col items-end">
                <p className="text-xs uppercase tracking-widest mb-4 text-white/50 font-sans">Become a Protagonist</p>
                <div className="relative w-full md:w-80">
                  <MailIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-transparent border-b border-white/20 rounded-none py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-highlightRed transition-colors placeholder:text-white/20 font-sans cursor-none text-right md:text-left"
                  />
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-6 text-white/60 items-center pb-3 w-full md:w-auto justify-end">
                <a href="https://linkedin.com/company/protagonistink" target="_blank" className="hover:text-brand-highlightBlue transition-colors hover:scale-110 transform duration-200 cursor-none">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/protagonist.ink" target="_blank" className="hover:text-brand-highlightBlue transition-colors hover:scale-110 transform duration-200 cursor-none">
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
