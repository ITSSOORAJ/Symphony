import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, Award, ShieldCheck } from 'lucide-react';
import { SymphonyLogo } from './SymphonyLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white/70 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <SymphonyLogo showText size="lg" />
            <p className="text-xs leading-relaxed text-white/60">
              Kerala&apos;s premier event management and catering company specializing in authentic Kalyanam (Weddings), 28-Kett (Naming Ceremonies), Luxury Stage Decors, Traditional Ila Sadya Catering, and Corporate Galas across all districts.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Premier Event & Catering Architects Kerala 2025</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-sm font-bold text-white serif mb-4 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" /> Specialized Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/book" className="hover:text-[#D4AF37] transition-colors">Kerala Kalyanam & Stage Decor</Link></li>
              <li><Link to="/book" className="hover:text-[#D4AF37] transition-colors">28-Kett / Naming Ceremony</Link></li>
              <li><Link to="/book" className="hover:text-[#D4AF37] transition-colors">Traditional 28-Item Ila Sadya</Link></li>
              <li><Link to="/book" className="hover:text-[#D4AF37] transition-colors">Chenda Melam & Cultural Events</Link></li>
              <li><Link to="/book" className="hover:text-[#D4AF37] transition-colors">Corporate Events & LED Walls</Link></li>
              <li><Link to="/book" className="hover:text-[#D4AF37] transition-colors">Candid Photography & Drone</Link></li>
            </ul>
          </div>

          {/* Col 3: Kerala Districts Served */}
          <div>
            <h4 className="text-sm font-bold text-white serif mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Pan-Kerala Locations
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-white/50">
              <span>Ernakulam (Kochi)</span>
              <span>Thiruvananthapuram</span>
              <span>Thrissur</span>
              <span>Kozhikode</span>
              <span>Kottayam</span>
              <span>Alappuzha</span>
              <span>Kollam</span>
              <span>Palakkad</span>
              <span>Malappuram</span>
              <span>Kannur</span>
              <span>Idukki & Munnar</span>
              <span>Wayanad</span>
            </div>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-bold text-white serif mb-4">Contact HQ</h4>
            <div className="space-y-3 text-xs">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Off: Panavally, Cherthala / Ernakulam, Kerala</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="tel:+919847033413" className="hover:text-[#D4AF37]">+91 98470 33413 / +91 97467 31970</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="mailto:symphonyevents912@gmail.com" className="hover:text-[#D4AF37]">symphonyevents912@gmail.com</a>
              </p>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs gold-text hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Staff Access
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} Symphony Events & Caterers. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for Kerala Celebrations & Catering
          </p>
        </div>
      </div>
    </footer>
  );
};
