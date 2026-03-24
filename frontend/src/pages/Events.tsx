import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../api';

interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  category: string;
  eventDate: string;
  availableSeats: number;
  totalSeats: number;
  bannerImage?: string;
}

const CATEGORIES = ['Music', 'Cinema', 'Art', 'Sports', 'Comedy', 'Other'];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    eventsApi.getAll().then(r => setEvents(r.data));
  }, []);

  const filtered = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || e.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const topEvents = filtered.slice(0, 4);

  useEffect(() => {
    if (topEvents.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % topEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topEvents.length]);

  return (
    <div className="pt-20 bg-surface">
      {/* Dynamic Hero Section */}
      {topEvents.length > 0 ? (
        <section className="relative h-[450px] md:h-[550px] w-full flex items-end overflow-hidden group hover:cursor-pointer" onClick={() => navigate(`/events/${topEvents[activeSlide].id}`)}>
          <div className="absolute inset-0">
            {topEvents.map((event, idx) => (
              <div
                key={event.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0 z-[-1]'}`}
              >
                {event.bannerImage ? (
                  <img alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s] ease-out" src={event.bannerImage} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-surface-variant via-surface to-surface-container flex items-center justify-center group-hover:scale-105 transition-transform duration-[10s] ease-out">
                    <span className="material-symbols-outlined text-[120px] text-on-surface/5 opacity-20">celebration</span>
                  </div>
                )}
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent pointer-events-none"></div>
          </div>

          <div className="relative z-10 px-8 md:px-12 pb-16 md:pb-24 max-w-4xl max-w-[1600px] mx-auto w-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Trending Now
              </span>
              <span className="text-tertiary font-bold tracking-wide text-xs uppercase">{topEvents[activeSlide].venue}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface mb-4 leading-tight">
              {topEvents[activeSlide].name}
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-8 leading-relaxed font-body line-clamp-3">
              {topEvents[activeSlide].description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/events/${topEvents[activeSlide].id}`); }}
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold px-10 py-4 rounded-xl text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)]"
              >
                Get Tickets
              </button>
            </div>
          </div>

          {topEvents.length > 1 && (
            <div className="absolute bottom-16 right-12 flex gap-3 z-20">
              {topEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-10 bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'w-4 bg-outline/50 hover:bg-outline'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="relative h-[500px] w-full flex items-center justify-center bg-surface-container-lowest">
          <div className="text-center px-4">
            <span className="material-symbols-outlined text-6xl opacity-30 text-outline mb-4">stadium</span>
            <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-on-surface/50 mb-4">No exclusive events right now</h1>
            <p className="text-on-surface-variant max-w-md mx-auto">Stay tuned for upcoming experiences on BookMyFun.</p>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="px-4 md:px-12 py-16 flex flex-col lg:flex-row gap-12 max-w-[1600px] mx-auto">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-10">
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20 focus-within:border-primary/50 transition-all flex items-center">
              <span className="material-symbols-outlined text-outline mr-2">search</span>
              <input
                className="bg-transparent border-none focus:outline-none text-sm w-full text-on-surface placeholder:text-outline/50"
                placeholder="Search events..."
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <h3 className="font-headline font-bold text-xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">tune</span> Refine
            </h3>

            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-outline">Categories</label>
              <div className="flex flex-wrap gap-2">
                <span
                  onClick={() => setActiveCategory('')}
                  className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${activeCategory === '' ? 'bg-primary text-on-primary' : 'bg-surface-container-highest hover:bg-primary hover:text-on-primary'}`}
                >
                  All
                </span>
                {CATEGORIES.map(cat => (
                  <span
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-highest hover:bg-primary hover:text-on-primary'}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Events Grid */}
        <section className="flex-1 space-y-12">
          <div>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-headline font-extrabold tracking-tight">Upcoming Events</h2>
              <span className="text-on-surface-variant font-bold text-sm bg-surface-container-high px-3 py-1 rounded-full">{filtered.length} found</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">event_busy</span>
                <p className="text-xl font-bold font-headline">No events found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((event) => {
                  const soldOut = event.availableSeats === 0;
                  return (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="group flex flex-col relative bg-surface-container-low rounded-[1.5rem] overflow-hidden hover:bg-surface-container-high transition-all duration-300 neon-glow cursor-pointer aspect-auto"
                    >
                      <div className="h-[250px] overflow-hidden relative shrink-0">
                        {event.bannerImage ? (
                          <img
                            alt={event.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            src={event.bannerImage}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-highest group-hover:scale-110 transition-transform duration-500 text-outline">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-30">local_activity</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1c] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20">
                          {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        {event.category && (
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-secondary border border-secondary/20">
                            {event.category}
                          </div>
                        )}
                        {soldOut && (
                          <div className="absolute bottom-4 left-4 bg-error/90 text-on-error backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-error/50 tracking-wider">
                            SOLD OUT
                          </div>
                        )}
                      </div>

                      <div className="p-6 relative flex flex-col flex-1">
                        <div className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase mb-2 line-clamp-1">
                          {event.venue}
                        </div>
                        <h4 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.name}</h4>
                        <p className="text-sm text-on-surface-variant mb-4 line-clamp-2 min-h-[40px]">{event.description}</p>

                        <div className="mt-auto flex justify-between items-end border-t border-outline-variant/10 pt-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase text-outline mb-1">Seats Left</span>
                            <span className={`text-lg font-black ${soldOut ? 'text-error' : 'text-on-surface'}`}>{soldOut ? '0' : event.availableSeats}</span>
                          </div>
                          <button className="material-symbols-outlined p-2 rounded-full border border-outline-variant/20 hover:bg-primary hover:text-on-primary transition-all">
                            arrow_forward
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
