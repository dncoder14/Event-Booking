export enum Role { USER = 'USER', ADMIN = 'ADMIN' }
export enum SeatStatus { AVAILABLE = 'AVAILABLE', LOCKED = 'LOCKED', BOOKED = 'BOOKED' }
export enum BookingStatus { PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', CANCELLED = 'CANCELLED' }
export enum PaymentStatus { PENDING = 'PENDING', PAID = 'PAID', REFUNDED = 'REFUNDED' }

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: Role,
    public createdAt: Date
  ) {}

  toJSON() {
    return { id: this.id, name: this.name, email: this.email, role: this.role };
  }
}

export class Event {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public venue: string,
    public category: string,
    public eventDate: Date,
    public totalSeats: number,
    public availableSeats: number,
    public bannerImage: string | null,
    public createdBy: string
  ) {}

  isBookable(): boolean {
    return this.availableSeats > 0 && new Date() < this.eventDate;
  }
}

export class Seat {
  constructor(
    public id: string,
    public eventId: string,
    public seatNumber: string,
    public row: string,
    public section: string,
    public price: number,
    public status: SeatStatus,
    public lockedUntil: Date | null,
    public lockedBy: string | null
  ) {}

  isAvailable(): boolean {
    if (this.status === SeatStatus.BOOKED) return false;
    if (this.status === SeatStatus.LOCKED && this.lockedUntil && this.lockedUntil > new Date()) return false;
    return true;
  }
}

export class Booking {
  constructor(
    public id: string,
    public userId: string,
    public eventId: string,
    public totalAmount: number,
    public status: BookingStatus,
    public paymentStatus: PaymentStatus,
    public transactionId: string | null,
    public paymentMethod: string | null,
    public createdAt: Date
  ) {}

  isExpired(): boolean {
    const tenMinutes = 10 * 60 * 1000;
    return this.status === BookingStatus.PENDING && Date.now() - this.createdAt.getTime() > tenMinutes;
  }
}

export class Ticket {
  constructor(
    public id: string,
    public bookingId: string,
    public qrCode: string,
    public isValid: boolean,
    public issuedAt: Date
  ) {}
}
