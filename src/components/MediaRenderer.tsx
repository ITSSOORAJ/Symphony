import React, { useState } from 'react';
import { Play, Image as ImageIcon, X, ExternalLink, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaRendererProps {
  item: MediaItem;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ item }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
      const videoId = new URLSearchParams(new URL(url).search).get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

  const isDirectVideo = item.url.endsWith('.mp4') || item.url.endsWith('.webm');
  const embedUrl = getEmbedUrl(item.url);

  return (
    <>
      <div 
        onClick={() => setModalOpen(true)}
        className="group relative bg-emerald-950/40 rounded-xl overflow-hidden border border-amber-500/20 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all cursor-pointer transform hover:-translate-y-1"
      >
        {/* Media Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={item.thumbnailUrl || (item.mediaType === 'image' ? item.url : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80')}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

          {/* Media Type Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-sm flex items-center gap-1.5">
            {item.mediaType === 'video' ? (
              <>
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Video</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Photo</span>
              </>
            )}
          </div>

          {/* Category Pill */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500 text-emerald-950 font-bold shadow">
            {item.category}
          </div>

          {/* Play Icon overlay for Videos */}
          {item.mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/90 text-emerald-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-emerald-950 ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="p-4 bg-emerald-950/80 text-amber-50">
          <h3 className="font-serif text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-amber-100/70 mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Lightbox / Embed Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-emerald-950 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-emerald-900 border-b border-amber-500/20 text-amber-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-300">{item.title}</h3>
                <p className="text-xs text-amber-200/70">{item.category} • {item.mediaType.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg bg-emerald-800 text-amber-200 hover:bg-emerald-700 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content Display */}
            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[70vh]">
              {item.mediaType === 'video' ? (
                isDirectVideo ? (
                  <video 
                    src={item.url} 
                    controls 
                    autoPlay 
                    className="w-full max-h-[65vh] object-contain"
                  />
                ) : (
                  <div className="w-full aspect-video">
                    <iframe
                      src={embedUrl}
                      title={item.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full max-h-[65vh] object-contain"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-emerald-950 text-amber-100 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-amber-100/80 leading-relaxed">{item.description || 'Symphony Events Showcase'}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-emerald-900 text-amber-300 text-xs font-semibold hover:bg-emerald-800 border border-amber-500/30 flex items-center gap-1 shrink-0"
              >
                Open Original Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
