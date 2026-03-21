import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.register(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex-grow flex pt-20 bg-background text-on-surface relative">
      {/* Left Side: Cinematic Visual */}
      <section className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Concert stage with purple and cyan neon lighting" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9Re5QGhZXuwVH_oO8ZnpSgd2BD7F4xgvVA33pQCE4nwnrS33LFzD_OcykY4JluTDpPNiercC8yT3LU97dJaro_dSatPNBe-tB6P60IJfnd0kdT_MaWQOwM7VdRt3TsHmesb19ojwN4nTb11SMmNBl0DSJ4ezfCyhaI-zxh7kaRJlRPM1Biw1ns6ud4NkfklEfqKBJbWrh6qMhcTORrgbFp5s_-vuFUsyuH05nRjb6S7kLSiG7mNkTasdZbZAQujSzZXcrj_YWCIY"/>
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-16 w-full">
          <div className="max-w-md">
            <span className="label-md uppercase tracking-[0.2em] text-secondary font-semibold mb-4 block">Join the Elite</span>
            <h2 className="text-5xl font-extrabold font-headline leading-tight tracking-tight mb-6">Create Your Profile.</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">Unlock access to exclusive events, priority bookings, and personalized recommendations.</p>
          </div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-[460px]">
          <div className="mb-10">
            <h3 className="text-3xl font-bold font-headline mb-2">Create Account</h3>
            <p className="text-on-surface-variant">Fill in your details to get started.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="name">Full Name</label>
              <div className="relative input-focus-glow rounded-xl overflow-hidden transition-all duration-300">
                <input 
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface px-4 py-4 rounded-xl placeholder:text-outline/50 transition-all" 
                  id="name" 
                  placeholder="John Doe" 
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative input-focus-glow rounded-xl overflow-hidden transition-all duration-300">
                <input 
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface px-4 py-4 rounded-xl placeholder:text-outline/50 transition-all" 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="password">Password</label>
              <div className="relative input-focus-glow rounded-xl overflow-hidden transition-all duration-300">
                <input 
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface px-4 py-4 rounded-xl placeholder:text-outline/50 transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider text-sm mt-8" type="submit">
              Register
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account? 
              <Link className="text-secondary font-bold ml-2 hover:underline underline-offset-4 decoration-2 decoration-secondary/30 transition-all" to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
