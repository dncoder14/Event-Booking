import { useEffect, useState } from 'react';
import { bookingsApi } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bookingsApi.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await bookingsApi.cancel(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED', paymentStatus: 'REFUNDED' } : b));
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const handleViewTicket = async (b: any) => {
    try {
      const { data } = await bookingsApi.getById(b.id);
      // Pass qrCode UUID; BookingConfirmed generates the image from it
      navigate('/booking-success', { state: { booking: data, qrCode: data.ticket?.qrCode ?? null } });
    } catch {
      navigate('/booking-success', { state: { booking: b, qrCode: b.ticket?.qrCode ?? null } });
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const now = new Date();
  const upcoming = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.event.eventDate) >= now);
  const past = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.event.eventDate) < now);
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');

  return (
    <div className="pt-20 pb-12 bg-surface min-h-screen">
      <main className="px-4 md:px-8 max-w-5xl mx-auto">
        {/* Page Header */}
        <header className="mb-8 pt-6">
          <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-on-surface mb-1">My Bookings</h1>
          <p className="text-on-surface-variant text-sm">Manage your upcoming experiences and revisit past memories.</p>
        </header>

        {/* Upcoming Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-bold font-headline uppercase tracking-widest text-primary">Upcoming Events</h2>
            <div className="h-px flex-grow bg-outline-variant/20"></div>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-xl border border-outline-variant/5">
              <p className="text-on-surface-variant">You have no upcoming events.</p>
              <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl active:scale-95 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Explore Events
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcoming.map(b => {
                const seats = b.bookingSeats?.map((bs: any) => bs.seat) ?? [];
                return (
                  <div key={b.id} className="glass-panel overflow-hidden flex flex-col md:flex-row items-stretch group border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 rounded-xl">
                    <div className="w-full md:w-52 h-40 md:h-auto overflow-hidden relative shrink-0">
                      {b.event?.bannerImage ? (
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={b.event.name} src={b.event.bannerImage} />
                      ) : (
                        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-outline opacity-20">local_activity</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg">
                          <span className="w-1.5 h-1.5 bg-on-secondary-container rounded-full animate-pulse"></span>
                          Confirmed
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow p-4 md:p-6 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row justify-between gap-3">
                        <div>
                          <span className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1 block">{b.event?.category || 'Live Event'}</span>
                          <h3 className="text-lg font-bold font-headline mb-1.5 text-on-surface">{b.event?.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-xs">
                            <span className="flex items-center gap-1 whitespace-nowrap"><span className="material-symbols-outlined text-sm">calendar_today</span> {new Date(b.event.eventDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 whitespace-nowrap"><span className="material-symbols-outlined text-sm">location_on</span> {b.event?.venue}</span>
                          </div>
                          {seats.length > 0 && (
                            <p className="text-xs text-on-surface-variant mt-1.5">
                              Seats: {seats.map((s: any) => `${s.row}-${s.seatNumber}`).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-start shrink-0">
                          <div className="bg-surface-container-highest px-3 py-1.5 rounded-lg text-center border border-outline-variant/20">
                            <span className="block text-[9px] uppercase font-bold text-outline">Tickets</span>
                            <span className="text-primary text-sm font-bold">{b.bookingSeats?.length || 1} Seats</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelling === b.id}
                          className="px-4 py-2 rounded-lg font-bold text-xs border border-error/30 text-error hover:bg-error/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {cancelling === b.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                        <button
                          onClick={() => handleViewTicket(b)}
                          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-lg font-bold text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        >
                          View Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Past Section */}
        {past.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold font-headline uppercase tracking-widest text-outline">Past Events</h2>
              <div className="h-px flex-grow bg-outline-variant/20"></div>
            </div>
            <div className="grid gap-4 opacity-70 hover:opacity-100 transition-opacity">
              {past.map(b => (
                <div key={b.id} className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row items-center p-4 border border-outline-variant/5">
                  <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    {b.event?.bannerImage ? (
                      <img className="w-full h-full object-cover grayscale" alt={b.event.name} src={b.event.bannerImage} />
                    ) : (
                      <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-outline opacity-20">local_activity</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow px-6 py-4 md:py-0 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold font-headline text-on-surface">{b.event?.name}</h4>
                        <p className="text-xs text-on-surface-variant">{new Date(b.event.eventDate).toLocaleDateString()} • {b.event?.venue}</p>
                      </div>
                      <span className="px-3 py-1 bg-surface-container-highest text-outline text-[10px] font-bold uppercase tracking-widest rounded-full w-fit">Used</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cancelled Section */}
        {cancelled.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold font-headline uppercase tracking-widest text-error/70">Cancelled</h2>
              <div className="h-px flex-grow bg-outline-variant/20"></div>
            </div>
            <div className="grid gap-4 opacity-60">
              {cancelled.map(b => (
                <div key={b.id} className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row items-center p-4 border border-error/10">
                  <div className="flex-grow px-2 py-2 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold font-headline text-on-surface">{b.event?.name}</h4>
                        <p className="text-xs text-on-surface-variant">{new Date(b.event.eventDate).toLocaleDateString()} • {b.event?.venue}</p>
                      </div>
                      <span className="px-3 py-1 bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest rounded-full w-fit border border-error/20">Cancelled</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
