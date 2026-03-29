import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function BookingConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  // Accept either a pre-rendered qrImage (from checkout flow) or a qrCode UUID (from booking history)
  const state = location.state as { qrImage?: string; qrCode?: string | null; booking?: any };

  if (!state?.booking) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-surface flex-col">
        <h2 className="text-2xl font-bold font-headline mb-4">No booking details found</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold">Back Home</button>
      </div>
    );
  }

  const { booking, qrImage, qrCode } = state;
  const event = booking.event;
  const seats = booking.bookingSeats?.map((bs: any) => bs.seat) ?? [];

  // Prefer a pre-rendered data-URL (checkout flow), otherwise build a URL from the UUID
  const qrSrc = qrImage
    || (qrCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=220x220&margin=4` : null)
    || (booking.ticket?.qrCode ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(booking.ticket.qrCode)}&size=220x220&margin=4` : null);

  return (
    <div className="pt-20 min-h-screen bg-background text-on-surface font-body pb-20">
      <main className="pt-8 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-14 h-14 bg-secondary-container/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(3,181,211,0.2)] text-secondary">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight mb-2 text-on-surface">You're going to the show!</h1>
          <p className="text-on-surface-variant max-w-md text-sm leading-relaxed">Your reservation is confirmed. Present the QR code below at the venue.</p>
        </div>

        {/* Ticket card */}
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 via-secondary/20 to-tertiary/20 blur-2xl opacity-50 rounded-[2rem]"></div>

          <div className="relative glass-panel border border-outline-variant/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Event Poster */}
            <div className="w-full md:w-2/5 h-48 md:h-auto relative hidden md:block shrink-0">
              {event?.bannerImage ? (
                <img alt={event.name} className="absolute inset-0 w-full h-full object-cover" src={event.bannerImage} />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-outline opacity-20">local_activity</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">VIP Pass</span>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-surface-container-low/40">
              <div>
                {/* Title */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-secondary text-[0.6rem] font-bold tracking-[0.2em] uppercase mb-1">{event?.category || 'Live Event'}</p>
                    <h2 className="text-2xl font-headline font-black tracking-tight text-primary">{event?.name}</h2>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-on-surface-variant text-[0.6rem] font-bold uppercase">Order #</p>
                    <p className="text-on-surface font-mono text-xs">{booking.id.split('-')[0].toUpperCase()}</p>
                  </div>
                </div>

                {/* Event info grid */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                  <div>
                    <p className="text-on-surface-variant text-[0.6rem] font-bold tracking-wider uppercase mb-1">Date</p>
                    <p className="text-on-surface font-semibold text-sm">
                      {new Date(event?.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-[0.6rem] font-bold tracking-wider uppercase mb-1">Time</p>
                    <p className="text-on-surface font-semibold text-sm">
                      {new Date(event?.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-[0.6rem] font-bold tracking-wider uppercase mb-1">Venue</p>
                    <p className="text-on-surface font-semibold text-sm">{event?.venue}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-[0.6rem] font-bold tracking-wider uppercase mb-1">Seats</p>
                    <p className="text-on-surface font-semibold text-sm">
                      {seats.length > 0 ? seats.map((s: any) => `${s.row}-${s.seatNumber}`).join(', ') : 'General Admission'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider + QR */}
              <div className="pt-5 border-t border-dashed border-outline-variant/40">
                {qrSrc ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-on-surface-variant text-[0.6rem] font-bold tracking-widest uppercase">Scan at Venue</p>
                    <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.12)]">
                      <img
                        alt="Ticket QR Code"
                        className="w-44 h-44 object-contain"
                        src={qrSrc}
                      />
                    </div>
                    <p className="text-on-surface-variant/60 text-[0.55rem] font-mono">
                      {(qrCode || booking.ticket?.qrCode || '').substring(0, 18).toUpperCase()}...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <span className="material-symbols-outlined text-4xl">qr_code_2</span>
                    <p className="text-xs text-on-surface-variant">QR code unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-8 text-center">
          <Link to="/bookings" className="text-primary hover:text-secondary underline decoration-2 underline-offset-4 font-bold flex items-center justify-center gap-2 text-sm">
            View All My Bookings <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
