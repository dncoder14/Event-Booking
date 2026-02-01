# Sequence Diagram
## Main Flow: Event Ticket Booking (End-to-End)

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthController
    participant EventController
    participant BookingController
    participant BookingService
    participant SeatService
    participant PaymentService
    participant TicketService
    participant Database
    
    User->>Frontend: Login
    Frontend->>AuthController: POST /api/auth/login
    AuthController->>Database: Validate credentials
    Database-->>AuthController: User data
    AuthController-->>Frontend: JWT Token
    Frontend-->>User: Login successful
    
    User->>Frontend: Browse events
    Frontend->>EventController: GET /api/events
    EventController->>Database: Fetch events
    Database-->>EventController: Event list
    EventController-->>Frontend: Events data
    Frontend-->>User: Display events
    
    User->>Frontend: Select event & view seats
    Frontend->>EventController: GET /api/events/:id/seats
    EventController->>Database: Fetch seat layout
    Database-->>EventController: Seat availability
    EventController-->>Frontend: Seat data
    Frontend-->>User: Show seat layout
    
    User->>Frontend: Select seats
    Frontend->>BookingController: POST /api/bookings/lock-seats
    BookingController->>BookingService: lockSeats(eventId, seatIds, userId)
    BookingService->>SeatService: checkAvailability(seatIds)
    SeatService->>Database: SELECT seats WHERE id IN (...)
    Database-->>SeatService: Seat status
    
    alt Seats Available
        SeatService->>Database: UPDATE seats SET status='LOCKED', locked_until=NOW()+10min
        Database-->>SeatService: Lock successful
        SeatService-->>BookingService: Seats locked
        BookingService->>Database: INSERT INTO bookings (status='PENDING')
        Database-->>BookingService: Booking created
        BookingService-->>BookingController: Booking ID + Lock expiry
        BookingController-->>Frontend: 200 OK {bookingId, expiresAt}
        Frontend-->>User: Proceed to payment (10 min timer)
    else Seats Unavailable
        SeatService-->>BookingService: Seats not available
        BookingService-->>BookingController: Error
        BookingController-->>Frontend: 409 Conflict
        Frontend-->>User: Seats already taken
    end
    
    User->>Frontend: Confirm payment
    Frontend->>BookingController: POST /api/bookings/:id/payment
    BookingController->>BookingService: processPayment(bookingId, paymentDetails)
    BookingService->>PaymentService: processTransaction(amount, method)
    PaymentService-->>BookingService: Payment successful
    
    BookingService->>Database: BEGIN TRANSACTION
    BookingService->>Database: UPDATE bookings SET status='CONFIRMED', payment_status='PAID'
    BookingService->>Database: UPDATE seats SET status='BOOKED', user_id=userId
    BookingService->>Database: COMMIT TRANSACTION
    
    BookingService->>TicketService: generateTicket(bookingId)
    TicketService->>Database: INSERT INTO tickets (qr_code, booking_id)
    Database-->>TicketService: Ticket created
    TicketService-->>BookingService: Ticket data
    
    BookingService-->>BookingController: Booking confirmed
    BookingController-->>Frontend: 200 OK {booking, ticket}
    Frontend-->>User: Booking successful + Download ticket
```

### Key Flow Points
1. **Authentication**: User logs in and receives JWT token
2. **Event Browsing**: User views available events
3. **Seat Selection**: User selects seats, triggering temporary lock (10 min)
4. **Payment Processing**: User completes payment within lock period
5. **Booking Confirmation**: Transaction commits, seats marked as BOOKED
6. **Ticket Generation**: QR-based digital ticket created and delivered
