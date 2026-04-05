import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p: string) => location.pathname === p;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131314]/80 backdrop-blur-[20px] shadow-[0_0_40px_rgba(139,92,246,0.1)]">
      <div className="flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8 md:gap-12">
          <Link to="/" className="text-2xl font-black tracking-tighter text-[#d0bcff] uppercase font-headline">BookMyFun</Link>
          
          <div className="hidden md:flex gap-6">
            <Link to="/" className={`font-medium font-headline tracking-[-0.02em] transition-all duration-300 ${isActive('/') ? 'text-[#d0bcff] border-b-2 border-[#8B5CF6] pb-1' : 'text-[#e5e2e3]/70 hover:text-[#4cd7f6]'}`}>Explore</Link>
            {user && (
              <Link to="/bookings" className={`font-medium font-headline tracking-[-0.02em] transition-all duration-300 ${isActive('/bookings') ? 'text-[#d0bcff] border-b-2 border-[#8B5CF6] pb-1' : 'text-[#e5e2e3]/70 hover:text-[#4cd7f6]'}`}>Bookings</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className={`font-medium font-headline tracking-[-0.02em] transition-all duration-300 ${isActive('/admin') ? 'text-[#d0bcff] border-b-2 border-[#8B5CF6] pb-1' : 'text-[#e5e2e3]/70 hover:text-[#4cd7f6]'}`}>Admin</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-outline-variant/30 cursor-pointer text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button onClick={() => { logout(); navigate('/login'); }} className="text-sm font-bold text-on-surface-variant hover:text-error transition-colors">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 md:py-2.5 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-outline-variant/10 to-transparent"></div>
    </nav>
  );
}
