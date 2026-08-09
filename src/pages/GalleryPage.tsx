import React, { useState, useEffect } from 'react';
import { MediaItem, MediaCategory } from '../types';
import { api } from '../api/client';
import { MediaRenderer } from '../components/MediaRenderer';
import { Film, Image as ImageIcon, Filter, Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');

  const categories: MediaCategory[] = ['All', 'Kalyanam', '28-Kett', 'Corporate', 'Stage Decor', 'Cultural'];

  useEffect(() => {
    setLoading(true);
    api.getMedia(
      selectedCategory === 'All' ? undefined : selectedCategory,
      selectedType === 'all' ? undefined : selectedType
    )
      .then(data => setMediaList(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedType]);

  return (
    <div className="bg-emerald-950 min-h-screen text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multimedia Gallery</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-amber-100">Our Event Showcase</h1>
          <p className="text-sm text-amber-100/70 max-w-2xl mx-auto">
            Browse high-definition photos and video films from Kerala Kalyanam weddings, 28-Kett baby naming ceremonies, royal stage decors, Ila Sadya catering, and corporate galas managed by Symphony Events & Caterers.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-emerald-900/40 p-4 sm:p-6 rounded-2xl border border-amber-500/30 shadow-lg space-y-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest mr-2 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-emerald-950 shadow-md font-bold'
                    : 'bg-emerald-950/80 text-amber-200/80 hover:bg-emerald-800 hover:text-amber-100 border border-amber-500/20'
                }`}
              >
                {cat === 'All' ? 'All Events' : cat}
              </button>
            ))}
          </div>

          {/* Media Type Toggles */}
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-amber-500/10">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                selectedType === 'all'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-amber-200/60 hover:text-amber-200'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                selectedType === 'image'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-amber-200/60 hover:text-amber-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Photos Only
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                selectedType === 'video'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-amber-200/60 hover:text-amber-200'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" /> Videos & Embeds
            </button>
          </div>

        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-amber-200/60 animate-pulse">Loading gallery media items...</div>
        ) : mediaList.length === 0 ? (
          <div className="py-20 text-center bg-emerald-900/20 rounded-2xl border border-amber-500/20 space-y-2">
            <p className="text-amber-300 font-serif text-lg">No media items found in this category.</p>
            <p className="text-xs text-amber-100/60">Try selecting &apos;All Events&apos; or changing your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaList.map((item) => (
              <MediaRenderer key={item._id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
