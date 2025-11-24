import React from 'react';
import { Story } from '../types';
import { ArrowIcon } from './Icons';

interface StoryCardProps {
  story: Story;
  index: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, index }) => {
  return (
    <article className="flex items-center gap-4 rounded-3xl bg-brand-surface/80 p-4 shadow-lg">
      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-black/30 flex-shrink-0">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          {story.category}
        </p>
        <h3 className="text-sm leading-snug text-white">
          {story.title}
        </h3>
      </div>
      <div className="text-white/30">
        <ArrowIcon className="w-4 h-4" />
      </div>
    </article>
  );
};

export default StoryCard;
