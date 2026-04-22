import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import SelectSeats from './pages/SelectSeats';
import Checkout from './pages/Checkout';
import BookingConfirmed from './pages/BookingConfirmed';
import BookingHistory from './pages/BookingHistory';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? children : <Navigate to="/admin/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/seats" element={<PrivateRoute><SelectSeats /></PrivateRoute>} />
          <Route path="/checkout/:bookingId" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/booking-success" element={<PrivateRoute><BookingConfirmed /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
