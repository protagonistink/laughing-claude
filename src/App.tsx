import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import StoryCard from './components/StoryCard';
import type { Story } from './types';

const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Woods Hole Film Festival x COLLINS',
    body: 'Story',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'The M.A.D School x COLLINS',
    body: 'Story',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Documenting the greats',
    body: 'Story',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  },
];

const navLinks = ['Case Studies', 'Programs', 'Arts & Culture'];
const bottomLinks = ['Work with us', 'Team', 'Careers', 'Press'];

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

          {/* Bottom Section */}
          <div className="mt-12 space-y-8">
            {/* Secondary Nav */}
            <nav className="flex flex-wrap gap-6 text-sm">
              {bottomLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-[#C83C2F] transition-colors duration-300"
                  style={{ fontFamily: 'Karla, sans-serif' }}
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Newsletter */}
            <div>
              <p className="text-sm mb-3" style={{ fontFamily: 'Karla, sans-serif' }}>
                Keep up to date
              </p>
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border border-[#F9F9F9]/30 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#C83C2F] transition-colors"
                    style={{ fontFamily: 'Karla, sans-serif' }}
                  />
                </div>
              </form>
            </div>

            {/* Social Links */}
            <nav className="flex gap-6 text-sm">
              <a
                href="#"
                className="hover:text-[#C83C2F] transition-colors duration-300"
                style={{ fontFamily: 'Karla, sans-serif' }}
              >
                X (Twitter)
              </a>
              <a
                href="#"
                className="hover:text-[#C83C2F] transition-colors duration-300"
                style={{ fontFamily: 'Karla, sans-serif' }}
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="hover:text-[#C83C2F] transition-colors duration-300"
                style={{ fontFamily: 'Karla, sans-serif' }}
              >
                Instagram
              </a>
            </nav>
          </div>
        </div>

        {/* Right Column - Story Cards */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-16 space-y-6">
          {sampleStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
