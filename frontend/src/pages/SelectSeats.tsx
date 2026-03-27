import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi, bookingsApi } from '../api';
import { useAuth } from '../context/AuthContext';

interface Seat {
  id: string;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
  status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
}

export default function SelectSeats() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsApi.getSeats(id!).then(r => {
      setSeats(r.data);
      const sections = Array.from(new Set(r.data.map((s: Seat) => s.section))).sort() as string[];
      if (sections.length > 0) setActiveSection(sections[0]);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load seats');
      setLoading(false);
    });
  }, [id]);

  const toggleSeat = (seatId: string, status: string) => {
    if (status !== 'AVAILABLE') return;
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const proceedToPay = async () => {
    if (!user) return navigate('/login');
    if (selected.length === 0) return setError('Select at least one seat');
    try {
      const { data } = await bookingsApi.lockSeats({ eventId: id!, seatIds: selected });
      navigate(`/checkout/${data.booking.id}`);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to lock seats');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Derive sections and grouped structure
  const sections = Array.from(new Set(seats.map(s => s.section))).sort();
  const sectionSeats = seats.filter(s => s.section === activeSection);
  const rows = Array.from(new Set(sectionSeats.map(s => s.row))).sort();
  const groupedByRow: Record<string, Seat[]> = {};
  rows.forEach(r => {
    groupedByRow[r] = sectionSeats.filter(s => s.row === r).sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));
  });

  const selectedSeats = seats.filter(s => selected.includes(s.id));
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  // Count available/booked per section for the tab badges
  const sectionStats = (sec: string) => {
    const s = seats.filter(seat => seat.section === sec);
    return { available: s.filter(seat => seat.status === 'AVAILABLE').length, total: s.length };
  };

  const getSeatClass = (seat: Seat) => {
    if (seat.status === 'BOOKED') return 'bg-surface-container-highest border border-outline-variant/20 cursor-not-allowed opacity-40';
    if (seat.status === 'LOCKED') return 'bg-tertiary/20 border border-tertiary/30 cursor-not-allowed opacity-60';
    if (selected.includes(seat.id)) return 'bg-primary shadow-[0_0_12px_rgba(139,92,246,0.6)] border border-primary scale-110 cursor-pointer';
    return 'bg-secondary/20 border border-secondary/30 hover:bg-secondary hover:scale-105 cursor-pointer transition-all';
  };

  return (
    <div className="pt-20 min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <main className="flex-grow flex flex-col md:flex-row gap-8 px-4 md:px-12 pb-12 max-w-[1600px] mx-auto w-full mt-8">

        {/* Seat Selection Area */}
        <section className="flex-grow flex flex-col items-center">
          <div className="w-full max-w-4xl flex flex-col items-center">
            {error && (
              <div className="mb-4 bg-error/20 text-error px-4 py-2 rounded-lg text-sm w-full text-center">{error}</div>
            )}

            {/* Section Tabs */}
            {sections.length > 1 && (
              <div className="w-full mb-8 flex flex-wrap gap-3 justify-center">
                {sections.map(sec => {
                  const stats = sectionStats(sec);
                  const selectedInSection = selected.filter(sid => seats.find(s => s.id === sid && s.section === sec)).length;
                  return (
                    <button
                      key={sec}
                      onClick={() => setActiveSection(sec)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${
                        activeSection === sec
                          ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                          : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary/30'
                      }`}
                    >
                      <span className="uppercase tracking-wider">{sec}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeSection === sec ? 'bg-primary/30 text-primary' : 'bg-surface-container-highest text-outline'
                      }`}>
                        {stats.available} left
                      </span>
                      {selectedInSection > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold">
                          {selectedInSection} ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Section Label */}
            <div className="w-full text-center mb-6">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary/70 bg-primary/10 px-4 py-1.5 rounded-full">
                {activeSection} Section
              </span>
            </div>

            {/* Screen */}
            <div className="curved-screen w-full max-w-2xl h-8 bg-gradient-to-b from-secondary/40 to-transparent shadow-[0_-20px_60px_-10px_rgba(76,215,246,0.4)] mb-2 mt-4"></div>
            <p className="text-center text-secondary/60 text-xs tracking-[0.4em] uppercase mb-12 font-label">Screen This Way</p>

            {/* Seat Map for active section */}
            <div className="seat-map-perspective flex flex-col gap-3 md:gap-4 items-center w-full">
              {rows.map(row => (
                <div key={row} className="flex gap-2 items-center justify-center">
                  <span className="text-[10px] text-outline font-bold w-5 text-right mr-2 shrink-0">{row}</span>
                  <div className="flex gap-1 md:gap-2 flex-wrap justify-center">
                    {groupedByRow[row].map(seat => (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id, seat.status)}
                        className={`w-7 h-7 md:w-9 md:h-9 rounded-lg transition-all text-[9px] font-bold flex items-center justify-center ${getSeatClass(seat)}`}
                        title={`${seat.section} · Row ${seat.row} · Seat ${seat.seatNumber} · $${seat.price}`}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-outline font-bold w-5 text-left ml-2 shrink-0">{row}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 px-8 py-5 rounded-2xl glass-panel border border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-primary/20 border border-primary/40"></span>
                <span className="text-xs uppercase tracking-wider text-on-surface/80">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-secondary/20 border border-secondary/30"></span>
                <span className="text-xs uppercase tracking-wider text-on-surface/80">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-tertiary/20 border border-tertiary/30 opacity-60"></span>
                <span className="text-xs uppercase tracking-wider text-on-surface/80">Locked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-surface-container-highest opacity-40"></span>
                <span className="text-xs uppercase tracking-wider text-on-surface/80">Booked</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar / Checkout */}
        <aside className="w-full md:w-[380px] flex flex-col gap-6 shrink-0 mt-8 md:mt-0">
          <div className="glass-panel flex-grow p-8 rounded-3xl border border-outline-variant/10 flex flex-col sticky top-28">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/10 pb-4">
              <h3 className="font-headline text-xl font-bold">Selected Seats</h3>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">{selected.length} Seats</span>
            </div>

            {/* Section summary chips */}
            {sections.length > 1 && selected.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {sections.map(sec => {
                  const count = selected.filter(sid => seats.find(s => s.id === sid && s.section === sec)).length;
                  if (count === 0) return null;
                  return (
                    <span key={sec} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase">
                      {sec}: {count}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="space-y-3 mb-8 max-h-[280px] overflow-y-auto pr-2">
              {selectedSeats.length === 0 ? (
                <div className="text-center text-on-surface-variant text-sm py-8 opacity-60">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">event_seat</span>
                  Select seats from the map
                </div>
              ) : (
                selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                        {seat.seatNumber}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">Row {seat.row} · Seat {seat.seatNumber}</p>
                        <p className="text-[10px] uppercase tracking-wider text-on-surface/50">{seat.section}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-primary">${seat.price}</p>
                      <button onClick={() => toggleSeat(seat.id, seat.status)} className="text-outline hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-auto space-y-3 pt-6 border-t border-outline-variant/10 bg-surface-container-lowest/50 p-4 rounded-2xl">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface/60">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface/60">Tax & Fees (12%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-outline-variant/10">
                <div className="flex justify-between items-end mb-5">
                  <p className="text-xs uppercase text-on-surface/60 font-semibold">Total</p>
                  <p className="text-3xl font-black font-headline tracking-tight text-on-surface">${total.toFixed(2)}</p>
                </div>
                <button
                  onClick={proceedToPay}
                  disabled={selected.length === 0}
                  className={`w-full py-4 rounded-xl font-bold font-headline transition-all ${
                    selected.length > 0
                      ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-95'
                      : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50'
                  }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-sm">info</span>
              <p className="text-[10px] text-secondary/80 font-medium">Seats are held for 10 minutes after selection.</p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
