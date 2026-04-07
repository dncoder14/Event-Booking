import { useEffect, useState } from 'react';
import { eventsApi, bookingsApi, uploadApi } from '../api';

interface Event { id: string; name: string; venue: string; eventDate: string; availableSeats: number; totalSeats: number; category: string; }
interface Booking { id: string; status: string; paymentStatus: string; totalAmount: number; user: { name: string; email: string }; event: { name: string }; bookingSeats: any[]; }

const emptyForm = { name: '', description: '', venue: '', eventDate: '', eventTime: '', rows: 5, seatsPerRow: 10, sections: 'FLOOR,BALCONY', pricePerSeat: 500, bannerImage: '', category: 'Music' };
const CATEGORIES = ['Music', 'Cinema', 'Art', 'Sports', 'Comedy', 'Other'];

interface EventFormProps {
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  error: string;
  uploading: boolean;
  tab: 'dashboard' | 'create' | 'edit';
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

function EventForm({ onSubmit, title, form, setForm, error, uploading, tab, handleFileUpload, onCancel }: EventFormProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter text-on-surface mb-2">{title}</h1>
        <p className="text-on-surface-variant/80 text-lg">Curate the atmosphere. Define the night.</p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        {error && <div className="p-4 bg-error/10 text-error rounded-xl border border-error/20">{error}</div>}

        <section className="p-8 rounded-[2rem] bg-surface-container-low relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">01</span>
            <h2 className="text-xl font-bold font-headline tracking-tight">Event Foundations</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Event Title</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-primary/50 text-on-surface outline-none"
                placeholder="Midnight Jazz & Absinthe" />
            </div>
            {tab === 'create' && (
              <div>
                <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Description</label>
                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-primary/50 text-on-surface outline-none resize-y"
                  rows={4} />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Category</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-primary/50 text-on-surface outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {tab === 'create' && (
              <div>
                <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Event Banner Image</label>
                <div className="relative flex items-center p-4 border border-dashed border-outline-variant/30 hover:border-primary/50 transition-colors rounded-xl bg-surface-container-lowest">
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  <div className="flex items-center gap-4 w-full">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${form.bannerImage ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-outline'}`}>
                      <span className="material-symbols-outlined">{form.bannerImage ? 'check_circle' : 'upload_file'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{uploading ? 'Uploading...' : (form.bannerImage ? 'Image uploaded successfully' : 'Click to select banner image')}</p>
                      <p className="text-xs text-on-surface-variant">{form.bannerImage ? 'Ready for publication' : 'PNG, JPG or WEBP (max 5MB)'}</p>
                    </div>
                  </div>
                </div>
                {form.bannerImage && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-outline-variant/10 aspect-video w-full max-w-sm">
                    <img src={form.bannerImage} className="w-full h-full object-cover" alt="Banner Preview" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="p-8 rounded-[2rem] bg-surface-container-low">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">02</span>
            <h2 className="text-xl font-bold font-headline tracking-tight">Time & Space</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Venue Location</label>
              <input required value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-4 focus:ring-1 focus:ring-primary/50 text-on-surface outline-none"
                placeholder="The Glass House, NYC" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Event Date & Time</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">calendar_today</span>
                  <input
                    required
                    type="date"
                    value={form.eventDate}
                    onChange={e => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl pl-11 pr-4 py-4 focus:ring-1 focus:ring-primary/50 text-on-surface outline-none dark:[color-scheme:dark] cursor-pointer"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">schedule</span>
                  <input
                    required
                    type="time"
                    value={form.eventTime}
                    onChange={e => setForm({ ...form, eventTime: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl pl-11 pr-4 py-4 focus:ring-1 focus:ring-primary/50 text-on-surface outline-none dark:[color-scheme:dark] cursor-pointer"
                  />
                </div>
              </div>
              {form.eventDate && form.eventTime && (
                <p className="text-xs text-on-surface-variant mt-2 ml-1">
                  {new Date(`${form.eventDate}T${form.eventTime}`).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        </section>

        {tab === 'create' && (
          <section className="p-8 rounded-[2rem] bg-surface-container-low">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-lg bg-tertiary/20 flex items-center justify-center text-tertiary font-bold text-xs">03</span>
              <h2 className="text-xl font-bold font-headline tracking-tight">Pricing & Seating Layout</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Rows</label>
                <input required type="number" min={1} value={form.rows} onChange={e => setForm({ ...form, rows: Number(e.target.value) })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Seats Per Row</label>
                <input required type="number" min={1} value={form.seatsPerRow} onChange={e => setForm({ ...form, seatsPerRow: Number(e.target.value) })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-2 ml-1">Price Per Seat ($)</label>
                <input required type="number" min={1} value={form.pricePerSeat} onChange={e => setForm({ ...form, pricePerSeat: Number(e.target.value) })} className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-6 py-3 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold tracking-widest text-outline uppercase mb-3 ml-1">Sections</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['FLOOR', 'BALCONY', 'VIP', 'MEZZANINE', 'PIT', 'GALLERY', 'BOX', 'UPPER TIER'].map(sec => {
                    const selected = form.sections.split(',').map(s => s.trim()).filter(Boolean).includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          const current = form.sections.split(',').map(s => s.trim()).filter(Boolean);
                          const updated = selected ? current.filter(s => s !== sec) : [...current, sec];
                          setForm({ ...form, sections: updated.join(',') });
                        }}
                        className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all text-left flex items-center gap-2 ${
                          selected
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant hover:border-primary/30'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                          selected ? 'bg-primary border-primary' : 'border-outline-variant/40'
                        }`}>
                          {selected && <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>}
                        </span>
                        {sec}
                      </button>
                    );
                  })}
                </div>
                {form.sections.split(',').filter(s => s.trim()).length === 0 && (
                  <p className="text-xs text-error mt-2 ml-1">Select at least one section</p>
                )}
                <p className="text-xs text-on-surface-variant mt-2 ml-1">Selected: {form.sections.split(',').filter(s => s.trim()).join(', ') || 'None'}</p>
              </div>
            </div>
          </section>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={onCancel}
            className="px-8 py-5 border border-outline-variant/20 rounded-2xl font-bold hover:bg-surface-container-low transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={uploading}
            className="flex-1 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50">
            {tab === 'edit' ? 'Save Changes' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Admin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<'dashboard' | 'create' | 'edit'>('dashboard');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      eventsApi.getAll().then(r => setEvents(r.data)),
      bookingsApi.getAllBookings().then(r => setBookings(r.data))
    ]).catch(console.error).finally(() => setLoading(false));
  }, []);

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const sectionsArray = form.sections.split(',').map(s => s.trim()).filter(Boolean);
      if (sectionsArray.length === 0) { setError('Select at least one section'); return; }
      if (!form.eventDate || !form.eventTime) { setError('Please select both date and time'); return; }
      const payload = {
        ...form,
        eventDate: new Date(`${form.eventDate}T${form.eventTime}`),
        sections: sectionsArray,
        rows: Number(form.rows),
        seatsPerRow: Number(form.seatsPerRow),
        pricePerSeat: Number(form.pricePerSeat),
        bannerImage: form.bannerImage || undefined
      };
      const { data } = await eventsApi.create(payload);
      setEvents(prev => [...prev, data]);
      setForm(emptyForm);
      setTab('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const startEdit = (ev: Event) => {
    setEditingId(ev.id);
    const d = new Date(ev.eventDate);
    const dateStr = d.toISOString().slice(0, 10);
    const timeStr = d.toTimeString().slice(0, 5);
    setForm({ ...emptyForm, name: ev.name, venue: ev.venue, eventDate: dateStr, eventTime: timeStr, category: ev.category });
    setTab('edit');
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const { data } = await eventsApi.update(editingId!, {
        name: form.name,
        venue: form.venue,
        eventDate: form.eventDate && form.eventTime ? new Date(`${form.eventDate}T${form.eventTime}`) : new Date(form.eventDate),
        category: form.category,
      });
      setEvents(prev => prev.map(ev => ev.id === editingId ? { ...ev, ...data } : ev));
      setEditingId(null);
      setForm(emptyForm);
      setTab('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true); setError('');
    try {
      const { data } = await uploadApi.uploadBanner(e.target.files[0]);
      setForm(prev => ({ ...prev, bannerImage: data.url }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Banner upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsApi.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleCancel = () => { setTab('dashboard'); setEditingId(null); setForm(emptyForm); };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeEvents = events.filter(e => new Date(e.eventDate) >= new Date()).length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0);
  const totalTickets = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + (b.bookingSeats?.length || 0), 0);

  return (
    <div className="bg-surface text-on-surface font-body overflow-x-hidden min-h-screen flex flex-col">
      <div className="flex flex-1 pt-20">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-20 bottom-0 bg-surface-container-lowest border-r border-outline-variant/10 p-6 gap-8 z-10">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-2">Event Management</label>
            <button onClick={handleCancel}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${tab === 'dashboard' ? 'bg-surface-container-highest text-primary shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium tracking-wide">Dashboard</span>
            </button>
            <button onClick={() => { setTab('create'); setEditingId(null); setForm(emptyForm); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${tab === 'create' ? 'bg-surface-container-highest text-primary shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined">add_circle</span>
              <span className="text-sm font-medium tracking-wide">Create Event</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 lg:p-12 relative">

          {tab === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-xs font-label uppercase tracking-widest text-outline mb-4">
                  <span>Admin</span>
                  <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                  <span className="text-secondary">Bookings Dashboard</span>
                </div>
                <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Manage Bookings & Events</h1>
                <p className="text-on-surface-variant max-w-xl">Monitor real-time reservations, revenue flow, and event occupancy.</p>
              </header>

              {/* Stats */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-primary">payments</span>
                    </div>
                  </div>
                  <p className="text-sm font-label uppercase tracking-widest text-outline mb-1">Total Revenue</p>
                  <h2 className="text-3xl font-headline font-bold text-on-surface">${totalRevenue.toFixed(2)}</h2>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/10 transition-colors"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-secondary/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-secondary">confirmation_number</span>
                    </div>
                  </div>
                  <p className="text-sm font-label uppercase tracking-widest text-outline mb-1">Total Tickets Sold</p>
                  <h2 className="text-3xl font-headline font-bold text-on-surface">{totalTickets}</h2>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-tertiary/10 transition-colors"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-tertiary/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-tertiary">calendar_month</span>
                    </div>
                  </div>
                  <p className="text-sm font-label uppercase tracking-widest text-outline mb-1">Active Events</p>
                  <h2 className="text-3xl font-headline font-bold text-on-surface">{activeEvents}</h2>
                </div>
              </section>

              {/* Events Table */}
              <section className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 mb-12">
                <div className="p-6 border-b border-outline-variant/10">
                  <h3 className="font-headline font-bold text-lg">All Events</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/30">
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Event</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Category</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Date</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Seats (Avail/Total)</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {events.map(ev => (
                        <tr key={ev.id} className="hover:bg-primary/5 transition-colors group">
                          <td className="px-6 py-4 font-semibold text-on-surface">{ev.name}</td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">{ev.category}</td>
                          <td className="px-6 py-4 text-sm">{new Date(ev.eventDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm">{ev.availableSeats} / {ev.totalSeats}</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(ev)} className="text-primary/70 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={() => deleteEvent(ev.id)} className="text-error/70 hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {events.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-outline">No events created yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Bookings Table */}
              <section className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
                <div className="p-6 border-b border-outline-variant/10">
                  <h3 className="font-headline font-bold text-lg">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/30">
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">User</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Event</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline text-center">Seats</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Amount</th>
                        <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-outline">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-primary/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-on-surface">{b.user?.name}</div>
                            <div className="text-[11px] text-outline">{b.user?.email}</div>
                          </td>
                          <td className="px-6 py-4"><div className="text-sm text-on-surface">{b.event?.name}</div></td>
                          <td className="px-6 py-4 text-center"><span className="text-sm font-medium">{b.bookingSeats?.length || 0}</span></td>
                          <td className="px-6 py-4"><div className="text-sm font-bold">${b.totalAmount}</div></td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'CONFIRMED' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                              b.status === 'CANCELLED' ? 'bg-error/10 text-error border border-error/20' :
                              'bg-tertiary/10 text-tertiary border border-tertiary/20'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-outline">No bookings found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {tab === 'create' && (
            <EventForm
              onSubmit={createEvent}
              title="New BookMyFun Experience"
              form={form}
              setForm={setForm}
              error={error}
              uploading={uploading}
              tab={tab}
              handleFileUpload={handleFileUpload}
              onCancel={handleCancel}
            />
          )}
          {tab === 'edit' && (
            <EventForm
              onSubmit={saveEdit}
              title="Edit Event"
              form={form}
              setForm={setForm}
              error={error}
              uploading={uploading}
              tab={tab}
              handleFileUpload={handleFileUpload}
              onCancel={handleCancel}
            />
          )}

        </main>
      </div>
    </div>
  );
}
