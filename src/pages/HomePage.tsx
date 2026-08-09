import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Heart, Utensils, Music, Camera, Award, Calendar, 
  MapPin, CheckCircle2, Star, ArrowRight, Flower2, Shield, Flame
} from 'lucide-react';
import { MediaItem } from '../types';
import { api } from '../api/client';
import { MediaRenderer } from '../components/MediaRenderer';

export const HomePage: React.FC = () => {
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  // Quick Estimate State
  const [calcEventType, setCalcEventType] = useState('Kalyanam (Wedding)');
  const [calcGuests, setCalcGuests] = useState(500);
  const [calcDecor, setCalcDecor] = useState(true);
  const [calcSadya, setCalcSadya] = useState(true);
  const [calcAV, setCalcAV] = useState(false);
  const [calcPhoto, setCalcPhoto] = useState(true);

  useEffect(() => {
    api.getMedia()
      .then(data => {
        setFeaturedMedia(data.slice(0, 3));
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingMedia(false));
  }, []);

  // Quick Estimate Calculation
  const calculateEstimate = () => {
    let base = 50000;
    if (calcEventType.includes('Kalyanam')) base = 120000;
    if (calcEventType.includes('28-Kett')) base = 40000;
    if (calcEventType.includes('Corporate')) base = 80000;

    let foodCost = calcSadya ? calcGuests * 250 : 0;
    let decorCost = calcDecor ? 65000 : 0;
    let avCost = calcAV ? 35000 : 0;
    let photoCost = calcPhoto ? 45000 : 0;

    return base + foodCost + decorCost + avCost + photoCost;
  };

  const servicesList = [
    {
      title: 'Kalyanam & Stage Decor',
      subtitle: 'Traditional Marigold, Jasmine & Kasavu Mandapams',
      desc: 'Custom-designed wedding stages, entrance floral arches, traditional brass Nilavilakku illuminations, and royal mandapams.',
      icon: Heart,
      bg: 'from-amber-900/40 to-emerald-950/80',
    },
    {
      title: 'Authentic 28-Item Ila Sadya',
      subtitle: 'Pure Traditional Kerala Feast Serving',
      desc: 'Master chefs preparing authentic Kerala Ila Sadya with Avial, Payasam, Thoran, Sambar, and royal banquet management.',
      icon: Utensils,
      bg: 'from-emerald-900/40 to-emerald-950/80',
    },
    {
      title: 'Sound, Lights & LED Wall',
      subtitle: 'Intelligent Stage Lighting & Audio',
      desc: 'High-power JBL sound systems, intelligent moving head stage lights, and high-resolution 4K outdoor LED video screens.',
      icon: Music,
      bg: 'from-amber-950/40 to-emerald-950/80',
    },
    {
      title: 'Photography & Drone Clips',
      subtitle: 'Candid Film & 4K Aerial Coverage',
      desc: 'Award-winning wedding videography team capturing candid moments, cinematic teaser films, and 4K aerial drone views.',
      icon: Camera,
      bg: 'from-emerald-900/40 to-emerald-950/80',
    },
  ];

  const culturalCategories = [
    { name: 'Kalyanam (Weddings)', desc: 'Grand traditional and destination wedding celebrations across Kerala venues.', count: '500+ Hosted' },
    { name: '28-Kett (Naming)', desc: 'Warm, memorable baby naming ceremonies with floral cradle decors.', count: '250+ Hosted' },
    { name: 'Corporate & Tech Galas', desc: 'Annual excellence awards, product launches, and company galas.', count: '180+ Hosted' },
    { name: 'Cultural Festivals', desc: 'Chenda Melam processions, Panchavadyam, and classical dance stage setups.', count: '300+ Hosted' },
  ];

  return (
    <div className="bg-[#0A0A0A] text-[#E5E5E5] min-h-screen">
      
      {/* Hero Bento Header & Grid Section */}
      <section className="relative pt-12 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Bento Hero Banner Card */}
        <div className="bento-card relative overflow-hidden p-8 sm:p-14 border border-white/10">
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
              <Flower2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
              <span>Pan-Kerala Event Architects</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold serif text-white tracking-tight leading-tight">
              Crafting Unforgettable <span className="gold-text">Kerala Celebrations</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              From regal Kasavu Kalyanam mandapams and authentic 28-item Ila Sadya banquets to intimate 28-Kett baby naming ceremonies and high-tech corporate galas across Kochi, Trivandrum, Thrissur & all 14 districts.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                to="/book"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#D4AF37] text-black font-bold text-xs rounded-full shadow-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-2.5"
              >
                <Calendar className="w-4 h-4 text-black" />
                Book Your Event Date
              </Link>

              <Link
                to="/gallery"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-full border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Explore Event Showcase
              </Link>
            </div>
          </div>
        </div>

        {/* Bento Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bento-card p-6 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-white/40">Hosted Events</span>
            <div className="mt-4">
              <p className="text-3xl font-bold serif gold-text">1,200+</p>
              <p className="text-[11px] text-white/60 mt-1">Across 14 Kerala Districts</p>
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-white/40">Authentic Sadya</span>
            <div className="mt-4">
              <p className="text-3xl font-bold serif text-white">28 Item</p>
              <p className="text-[11px] text-white/60 mt-1">Traditional Banana Leaf Feast</p>
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-white/40">Custom Tailored</span>
            <div className="mt-4">
              <p className="text-3xl font-bold serif text-white">100%</p>
              <p className="text-[11px] text-white/60 mt-1">Bespoke Decor & Management</p>
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-white/40">Client Rating</span>
            <div className="mt-4">
              <p className="text-3xl font-bold serif gold-text">4.9 ★</p>
              <p className="text-[11px] text-white/60 mt-1">500+ Verified Reviews</p>
            </div>
          </div>
        </div>

      </section>

      {/* Cultural Event Categories - Asymmetric Bento Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest gold-text">Cultural & Modern Themes</span>
            <h2 className="text-2xl sm:text-3xl font-bold serif text-white mt-1">Specialized Kerala Event Management</h2>
          </div>
          <p className="text-xs text-white/60 max-w-md">Combining deep cultural Kerala traditions with modern event aesthetics and seamless execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {culturalCategories.map((cat, idx) => (
            <div 
              key={idx}
              className="bento-card p-6 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center font-bold text-xs font-mono group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold serif text-white group-hover:text-[#D4AF37] transition-colors">{cat.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-6 text-xs font-semibold gold-text">
                <span>{cat.count}</span>
                <Link to="/book" className="flex items-center gap-1 hover:underline">
                  Book <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specialized Services Detail - Bento Card Arrangement */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest gold-text">In-House Solutions</span>
              <h2 className="text-2xl sm:text-3xl font-bold serif text-white">Everything Your Celebration Needs</h2>
            </div>
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2 self-start lg:self-auto"
            >
              Get Instant Quote <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicesList.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div 
                  key={idx}
                  className="bento-card p-8 space-y-4 hover:border-[#D4AF37]/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold serif text-white">{srv.title}</h3>
                    <p className="text-xs font-semibold gold-text mt-0.5">{srv.subtitle}</p>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{srv.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Featured Multimedia Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold gold-text uppercase tracking-widest">Media Gallery</span>
            <h2 className="text-2xl font-bold serif text-white mt-1">Featured Event Highlights</h2>
          </div>
          <Link to="/gallery" className="text-xs gold-text hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingMedia ? (
          <div className="py-12 text-center text-white/40 animate-pulse text-xs">Loading event gallery...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMedia.map(item => (
              <div key={item._id} className="bento-card overflow-hidden p-2">
                <MediaRenderer item={item} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Quick Budget Estimator - Bento Form Card */}
      <section className="py-16 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bento-card p-8 sm:p-10 space-y-8 border-white/15">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest gold-text">Instant Cost Estimator</span>
              <h3 className="text-2xl font-bold serif text-white">Estimate Your Kerala Event Budget</h3>
              <p className="text-xs text-white/60">Configure your parameters for an instant estimated package cost.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">Event Type</label>
                  <select
                    value={calcEventType}
                    onChange={(e) => setCalcEventType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Kalyanam (Wedding)" className="bg-[#141414]">Kalyanam (Wedding)</option>
                    <option value="28-Kett (Naming)" className="bg-[#141414]">28-Kett (Baby Naming)</option>
                    <option value="Corporate Party" className="bg-[#141414]">Corporate Party / Award Night</option>
                    <option value="Birthday Party" className="bg-[#141414]">Birthday Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-2">
                    Guest Count: <span className="gold-text font-bold">{calcGuests} Guests</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={calcGuests}
                    onChange={(e) => setCalcGuests(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/80 mb-2">Services Included</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${calcDecor ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                    <input type="checkbox" checked={calcDecor} onChange={(e) => setCalcDecor(e.target.checked)} className="hidden" />
                    <span>Stage Decor</span>
                  </label>
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${calcSadya ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                    <input type="checkbox" checked={calcSadya} onChange={(e) => setCalcSadya(e.target.checked)} className="hidden" />
                    <span>Ila Sadya</span>
                  </label>
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${calcAV ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                    <input type="checkbox" checked={calcAV} onChange={(e) => setCalcAV(e.target.checked)} className="hidden" />
                    <span>Sound & Lights</span>
                  </label>
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${calcPhoto ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                    <input type="checkbox" checked={calcPhoto} onChange={(e) => setCalcPhoto(e.target.checked)} className="hidden" />
                    <span>Candid & Drone</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Estimated Total Display */}
            <div className="p-6 rounded-2xl bg-white/5 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider gold-text">Estimated Package Total</p>
                <p className="text-2xl font-bold serif gold-text mt-0.5">
                  ₹{calculateEstimate().toLocaleString('en-IN')} <span className="text-[10px] font-normal text-white/50">(approx GST incl.)</span>
                </p>
              </div>
              <Link
                to="/book"
                className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-full text-xs shadow hover:bg-amber-400 transition-all shrink-0"
              >
                Proceed to Book Package
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 text-center space-y-6 max-w-xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold serif text-white">Ready to Plan Your Dream Celebration?</h2>
        <p className="text-xs text-white/60">Connect with our Kerala event management architects today to reserve your preferred date.</p>
        <div>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-black font-bold text-xs rounded-full shadow-lg hover:bg-amber-400 transition-all"
          >
            Start Booking Form <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
