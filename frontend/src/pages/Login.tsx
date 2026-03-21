import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await authApi.login(form);
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
            <span className="label-md uppercase tracking-[0.2em] text-secondary font-semibold mb-4 block">Exclusive Access</span>
            <h2 className="text-5xl font-extrabold font-headline leading-tight tracking-tight mb-6">Step into BookMyFun.</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">Join an elite community of night-dwellers and experience the most exclusive events curated for the modern aesthetic.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-secondary/20 flex items-center justify-center text-secondary font-bold">B</div>
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-tertiary/20 flex items-center justify-center text-tertiary font-bold">C</div>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">Over 10k VIPs already inside.</p>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-surface-container-lowest">
        <div className="w-full max-w-[460px]">
          <div className="mb-10">
            <h3 className="text-3xl font-bold font-headline mb-2">Welcome Back</h3>
            <p className="text-on-surface-variant">Please enter your credentials to access the platform.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={submit}>
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
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant" htmlFor="password">Password</label>
                <a className="text-xs font-medium text-primary hover:text-secondary transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative input-focus-glow rounded-xl overflow-hidden transition-all duration-300">
                <input 
                  className="w-full bg-surface-container-low border-none focus:outline-none focus:ring-1 focus:ring-primary/50 text-on-surface px-4 py-4 rounded-xl placeholder:text-outline/50 transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-tr from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider text-sm mt-8" type="submit">
              Sign In
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-on-surface-variant text-sm">
              New to the night? 
              <Link className="text-secondary font-bold ml-2 hover:underline underline-offset-4 decoration-2 decoration-secondary/30 transition-all" to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
