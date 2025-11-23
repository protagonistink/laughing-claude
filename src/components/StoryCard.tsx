import { ArrowRight } from 'lucide-react';
import type { Story } from '../types';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <a
      href="#"
      className="group flex items-center gap-6 hover:opacity-80 transition-opacity duration-300"
    >
      {/* Image - 2:3 aspect ratio */}
      <div className="flex-shrink-0 w-24 h-36 overflow-hidden rounded-lg">
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
          className="text-lg font-light leading-tight truncate"
          style={{ fontFamily: 'Karla, sans-serif' }}
        >
          {story.title}
        </h3>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={20}
        className="flex-shrink-0 text-[#F9F9F9] group-hover:translate-x-1 transition-transform duration-300"
      />
    </a>
  );
}
