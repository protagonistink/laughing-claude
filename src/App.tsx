import { useState, useEffect } from 'react';
import { X, Linkedin, Instagram } from 'lucide-react';
import StoryCard from './components/StoryCard';
import type { Story } from './types';

// TODO: Replace with Webflow CMS integration
// Fetch from your Webflow blog collection via API
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Woods Hole Film Festival x Protagonist',
    body: 'Featured Story',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'The M.A.D School x Protagonist',
    body: 'Featured Story',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Documenting the greats',
    body: 'Featured Story',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  },
];

const navLinks = ["What's our Story", 'What We Do', 'Get in Touch'];

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Add your newsletter logic here
    setEmail('');
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#282828] text-[#F9F9F9] overflow-hidden">
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
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-5xl lg:text-7xl font-serif tracking-tight hover:text-[#C83C2F] transition-colors duration-300"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Start Your Journey Button */}
            <div className="pt-6">
              <a
                href="mailto:hello@protagonist.ink"
                className="group inline-block bg-[#C83C2F] hover:bg-[#A02F23] text-[#F9F9F9] px-8 py-4 rounded-full transition-all duration-300"
                style={{ fontFamily: 'Karla, sans-serif' }}
              >
                <span className="group-hover:hidden">Start Your Journey</span>
                <span className="hidden group-hover:inline">hello@protagonist.ink</span>
              </a>
            </div>
          </div>

          {/* Bottom Right Section - Email Form + Social Icons */}
          <div className="flex items-end justify-between gap-8 mt-12">
            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="flex-1 max-w-sm">
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
        <div className="flex-1 overflow-y-auto p-8 lg:p-16 space-y-6">
          {sampleStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
