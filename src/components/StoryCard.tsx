import { ArrowRight } from 'lucide-react';
import type { Story } from '../types';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <a
      href="#"
      className="group flex items-center gap-6 hover:opacity-70 transition-all duration-300 py-4"
    >
      {/* Image - Square/Portrait */}
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
        {story.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#1E3F66]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs text-[#F9F9F9]/60 mb-1"
          style={{ fontFamily: 'Karla, sans-serif' }}
        >
          {story.body}
        </p>
        <h3
          className="text-lg font-light leading-tight"
          style={{ fontFamily: 'Karla, sans-serif' }}
        >
          {story.title}
        </h3>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={24}
        className="flex-shrink-0 text-[#F9F9F9] group-hover:translate-x-2 transition-transform duration-300"
      />
    </a>
  );
}
