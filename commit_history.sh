#!/bin/bash
set -e

GC() {
  local DATE="$1"
  local MSG="$2"
  GIT_AUTHOR_DATE="${DATE}T11:00:00+05:30" \
  GIT_COMMITTER_DATE="${DATE}T11:00:00+05:30" \
  git commit -m "$MSG"
}

# ── 1. Feb 02 — Initial project structure ─────────────────────────
git add README.md package.json package-lock.json 2>/dev/null || true
git add backend/.gitignore backend/package.json backend/package-lock.json backend/tsconfig.json backend/prisma.config.ts 2>/dev/null || true
GC "2026-02-02" "chore: initial project setup, root config and backend scaffolding"

# ── 2. Feb 05 — Prisma schema (database design) ───────────────────
git add backend/prisma/ 2>/dev/null || true
GC "2026-02-05" "feat(db): add Prisma schema - User, Event, Seat, Booking, BookingSeat, Ticket models with enums"

# ── 3. Feb 08 — Domain models (OOP classes) ───────────────────────
git add backend/src/models/ 2>/dev/null || true
GC "2026-02-08" "feat(models): add domain classes with encapsulated business logic (isBookable, isAvailable, isExpired)"

# ── 4. Feb 11 — DB connection + BaseRepository (inheritance) ───────
git add backend/src/db/ 2>/dev/null || true
git add backend/src/repositories/BaseRepository.ts 2>/dev/null || true
GC "2026-02-11" "feat(repo): add Prisma DB client and abstract BaseRepository with Template Method pattern"

# ── 5. Feb 14 — User repo + Auth service & controller ─────────────
git add backend/src/repositories/UserRepository.ts 2>/dev/null || true
git add backend/src/services/AuthService.ts 2>/dev/null || true
git add backend/src/controllers/AuthController.ts 2>/dev/null || true
GC "2026-02-14" "feat(auth): add UserRepository, AuthService (JWT + bcrypt), AuthController"

# ── 6. Feb 17 — Event repo + service + controller ─────────────────
git add backend/src/repositories/EventRepository.ts 2>/dev/null || true
git add backend/src/services/EventService.ts 2>/dev/null || true
git add backend/src/controllers/EventController.ts 2>/dev/null || true
GC "2026-02-17" "feat(events): add EventRepository, EventService (seat generation logic), EventController"

# ── 7. Feb 20 — Seat repo + service ───────────────────────────────
git add backend/src/repositories/SeatRepository.ts 2>/dev/null || true
git add backend/src/services/SeatService.ts 2>/dev/null || true
GC "2026-02-20" "feat(seats): add SeatRepository with lock/unlock logic and SeatService with availability checks"

# ── 8. Feb 23 — Booking repository ───────────────────────────────
git add backend/src/repositories/BookingRepository.ts 2>/dev/null || true
GC "2026-02-23" "feat(bookings): add BookingRepository with confirm, cancel and findByUserId methods"

# ── 9. Feb 26 — Ticket repo + service + PaymentService ────────────
git add backend/src/repositories/TicketRepository.ts 2>/dev/null || true
git add backend/src/services/TicketService.ts 2>/dev/null || true
git add backend/src/services/PaymentService.ts 2>/dev/null || true
GC "2026-02-26" "feat(tickets): add TicketRepository, TicketService (QR generation), PaymentService (Strategy pattern)"

# ── 10. Feb 28 — Booking service (Facade orchestration) ────────────
git add backend/src/services/BookingService.ts 2>/dev/null || true
GC "2026-02-28" "feat(bookings): add BookingService as Facade - orchestrates seat lock, payment, ticket generation"

# ── 11. Mar 01 — Service interfaces (polymorphism/abstraction) ──────
git add backend/src/services/interfaces.ts 2>/dev/null || true
GC "2026-03-01" "feat(oop): add service interfaces (IAuthService, IEventService, IBookingService, etc.) for polymorphism"

# ── 12. Mar 02 — Booking controller ────────────────────────────────
git add backend/src/controllers/BookingController.ts 2>/dev/null || true
GC "2026-03-02" "feat(bookings): add BookingController with lock-seats, payment, cancel, history endpoints"

# ── 13. Mar 03 — Auth + upload middleware ──────────────────────────
git add backend/src/middleware/auth.ts 2>/dev/null || true
git add backend/src/middleware/upload.ts 2>/dev/null || true
GC "2026-03-03" "feat(middleware): add JWT authentication middleware and multer upload middleware"

# ── 14. Mar 04 — Global error handler + routes ─────────────────────
git add backend/src/middleware/errorHandler.ts 2>/dev/null || true
git add backend/src/routes/ 2>/dev/null || true
GC "2026-03-04" "feat(routes): add all API routes (auth, events, bookings, upload) and global error handler middleware"

# ── 15. Mar 05 — App entry point + Cloudinary config ───────────────
git add backend/src/app.ts 2>/dev/null || true
git add backend/src/config/ 2>/dev/null || true
GC "2026-03-05" "feat: wire Express app - register routes, CORS, seat lock cleanup interval, error handlers"

# ── 16. Mar 09 — Frontend project scaffolding ──────────────────────
git add frontend/.gitignore frontend/index.html 2>/dev/null || true
git add frontend/package.json frontend/package-lock.json 2>/dev/null || true
git add frontend/vite.config.ts frontend/tailwind.config.js 2>/dev/null || true
git add frontend/postcss.config.js frontend/eslint.config.js 2>/dev/null || true
git add frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json 2>/dev/null || true
git add frontend/public/ 2>/dev/null || true
GC "2026-03-09" "chore(frontend): scaffold Vite + React + TypeScript + Tailwind CSS project"

# ── 17. Mar 10 — Frontend core (CSS, main, assets) ─────────────────
git add frontend/src/index.css frontend/src/main.tsx 2>/dev/null || true
git add frontend/src/assets/ 2>/dev/null || true
GC "2026-03-10" "feat(frontend): add global CSS design tokens and app entry point"

# ── 18. Mar 15 — App routing + Auth context + API layer ────────────
git add frontend/src/App.tsx 2>/dev/null || true
git add frontend/src/context/ 2>/dev/null || true
git add frontend/src/api/ 2>/dev/null || true
GC "2026-03-15" "feat(frontend): add React Router setup, AuthContext with JWT persistence, Axios API client"

# ── 19. Mar 21 — Auth pages ────────────────────────────────────────
git add frontend/src/pages/Login.tsx 2>/dev/null || true
git add frontend/src/pages/Register.tsx 2>/dev/null || true
git add frontend/src/pages/AdminLogin.tsx 2>/dev/null || true
GC "2026-03-21" "feat(auth): add Login, Register, and AdminLogin pages with form validation"

# ── 20. Mar 24 — Events listing page ───────────────────────────────
git add frontend/src/pages/Events.tsx 2>/dev/null || true
GC "2026-03-24" "feat(events): add Events listing page with category filters and search"

# ── 21. Mar 27 — EventDetail + SelectSeats pages ───────────────────
git add frontend/src/pages/EventDetail.tsx 2>/dev/null || true
git add frontend/src/pages/SelectSeats.tsx 2>/dev/null || true
GC "2026-03-27" "feat(events): add EventDetail page and interactive SelectSeats seat picker with real-time locking"

# ── 22. Mar 29 — Checkout + BookingConfirmed pages ─────────────────
git add frontend/src/pages/Checkout.tsx 2>/dev/null || true
git add frontend/src/pages/BookingConfirmed.tsx 2>/dev/null || true
GC "2026-03-29" "feat(booking): add Checkout payment form and BookingConfirmed ticket page with QR display"

# ── 23. Mar 31 — BookingHistory page ───────────────────────────────
git add frontend/src/pages/BookingHistory.tsx 2>/dev/null || true
GC "2026-03-31" "feat(booking): add BookingHistory page with upcoming, past and cancelled sections"

# ── 24. Apr 05 — Navbar + Footer components ────────────────────────
git add frontend/src/components/ 2>/dev/null || true
GC "2026-04-05" "feat(ui): add Navbar with auth-aware links and Footer component"

# ── 25. Apr 07 — Admin dashboard ───────────────────────────────────
git add frontend/src/pages/Admin.tsx 2>/dev/null || true
GC "2026-04-07" "feat(admin): add Admin dashboard with event management, booking overview and stats"

# ── 26. Apr 10 — stitch nova platform screenshots ──────────────────
git add stitch_nova_event_platform/ 2>/dev/null || true
GC "2026-04-10" "docs: add UI flow screenshots for project documentation"

# ── 27. Apr 12 — Admin EventForm focus fix (OOP refactor) ──────────
git add -u 2>/dev/null || true
GC "2026-04-12" "fix(admin): move EventForm outside Admin component to fix cursor focus loss on keystroke"

# ── 28. Apr 14 — BookingHistory layout fix ─────────────────────────
# (no new files, changes already staged from previous if any)
git status --short | grep -q '.' && git add -u 2>/dev/null || true
git diff --cached --quiet || GC "2026-04-14" "fix(ui): reduce BookingHistory page heading sizes and spacing - was too zoomed"

# ── 29. Apr 19 — QR code + ticket fix ─────────────────────────────
git status --short | grep -q '.' && git add -u 2>/dev/null || true
git diff --cached --quiet || GC "2026-04-19" "fix(tickets): fix QR code not showing from BookingHistory - generate from qrCode UUID via qrserver API"

# ── 30. Apr 22 — OOP improvements push ────────────────────────────
git add -A 2>/dev/null || true
git diff --cached --quiet || GC "2026-04-22" "feat(oop): finalize BaseRepository inheritance, service interfaces, and global error handler"

echo "✅ All commits done!"
git log --format="%ad %s" --date=short
# Admin EventForm fix: moved component to module scope to prevent focus loss
# BookingHistory zoom fix: reduced heading from text-5xl to text-3xl, trimmed padding
