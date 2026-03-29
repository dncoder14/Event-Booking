import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsApi } from '../api';

export default function Checkout() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [error, setError] = useState('');

  useEffect(() => {
    bookingsApi.getById(bookingId!).then(r => {
      setBooking(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Booking not found');
      setLoading(false);
    });
  }, [bookingId]);

  const handlePayment = async () => {
    setPaying(true);
    setError('');
    try {
      const { data } = await bookingsApi.processPayment(bookingId!, paymentMethod);
      navigate(`/booking-success`, { state: { qrImage: data.qrImage, booking } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-surface text-center">
        <div>
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h2 className="text-2xl font-bold font-headline">{error || 'Booking not found'}</h2>
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-colors">Go Home</button>
        </div>
      </div>
    );
  }

  const seats = booking.bookingSeats?.map((bs: any) => bs.seat) ?? [];
  const tax = booking.totalAmount * 0.12;
  const total = booking.totalAmount + tax;

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-surface px-4 py-8">
      <div className="glass-panel w-full max-w-4xl overflow-hidden rounded-[2rem] shadow-[0_0_60px_rgba(139,92,246,0.15)] flex flex-col md:flex-row outline outline-white/5">

        {/* Left Side: Order Summary */}
        <section className="w-full md:w-[40%] bg-surface-container-low/50 p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">confirmation_number</span>
            <h2 className="font-headline font-bold text-xl tracking-tight uppercase">Order Summary</h2>
          </div>

          <div className="flex-1 space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
              {booking.event?.bannerImage ? (
                <img className="w-full h-full object-cover" alt={booking.event.name} src={booking.event.bannerImage} />
              ) : (
                <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-outline opacity-30">local_activity</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-xs font-label font-bold text-primary tracking-widest uppercase mb-1">Live Event</p>
                <p className="font-headline font-bold text-lg leading-tight">{booking.event?.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-on-surface-variant font-label text-sm uppercase tracking-wider">Seats</span>
                <span className="text-on-surface font-medium text-right max-w-[200px]">
                  {seats.length > 0 ? seats.map((s: any) => `${s.row}-${s.seatNumber}`).join(', ') : 'General'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-label text-sm uppercase tracking-wider">Subtotal</span>
                <span className="text-on-surface font-medium">${booking.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-label text-sm uppercase tracking-wider">Taxes & Fees</span>
                <span className="text-on-surface font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-auto">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] mb-1">Total Amount</p>
                  <p className="font-headline font-extrabold text-3xl text-primary">${total.toFixed(2)}</p>
                </div>
                <span className="material-symbols-outlined text-secondary/40 text-4xl">verified_user</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Payment Methods */}
        <section className="w-full md:w-[60%] p-8 flex flex-col bg-surface-container-lowest/30">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-headline font-extrabold text-2xl tracking-tighter uppercase text-white">Checkout</h1>
              <p className="text-on-surface-variant text-sm">Select your preferred payment method</p>
            </div>
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest/50 hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </header>

          <div className="space-y-4 mb-8">
            {/* Credit Card */}
            <div
              onClick={() => setPaymentMethod('CARD')}
              className={`group relative p-[1.5px] rounded-[1.5rem] cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'bg-gradient-to-br from-primary/50 to-secondary/50' : 'bg-transparent hover:bg-white/5'}`}
            >
              <div className="bg-surface-container-highest rounded-[1.4rem] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-1 ${paymentMethod === 'CARD' ? 'border-primary' : 'border-outline'}`}>
                      {paymentMethod === 'CARD' && <div className="w-full h-full bg-primary rounded-full"></div>}
                    </div>
                    <span className="font-headline font-bold text-lg">Credit Card</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                </div>

                {paymentMethod === 'CARD' && (
                  <div className="relative w-full aspect-[1.58/1] max-w-[320px] mx-auto bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 shadow-2xl overflow-hidden mb-2 mt-4 transition-all animate-fade-in">
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-on-primary text-3xl">contactless</span>
                        <div className="w-12 h-8 bg-white/30 rounded-md"></div>
                      </div>
                      <div className="space-y-4">
                        <p className="font-mono text-on-primary tracking-[0.2em] text-lg">**** **** **** 4242</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-on-primary/60 uppercase tracking-widest">Card Holder</p>
                            <p className="text-on-primary font-medium uppercase tracking-wider text-sm">Neon Member</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-on-primary/60 uppercase tracking-widest">Expires</p>
                            <p className="text-on-primary font-medium text-sm">12/26</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* UPI */}
            <div
              onClick={() => setPaymentMethod('UPI')}
              className={`flex items-center justify-between p-5 rounded-[1.25rem] transition-all cursor-pointer border ${paymentMethod === 'UPI' ? 'bg-surface-container-high border-secondary' : 'bg-surface-container-low hover:bg-surface-container-high border-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center p-[3px] ${paymentMethod === 'UPI' ? 'border-secondary' : 'border-outline'}`}>
                  {paymentMethod === 'UPI' && <div className="w-full h-full bg-secondary rounded-full"></div>}
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold">UPI / QR Scan</span>
                  <span className="text-xs text-on-surface-variant">Instant payment via any UPI app</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">qr_code_2</span>
            </div>

            {error && (
              <div className="p-3 bg-error/10 text-error border border-error/20 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Footer & CTA */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <span className="material-symbols-outlined text-secondary text-sm">lock</span>
              <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant">Secure 256-bit SSL Encrypted Payment</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying}
              className={`w-full h-16 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-3 transition-transform shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)] ${paying ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-70' : 'bg-gradient-to-br from-primary to-primary-container text-on-primary hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] active:scale-[0.98]'}`}
            >
              {paying ? (
                <>
                  <span>Processing...</span>
                  <div className="w-5 h-5 border-2 border-on-surface-variant/30 border-t-on-surface-variant rounded-full animate-spin"></div>
                </>
              ) : (
                <span>Pay Now</span>
              )}
            </button>

            <p className="text-center text-[11px] text-on-surface-variant mt-4">
              By clicking Pay Now, you agree to our Terms of Service and Refund Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
