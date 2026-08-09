import React, { useState } from 'react';
import { EventType, KeralaDistrict, ServiceOption } from '../types';
import { api } from '../api/client';
import { CheckCircle2, Calendar, MapPin, Users, Heart, ArrowRight, ArrowLeft, Mail, Phone, User, Check, Sparkles } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [eventType, setEventType] = useState<EventType>('Kalyanam (Wedding)');
  const [location, setLocation] = useState<KeralaDistrict>('Ernakulam (Kochi)');
  const [customLocation, setCustomLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState<number>(500);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([
    'Stage Decoration & Floral',
    'Traditional Kerala Sadya & Catering',
  ]);
  const [budgetRange, setBudgetRange] = useState('₹2,00,000 - ₹5,00,000');
  const [notes, setNotes] = useState('');

  // Contact Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const eventTypesList: EventType[] = [
    'Kalyanam (Wedding)',
    '28-Kett (Naming)',
    'Corporate Party',
    'Office Event',
    'Birthday Party',
    'Custom Event',
  ];

  const districtsList: KeralaDistrict[] = [
    'Ernakulam (Kochi)',
    'Thiruvananthapuram',
    'Thrissur',
    'Kozhikode',
    'Kottayam',
    'Alappuzha',
    'Kollam',
    'Palakkad',
    'Malappuram',
    'Kannur',
    'Idukki',
    'Wayanad',
    'Pathanamthitta',
    'Kasaragod',
  ];

  const servicesList: ServiceOption[] = [
    'Stage Decoration & Floral',
    'Traditional Kerala Sadya & Catering',
    'Sound, Intelligent Lighting & LED Wall',
    'Photography & Drone Videography',
    'Bridal Makeup & Styling',
    'Traditional Chenda Melam & Cultural Shows',
    'Anchor & Event Coordination',
  ];

  const toggleService = (srv: ServiceOption) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !eventDate) {
      setErrorMessage('Please fill in all required contact details and event date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerDetails: {
          name,
          email,
          phone,
          address,
          city: location,
        },
        eventType,
        location: customLocation ? `${location} - ${customLocation}` : location,
        eventDate,
        guestCount,
        selectedServices,
        budgetRange,
        notes,
      };

      const result = await api.createBooking(payload);
      setSubmitSuccess(result.data);
      setStep(4); // Success step
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-emerald-950 min-h-screen text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Step Event Reservation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100">Custom Event Booking</h1>
          <p className="text-xs sm:text-sm text-amber-100/70 max-w-xl mx-auto">
            Select your event requirements below. Our team will prepare a tailored package and email your instant booking receipt.
          </p>
        </div>

        {/* Step Indicator Bar */}
        {step < 4 && (
          <div className="bg-emerald-900/40 p-4 rounded-2xl border border-amber-500/20 flex items-center justify-between text-xs sm:text-sm">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-300 font-bold' : 'text-amber-100/40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-amber-500 text-emerald-950 font-bold' : 'bg-emerald-900 text-amber-200'}`}>1</span>
              <span>Event & Venue</span>
            </div>
            <div className="w-8 h-0.5 bg-amber-500/20"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-300 font-bold' : 'text-amber-100/40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-amber-500 text-emerald-950 font-bold' : 'bg-emerald-900 text-amber-200'}`}>2</span>
              <span>Services & Guest Count</span>
            </div>
            <div className="w-8 h-0.5 bg-amber-500/20"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-300 font-bold' : 'text-amber-100/40'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-amber-500 text-emerald-950 font-bold' : 'bg-emerald-900 text-amber-200'}`}>3</span>
              <span>Contact & Submit</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-emerald-900/30 p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl">
          
          {/* STEP 1: Event Type & Kerala Location */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" /> Step 1: Select Event Type & Date
              </h2>

              {/* Event Type Grid */}
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Event Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventTypesList.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`p-4 rounded-xl border text-left font-semibold text-xs sm:text-sm transition-all ${
                        eventType === type
                          ? 'bg-amber-500 text-emerald-950 border-amber-400 font-bold shadow'
                          : 'bg-emerald-950/80 text-amber-100/80 border-amber-500/20 hover:border-amber-400/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kerala District & Specific Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Kerala District / Region</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as KeralaDistrict)}
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    {districtsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Auditorium / Resort / City (Optional)</label>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="e.g. Bolgatty Palace, Kochi"
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Target Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!eventDate}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-amber-500 text-emerald-950 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-amber-400 disabled:opacity-40 transition-all"
                >
                  Next: Select Services <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Selected Services & Guest Count */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" /> Step 2: Custom Services & Guest Count
              </h2>

              {/* Guest Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Estimated Guest Count</label>
                  <span className="text-base font-bold text-amber-400">{guestCount} Guests</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="25"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-xs text-amber-200/50 mt-1">Saves food & chair arrangements estimate.</p>
              </div>

              {/* Services Selection Grid */}
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Services Requested</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.map((srv) => {
                    const selected = selectedServices.includes(srv);
                    return (
                      <div
                        key={srv}
                        onClick={() => toggleService(srv)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                            : 'bg-emerald-950/80 border-amber-500/20 text-amber-100/60 hover:border-amber-400/40'
                        }`}
                      >
                        <span className="text-xs font-semibold">{srv}</span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selected ? 'bg-amber-400 text-emerald-950' : 'border border-amber-500/40'}`}>
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Budget Range */}
              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Budget Target Range</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Basic)</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Standard)</option>
                  <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000 (Premium)</option>
                  <option value="₹5,00,000 - ₹10,00,000+">₹5,00,000 - ₹10,00,000+ (Royal Destination)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-emerald-900 text-amber-200 font-semibold rounded-xl text-sm flex items-center gap-1.5 hover:bg-emerald-800"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-amber-500 text-emerald-950 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-amber-400"
                >
                  Next: Contact Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Info & Submission */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" /> Step 3: Contact & Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anjali Nair"
                      className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Email Address * (For Receipt)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="anjali@example.com"
                      className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Phone / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98470 12345"
                      className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Address / House Name</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Panampilly Nagar, Kochi"
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2">Special Requests & Custom Instructions</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Lotus motif stage mandapam, live Chenda Melam entrance, vegetarian Sadya..."
                  className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950 border border-amber-500/20 text-xs text-amber-200/70 space-y-1">
                <p className="font-bold text-amber-300">Booking Submission Policy:</p>
                <p>On submission, your booking status will be recorded as &quot;Pending&quot;. You will receive an instant email confirmation. An event coordinator will contact you shortly to confirm availability and issue your itemized bill invoice.</p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-emerald-900 text-amber-200 font-semibold rounded-xl text-sm flex items-center gap-1.5 hover:bg-emerald-800"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold rounded-xl text-base flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-xl"
                >
                  <Sparkles className="w-5 h-5 fill-emerald-950" />
                  {isSubmitting ? 'Submitting Booking...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Receipt Screen */}
          {step === 4 && submitSuccess && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-amber-300">Booking Request Submitted!</h2>
                <p className="text-sm text-amber-100/80 max-w-md mx-auto">
                  Thank you, <strong className="text-amber-200">{submitSuccess.customerDetails.name}</strong>. Your event request has been registered under reference <span className="font-mono text-amber-400 font-bold">#{submitSuccess._id}</span>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950 border border-amber-500/30 max-w-lg mx-auto text-left space-y-2 text-xs">
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-sm border-b border-amber-500/20 pb-2">Booking Summary</h4>
                <p><strong className="text-amber-200">Event Type:</strong> {submitSuccess.eventType}</p>
                <p><strong className="text-amber-200">Date:</strong> {submitSuccess.eventDate}</p>
                <p><strong className="text-amber-200">Location:</strong> {submitSuccess.location}</p>
                <p><strong className="text-amber-200">Guests:</strong> {submitSuccess.guestCount} estimated</p>
                <p><strong className="text-amber-200">Status:</strong> <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">{submitSuccess.status}</span></p>
                <p className="text-emerald-400 font-medium pt-2">An instant email confirmation has been dispatched to {submitSuccess.customerDetails.email}.</p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => { setStep(1); setSubmitSuccess(null); }}
                  className="px-6 py-2.5 bg-emerald-900 text-amber-200 font-semibold rounded-xl text-xs hover:bg-emerald-800"
                >
                  Book Another Event
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
