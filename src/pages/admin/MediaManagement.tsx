import React, { useState, useEffect } from 'react';
import { MediaItem, MediaCategory, MediaType } from '../../types';
import { api } from '../../api/client';
import { Plus, Trash2, Film, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';

export const MediaManagement: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Media Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MediaCategory>('Kalyanam');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMedia = () => {
    setLoading(true);
    api.getMedia()
      .then(data => setMediaItems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    setIsSubmitting(true);
    try {
      await api.createMedia({
        title,
        category,
        mediaType,
        url,
        thumbnailUrl: thumbnailUrl || undefined,
        description: description || undefined,
      });
      setTitle('');
      setUrl('');
      setThumbnailUrl('');
      setDescription('');
      setShowForm(false);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Failed to add media link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media item from gallery?')) return;
    try {
      await api.deleteMedia(id);
      fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Failed to delete media item');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CMS Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-900/40 p-5 rounded-2xl border border-amber-500/20">
        <div>
          <h3 className="font-serif font-bold text-lg text-amber-300">Gallery Media CMS</h3>
          <p className="text-xs text-amber-100/70">Manage photos, YouTube embeds, and video links displayed on the public gallery.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-amber-500 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-amber-400 shadow"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel Add Form' : 'Add New Photo / Video'}
        </button>
      </div>

      {/* Add Media Form Drawer */}
      {showForm && (
        <form onSubmit={handleAddMedia} className="bg-emerald-900/50 p-6 rounded-2xl border border-amber-500/30 space-y-4">
          <h4 className="text-sm font-serif font-bold text-amber-300">Add New Showcase Item</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Royal Kasavu Mandapam"
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              >
                <option value="Kalyanam">Kalyanam</option>
                <option value="28-Kett">28-Kett</option>
                <option value="Corporate">Corporate</option>
                <option value="Stage Decor">Stage Decor</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Media Format *</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaType)}
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              >
                <option value="image">Photo / Image URL</option>
                <option value="video">Video (YouTube / Vimeo / MP4)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Media URL * (Image or Video Link)</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={mediaType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://images.unsplash.com/...'}
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Thumbnail Cover URL (Optional for videos)</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Traditional marigold and jasmine entrance floral decor..."
              className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-amber-500 text-emerald-950 font-bold text-xs rounded-xl hover:bg-amber-400 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Save Media Item'}
            </button>
          </div>
        </form>
      )}

      {/* Media Items Table / Grid */}
      {loading ? (
        <div className="py-12 text-center text-amber-200/60 animate-pulse">Loading gallery items...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item._id}
              className="bg-emerald-900/30 p-4 rounded-2xl border border-amber-500/20 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{item.category}</span>
                  <span className="text-amber-200/60 uppercase font-bold flex items-center gap-1">
                    {item.mediaType === 'video' ? <Film className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
                    {item.mediaType}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-amber-100">{item.title}</h4>
                <p className="text-xs text-amber-100/70 line-clamp-2">{item.description || 'No description provided'}</p>
              </div>

              <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between text-xs">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" /> Open Link
                </a>
                <button
                  onClick={() => handleDeleteMedia(item._id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg"
                  title="Delete media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
