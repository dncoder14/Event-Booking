/**
 * Service Interfaces — Abstraction contracts for all service classes.
 *
 * Demonstrates the Polymorphism + Abstraction OOP principles:
 * - Any class that `implements` these interfaces is interchangeable
 *   at the controller level (polymorphic substitution).
 * - Controllers depend on the interface, not the concrete class,
 *   achieving Dependency Inversion (SOLID).
 *
 * Design Pattern: Strategy — a different concrete service (e.g., a
 * CachedEventService) can be swapped in without changing controllers.
 */

// ── Auth ────────────────────────────────────────────────────────────

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<{
    id: string; name: string; email: string; role: string;
  }>;
  login(email: string, password: string): Promise<{
    token: string;
    user: { id: string; name: string; email: string; role: string };
  }>;
  verifyToken(token: string): { id: string; role: string };
}

// ── Event ───────────────────────────────────────────────────────────

export interface IEventService {
  createEvent(data: {
    name: string;
    description: string;
    venue: string;
    eventDate: Date;
    rows: number;
    seatsPerRow: number;
    sections: string[];
    pricePerSeat: number;
    createdBy: string;
    bannerImage?: string;
    category?: string;
  }): Promise<unknown>;

  getAllEvents(filters?: { name?: string; venue?: string; category?: string }): Promise<unknown[]>;
  getEventById(id: string): Promise<unknown>;
  getEventSeats(eventId: string): Promise<unknown[]>;
  updateEvent(id: string, data: Partial<{ name: string; description: string; venue: string; eventDate: Date }>): Promise<unknown>;
  deleteEvent(id: string): Promise<unknown>;
}

// ── Booking ─────────────────────────────────────────────────────────

export interface IBookingService {
  lockSeats(eventId: string, seatIds: string[], userId: string): Promise<{
    booking: unknown;
    expiresAt: Date;
  }>;
  processPayment(bookingId: string, paymentMethod: string): Promise<{
    bookingId: string;
    qrCode: string;
    qrImage: string;
  }>;
  cancelBooking(bookingId: string, userId: string): Promise<unknown>;
  getBookingById(bookingId: string, userId: string): Promise<unknown>;
  getUserBookings(userId: string): Promise<unknown[]>;
  getAllBookings(): Promise<unknown[]>;
}

// ── Seat ────────────────────────────────────────────────────────────

export interface ISeatService {
  checkAndLock(seatIds: string[], userId: string): Promise<void>;
  getSeatsByIds(seatIds: string[]): Promise<unknown[]>;
  bookSeats(seatIds: string[]): Promise<unknown>;
  releaseSeats(seatIds: string[]): Promise<unknown>;
}

// ── Ticket ──────────────────────────────────────────────────────────

export interface ITicketService {
  generateTicket(bookingId: string): Promise<{ qrCode: string; qrImage: string }>;
  validateTicket(qrCode: string): Promise<unknown>;
}

// ── Payment ─────────────────────────────────────────────────────────

export interface IPaymentService {
  processTransaction(amount: number, method: string): { success: boolean; transactionId: string };
  refundTransaction(transactionId: string): boolean;
}
