import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Instagram } from 'lucide-react';
import StoryCard from './components/StoryCard';
import CursorTrail from './components/CursorTrail';
import type { Story } from './types';

// TODO: Replace with Webflow CMS integration
// Fetch from your Webflow blog collection via API
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Woods Hole Film Festival x Protagonist',
    body: 'Featured Story',
    category: 'Film Festival',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'The M.A.D School x Protagonist',
    body: 'Featured Story',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Documenting the greats',
    body: 'Featured Story',
    category: 'Documentary',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  },
];

const navLinks = ["What's our Story", 'What We Do', 'Get in Touch'];

// Animation variants for staggered waterfall effect
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
      when: "beforeChildren" as const
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const // The "Luxury" curve
    }
  }
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Listen for toggle event from Webflow hamburger
    const handleToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.isOpen);
    };

    window.addEventListener('toggleMenu', handleToggle as EventListener);

    return () => {
      window.removeEventListener('toggleMenu', handleToggle as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);

    // Dispatch event to close/reset the Webflow hamburger button
    const closeEvent = new CustomEvent('closeMenu', {
      detail: { isOpen: false }
    });
    window.dispatchEvent(closeEvent);

    // Also try to click the hamburger to reset its animation state
    const hamburger = document.querySelector('.menu-burger') ||
                      document.querySelector('.w-nav-button') ||
                      document.querySelector('.hamburger-trigger') ||
                      document.querySelector('[data-nav-trigger]');

    if (hamburger && hamburger instanceof HTMLElement) {
      hamburger.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Add your newsletter logic here
    setEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#282828] text-[#F9F9F9] overflow-hidden"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
      {/* Cursor Trail Effect */}
      <CursorTrail />

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-8 right-8 z-50 text-[#F9F9F9] hover:text-[#C83C2F] transition-colors duration-300"
        aria-label="Close menu"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      <div className="h-full flex flex-col lg:flex-row">
        {/* Left Column - Navigation */}
        <div className="flex-1 flex flex-col justify-between p-8 lg:p-16 overflow-y-auto">
          {/* Top Section */}
          <div className="space-y-12">
            {/* Logo - TODO: Replace with your actual logo */}
            <div className="mb-12">
              <a href="/" className="inline-block">
                <img
                  src="https://via.placeholder.com/150x40/282828/F9F9F9?text=Protagonist+Ink"
                  alt="Protagonist Ink"
                  className="h-8 lg:h-10"
                />
                {/* Or use text logo: */}
                {/* <h1 className="text-2xl font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Protagonist Ink
                </h1> */}
              </a>
            </div>

            {/* Main Nav Links */}
            <motion.nav
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={link}
                  href="#"
                  className="block text-5xl lg:text-7xl font-serif tracking-tight hover:text-[#C83C2F] transition-colors duration-300"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    paddingLeft: `${index * 2}rem`
                  }}
                  variants={fadeUp}
                >
                  {link}
                </motion.a>
              ))}
            </motion.nav>

            {/* Start Your Journey Button */}
            <motion.div
              className="pt-6"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <a
                href="mailto:hello@protagonist.ink"
                className="group inline-block bg-[#C83C2F] hover:bg-[#A02F23] text-[#F9F9F9] px-8 py-4 rounded-full transition-all duration-300"
                style={{ fontFamily: 'Karla, sans-serif' }}
              >
                <span className="group-hover:hidden">Start Your Journey</span>
                <span className="hidden group-hover:inline">hello@protagonist.ink</span>
              </a>
            </motion.div>
          </div>

          {/* Bottom Right Section - Email Form + Social Icons */}
          <div className="flex items-end justify-end gap-6 mt-12">
            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-xs">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[#F9F9F9]/30 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#C83C2F] transition-colors placeholder:text-[#F9F9F9]/50"
                style={{ fontFamily: 'Karla, sans-serif' }}
              />
            </form>

            {/* Social Icons */}
            <div className="flex gap-4 items-center">
              <a
                href="https://linkedin.com/company/protagonist-ink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F9F9F9] hover:text-[#C83C2F] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://instagram.com/protagonist.ink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F9F9F9] hover:text-[#C83C2F] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Story Cards from Blog CMS */}
        <motion.div
          className="flex-1 overflow-y-auto p-8 lg:p-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col space-y-2">
            {sampleStories.map((story, index) => (
              <motion.div key={story.id} variants={fadeUp}>
                <StoryCard story={story} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
