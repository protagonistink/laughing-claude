import { ArrowRight } from 'lucide-react';
import type { Story } from '../types';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <a
      href="#"
      className="group flex flex-col hover:opacity-80 transition-opacity duration-300"
    >
      {/* Image - 16:9 aspect ratio for grid */}
      <div className="w-full aspect-video overflow-hidden rounded-lg mb-4">
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
      <div className="flex-1">
        <p
          className="text-xs text-[#F9F9F9]/60 mb-2"
          style={{ fontFamily: 'Karla, sans-serif' }}
        >
          {story.body}
        </p>
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-lg font-light leading-tight flex-1"
            style={{ fontFamily: 'Karla, sans-serif' }}
          >
            {story.title}
          </h3>
          {/* Arrow */}
          <ArrowRight
            size={20}
            className="flex-shrink-0 text-[#F9F9F9] group-hover:translate-x-1 transition-transform duration-300"
          />
        </div>
      </div>
    </a>
  );
}
