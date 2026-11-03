import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferredCallbackTime, setPreferredCallbackTime] = useState('Anytime');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await api.createEnquiry({
        name,
        email,
        phone,
        message,
        preferredCallbackTime,
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-emerald-950 min-h-screen text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100">Get In Touch With Us</h1>
          <p className="text-sm text-amber-100/70 max-w-xl mx-auto">
            Have questions about venue availability, traditional Sadya catering menus, or custom stage decors? Send us a message or request a callback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact Offices & Details */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-emerald-900/30 border border-amber-500/20 shadow-xl space-y-6">
              <h3 className="text-2xl font-serif font-bold text-amber-300">Offices & Locations</h3>
              
              <div className="space-y-4 text-sm text-amber-100/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-amber-200 block text-base">Alappuzha Main HQ</strong>
                    <p className="text-xs text-amber-100/70">Off: Panavally, Cherthala, Alappuzha - 688526</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-amber-200 block text-base">Kochi Operations Office</strong>
                    <p className="text-xs text-amber-100/70">MG Road & Panampilly Nagar, Kochi, Ernakulam</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-500/10 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>+91 98470 33413 / +91 97467 31970</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>symphonyevents912@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>Monday - Saturday: 9:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="bg-emerald-900/40 p-8 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-amber-400 mx-auto" />
                <h3 className="text-2xl font-serif font-bold text-amber-300">Enquiry Received!</h3>
                <p className="text-sm text-amber-100/80 max-w-sm mx-auto">
                  Thank you for reaching out, <strong className="text-amber-200">{name}</strong>. An event expert will call you back during your preferred window (<span className="text-amber-300">{preferredCallbackTime}</span>).
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage(''); }}
                  className="px-6 py-2 bg-emerald-900 text-amber-200 rounded-lg text-xs font-semibold hover:bg-emerald-800"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-2xl font-serif font-bold text-amber-300 mb-2">Send Us an Enquiry</h3>

                {errorMsg && (
                  <div className="p-3 bg-red-900/60 border border-red-500 text-red-200 text-xs rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Siddharth Menon"
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="siddharth@example.com"
                      className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98470 12345"
                      className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Preferred Callback Window</label>
                  <select
                    value={preferredCallbackTime}
                    onChange={(e) => setPreferredCallbackTime(e.target.value)}
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Your Enquiry / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your event requirements, venue questions, or date availability..."
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4 fill-emerald-950" />
                  {isSubmitting ? 'Submitting...' : 'Send Enquiry Request'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
