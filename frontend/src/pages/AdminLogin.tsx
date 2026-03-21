import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      if (data.user.role !== 'ADMIN') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      login(data.token, data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex pt-20 bg-background text-on-surface relative">
      {/* Left Side: Cinematic Visual */}
      <section className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Abstract technological grid with dark moody lighting" className="w-full h-full object-cover grayscale opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsqvJvynstOGkkgqVrxliLLllPrheGAVG4_HeujYHKcziZGo12FN_w9SwssGLdhaU3Rz0HdVTyOWWSK2B22wr2VMMr_EhyACIUhc_YQF8EQDa9o75bnFyCZDAm4QNcuAwHBEi__P5Qi2uI7i5d9TeHSioeljXKDvMcTckFrxgKMi7GniGlocxNDhZud-bIJEQ1hXHF61CIfV-Q8N8Zx1uULxfrjm9mmHX5UQ3dNnEV65BMgjDe4GfzKIosjz1cj5FV9Iko4TBIKNM"/>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <div className="max-w-md">
            <span className="label-md uppercase tracking-[0.2em] text-primary font-semibold mb-4 block">Command Center</span>
            <h2 className="text-5xl font-extrabold font-headline leading-tight tracking-tight mb-6">Initialize Sequence.</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">System access is strictly monitored. Authorized administrators only.</p>
          </div>
          <div className="flex items-center gap-4 mt-12 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10 w-max backdrop-blur-xl">
             <span className="material-symbols-outlined text-secondary">verified_user</span>
             <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">256-Bit SSL Encrypted Session</p>
          </div>
        </div>
      </section>

      {/* Right Side: Admin Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-[460px]">
          <div className="mb-10">
            <h3 className="text-3xl font-bold font-headline mb-2 text-primary">Terminal Access</h3>
            <p className="text-on-surface-variant">Please verify your active directory credentials.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="email">Admin ID (Email)</label>
              <div className="relative input-focus-glow rounded-xl overflow-hidden transition-all duration-300">
                <input 
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface px-4 py-4 rounded-xl placeholder:text-outline/50 transition-all font-mono" 
                  id="email" 
                  placeholder="admin@bookmyfun.io" 
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="password">Access Key</label>
              </div>
              <div className="relative input-focus-glow rounded-xl overflow-hidden transition-all duration-300">
                <input 
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface px-4 py-4 rounded-xl placeholder:text-outline/50 transition-all font-mono" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <button disabled={loading} className={`w-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm mt-8 flex justify-center items-center gap-2 ${loading ? 'opacity-70' : ''}`} type="submit">
              {loading ? 'Authenticating...' : 'Authorize Login'}
              {!loading && <span className="material-symbols-outlined text-[18px]">login</span>}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-on-surface-variant text-sm">
              Not an administrator? 
              <Link className="text-primary font-bold ml-2 hover:underline underline-offset-4 decoration-2 decoration-primary/30 transition-all" to="/login">Return to User Portal</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
