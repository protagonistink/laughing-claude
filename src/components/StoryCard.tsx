import React from 'react';
import { motion } from 'framer-motion';
import { Story } from '../types';
import { ArrowIcon } from './Icons';

interface StoryCardProps {
  story: Story;
  index: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, index }) => {
  return (
    <motion.div
      className="group flex items-center gap-5 cursor-pointer w-full p-3 rounded-2xl -mx-3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + (index * 0.15), ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      variants={{
        hover: {
          scale: 1.02,
          y: -2,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
          transition: { duration: 0.3, ease: "easeOut" }
        }
      }}
    >
      {/* Image Container - MOVIE POSTER STYLE (2:3 Aspect Ratio) */}
      <div className="relative overflow-hidden rounded-sm w-16 h-24 sm:w-20 sm:h-28 aspect-[2/3] shrink-0 bg-gray-900 shadow-2xl">
        <motion.img
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          variants={{
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col flex-grow justify-center h-full border-b border-white/10 group-hover:border-transparent pb-4 sm:pb-0 sm:border-none transition-colors duration-300">
        {/* Category Label: Uppercase Sans for better contrast with Serif Title */}
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1 font-sans">{story.category}</span>

        {/* Title: Serif */}
        <h3 className="text-lg sm:text-xl text-brand-text font-serif font-light leading-tight max-w-xs group-hover:text-white transition-colors">
          {story.title}
        </h3>
      </div>

      {/* Arrow Interaction */}
      <motion.div
        className="text-white/30 group-hover:text-brand-highlightRed pr-4"
        variants={{
          hover: { x: 5, color: '#c83c2f' }
        }}
      >
        <ArrowIcon className="w-6 h-6" />
      </motion.div>
    </motion.div>
  );
};

export default StoryCard;
