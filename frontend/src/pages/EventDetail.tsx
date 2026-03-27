import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi } from '../api';

interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  eventDate: string;
  availableSeats: number;
  bannerImage?: string;
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    eventsApi.getById(id!).then(r => setEvent(r.data));
  }, [id]);

  if (!event) return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-20 bg-surface">
      {/* Massive Hero Banner */}
      <section className="relative h-[400px] md:h-[550px] w-full overflow-hidden">
        {event.bannerImage ? (
          <img 
            alt={event.name} 
            className="w-full h-full object-cover" 
            src={event.bannerImage} 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
            <span className="material-symbols-outlined text-[100px] text-on-surface/5 opacity-10">local_activity</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface"></div>
        
        {/* Floating Glassmorphic Info Panel */}
        <div className="absolute bottom-12 left-4 md:left-24 right-4 md:right-auto max-w-xl glass-panel p-8 md:p-12 rounded-[2rem] shadow-[0_0_40px_rgba(139,92,246,0.1)] border border-white/5">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-secondary-container/20 text-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-secondary/20">Live Event</span>
            <span className="bg-tertiary-container/20 text-tertiary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-tertiary/20">Exclusive</span>
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight text-glow">
            {event.name}
          </h1>
          
          <div className="flex items-center gap-6 mb-8 text-on-surface-variant font-medium">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">group</span>
              {event.availableSeats} Seats Left
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate(`/events/${event.id}/seats`)}
              className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-8 rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
              disabled={event.availableSeats === 0}
            >
              {event.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
              <span className="material-symbols-outlined">confirmation_number</span>
            </button>
            <button className="py-4 px-6 rounded-xl border border-outline-variant/30 hover:bg-white/5 transition-all flex items-center justify-center" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: About */}
          <div className="lg:col-span-8 space-y-16">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-8 flex items-center gap-4">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                About the Event
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-on-surface-variant text-lg leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Venue & Map */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5">
                <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  Venue & Time
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-label">Location</p>
                    <p className="text-on-surface font-semibold text-lg">{event.venue}</p>
                  </div>
                  
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 font-label">Date & Time</p>
                      <p className="text-on-surface font-semibold">
                        {new Date(event.eventDate).toLocaleString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-outline-variant/20 mt-6">
                    <p className="text-sm text-on-surface-variant italic">Note: Pricing varies by seat section which you can view during seat selection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
