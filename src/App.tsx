import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { SparklesIcon, MailIcon, LinkedinIcon, InstagramIcon } from './components/Icons';
import { StoryCard } from './components/StoryCard';
import CursorTrail from './components/CursorTrail';
import { generateCreativeStories, MOCK_STORIES } from './services/geminiService';
import { fetchWebflowStories } from './services/webflowService';
import { Story } from './types';

const App = () => {
  // Default to false for Production (Webflow triggers it).
  // If you are previewing locally and see nothing, temporarily change this to true.
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasLoadedCMS, setHasLoadedCMS] = useState(false);

  // --- WEBFLOW EVENT LISTENER ---
  // Webflow hamburger toggles menu state
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleMenu', handleToggle);
    return () => window.removeEventListener('toggleMenu', handleToggle);
  }, []);

  // --- FETCH WEBFLOW CMS STORIES ---
  // Load stories from Webflow CMS when menu opens
  useEffect(() => {
    if (isOpen && !hasLoadedCMS) {
      fetchWebflowStories().then((cmsStories) => {
        if (cmsStories.length > 0) {
          setStories(cmsStories);
          setHasLoadedCMS(true);
          console.log('✅ Loaded stories from Webflow CMS');
        } else {
          console.log('ℹ️ Using fallback mock stories');
        }
      });
    }
  }, [isOpen, hasLoadedCMS]);

  // Hide Webflow page content when menu is open
  useEffect(() => {
    const webflowBody = document.body;
    if (isOpen) {
      // Prevent scrolling
      webflowBody.style.overflow = 'hidden';
      webflowBody.style.position = 'fixed';
      webflowBody.style.width = '100%';
      webflowBody.style.top = '0';

      // Hide all direct children of body except our React root
      Array.from(webflowBody.children).forEach(child => {
        if (child.id !== 'root' && !child.classList.contains('demo-hamburger')) {
          (child as HTMLElement).style.visibility = 'hidden';
        }
      });
    } else {
      // Restore Webflow content
      webflowBody.style.overflow = '';
      webflowBody.style.position = '';
      webflowBody.style.width = '';
      webflowBody.style.top = '';

      Array.from(webflowBody.children).forEach(child => {
        (child as HTMLElement).style.visibility = '';
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);

    // Optional: tell Webflow the menu has closed if you want
    // to wire Lottie/IX back to the burger state.
    window.dispatchEvent(new CustomEvent('menuClosed'));
  };

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

  const categories = [
    "Case Studies",
    "Programs",
    "Arts & Culture"
  ];

  const navItems = [
    { label: "Work with us", href: "#" },
    { label: "Team", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" }
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
      <CursorTrail />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="app-container"
            className="fixed inset-0 z-[9999] bg-brand-dark text-brand-text font-sans overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="absolute top-8 right-12 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 hover:border-white hover:bg-white/5 transition"
            >
              <span className="relative block h-5 w-5">
                <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 bg-white" />
                <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 bg-white" />
              </span>
            </button>

            {/* rest of your content */}
            <div className="relative h-full w-full flex flex-col p-6 md:p-12">

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
              <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 z-10 relative h-full overflow-hidden pt-16 md:pt-24">
              {/* LEFT COLUMN: Categories */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full pb-8">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col space-y-4"
                >
                  {categories.map((category) => (
                    <motion.div
                      key={category}
                      variants={fadeUp}
                      className="block w-fit"
                    >
                      <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-normal tracking-tight leading-[0.95] text-white">
                        {category}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Bottom Navigation */}
                <motion.nav
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-wrap items-center gap-6 mt-auto"
                >
                  {navItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      variants={fadeUp}
                      className="group inline-block cursor-pointer"
                    >
                      <span className="block px-8 py-4 rounded-full text-sm font-medium font-sans text-white bg-white/5 hover:bg-white/10 transition-colors duration-300 border border-white/10 hover:border-white/20">
                        {item.label}
                      </span>
                    </motion.a>
                  ))}
                </motion.nav>
              </div>

              {/* RIGHT COLUMN: Stories Panel */}
              <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
                <motion.button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 right-0 text-[10px] flex items-center gap-2 text-white/40 hover:text-brand-highlightBlue transition-colors font-sans uppercase tracking-[0.2em] cursor-pointer"
                >
                  <SparklesIcon className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Dreaming...' : 'Refresh Stories'}
                </motion.button>

                <div className="w-full max-w-xl bg-white/5 bg-opacity-[0.03] rounded-3xl p-4 lg:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-sm space-y-3">
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
            </main>

            {/* FOOTER: Become a Protagonist */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative z-10 mt-auto pb-6 md:pb-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-12">
                {/* Left: Text and Email Input */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                  <h4 className="text-xs md:text-sm font-sans uppercase tracking-[0.2em] text-white/60 whitespace-nowrap">
                    Become a Protagonist
                  </h4>

                  <div className="relative w-full md:w-auto">
                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full md:w-80 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 text-sm focus:outline-none focus:border-brand-highlightBlue/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Right: Social Icons */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.linkedin.com/company/protagonist-ink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-brand-highlightBlue transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/protagonist.ink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-brand-highlightRed transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
