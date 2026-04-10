# Design System Specification: Cinematic Immersion

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Nocturne."** This system is designed to evoke the feeling of a premium, after-hours event—where light pierces through the darkness to create focus, and depth is felt rather than seen. 

We are moving away from the "flat web" and into a space of **Cinematic Editorial.** This means breaking the rigid grid with intentional asymmetry, allowing content to bleed across containers, and using light (neon accents) to guide the user's eye. The goal is to make the user feel like they are interacting with a physical space, using layered glass and soft luminescence to create a sense of high-end exclusivity.

## 2. Colors & Surface Philosophy
The palette is rooted in the depth of the night, using deep charcoals and blacks to provide a high-contrast stage for neon accents.

### Color Tokens
- **Background & Foundation:** `surface` (#131314) and `surface_container_lowest` (#0e0e0f).
- **Primary Accent:** `primary` (#d0bcff) / Electric Purple (#8B5CF6).
- **Secondary Accent:** `secondary` (#4cd7f6) / Cyan (#06B6D4).
- **Tertiary/Highlight:** `tertiary` (#ffb869) for specialized event categories or "VIP" statuses.

### The "No-Line" Rule
To maintain a premium feel, **1px solid borders are prohibited for sectioning.** We do not define space with lines; we define it with light and shadow. 
- Use background shifts (e.g., placing a `surface_container_high` card on a `surface` background) to create boundaries.
- **Surface Hierarchy:** Treat the UI as layers of frosted glass.
    - **Base Layer:** `surface` (The foundation).
    - **Secondary Layer:** `surface_container_low` (Navigation bars, secondary content).
    - **Elevated Layer:** `surface_container_highest` (Active cards, modals).

### The "Glass & Gradient" Rule
Floating elements (Modals, Hover states, Player bars) must utilize **Glassmorphism.** 
- **Recipe:** Use a semi-transparent version of `surface_container_high` (approx 60-80% opacity) with a `backdrop-blur` of 20px to 40px.
- **Signature Textures:** Use subtle linear gradients for primary actions, transitioning from `primary` (#d0bcff) to `primary_container` (#a078ff) at a 135-degree angle. This adds a "soul" to the UI that flat color cannot provide.

## 3. Typography
The typography scale is designed to feel editorial and authoritative. We use **Plus Jakarta Sans** for high-impact display moments and **Inter** for precision and legibility in data-heavy areas.

- **Display (Large/Medium):** Reserved for hero event titles. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create a "bold poster" look.
- **Headlines:** `headline-lg` (2rem) and `headline-md` (1.75rem). These should be high-contrast (`on_surface`) to stand out against the dark background.
- **Body:** Use `body-lg` (1rem) for descriptions. Ensure line heights are generous (1.5 - 1.6) to allow the "dark" theme to breathe.
- **Labels:** `label-md` (0.75rem) should always be in uppercase with 0.05em letter-spacing when used for categories or metadata to ensure a sophisticated, curated feel.

## 4. Elevation & Depth
In this design system, depth is achieved through **Tonal Layering** rather than traditional drop shadows.

- **The Layering Principle:** Place a `surface_container_lowest` card inside a `surface_container_low` section to create a "recessed" look. Place a `surface_container_highest` element on top of a `surface` background to create "lift."
- **Ambient Glows:** When an element must "float" (like a primary CTA or a featured event card), use an **Ambient Glow** instead of a shadow. Use the `primary` color at 10% opacity with a blur of 40px to 60px. This mimics the way neon light interacts with a dark room.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at 15% opacity. This creates a "hairline" suggestion of a container without breaking the cinematic immersion.

## 5. Components

### Buttons
- **Primary:** Gradient-fill (`primary` to `primary_container`) with `on_primary` text. Use `xl` (1.5rem) rounding. On hover, increase the ambient glow intensity.
- **Secondary:** Glass-fill. `surface_container_high` at 40% opacity with a 1px `outline_variant` at 20% opacity. 
- **Interaction:** All buttons must have a subtle scale-down effect (0.98) on click to feel tactile.

### Event Cards
- **Construction:** No dividers. Use `xl` (1.5rem) corner radius. 
- **Visuals:** Images should have a subtle black-to-transparent gradient overlay on the bottom 40% to allow `title-md` text to sit directly on the image.
- **Hover:** The card should shift from `surface_container_low` to `surface_container_high` with a subtle lift (ambient glow).

### Chips & Tags
- **Status Chips:** Use `secondary_container` for "Live" or "Trending" with a small 4px pulse animation using the `secondary` color. 
- **Filter Chips:** Selection is indicated by a shift from `surface_variant` to `primary` with `on_primary` text.

### Input Fields
- **Styling:** Use `surface_container_lowest` for the field background. 
- **States:** On focus, the field should not have a thick border. Instead, use a 1px "Ghost Border" of the `primary` color and a soft `primary` outer glow.

### Tooltips & Overlays
- **Blur:** Always use `backdrop-blur` (16px) for any element that sits above the main content to maintain the "Glassmorphism" theme.

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Let images bleed off the edge of the grid or overlap container boundaries to create a high-end editorial feel.
- **Embrace the Dark:** Allow for large areas of `surface_container_lowest`. Negative space in a dark theme creates luxury.
- **Use Tonal Transitions:** Use the `surface_container` tiers to guide the user from the most important content (Highest) to the least (Lowest).

### Don't:
- **No Pure White Text:** Avoid `#FFFFFF`. Use `on_surface` (#e5e2e3) to reduce eye strain and maintain the cinematic tone.
- **No Hard Borders:** Never use a 100% opaque border to separate content. It breaks the "liquid" feel of the system.
- **No Standard Shadows:** Avoid "Drop Shadow" presets. If it doesn't look like light refracting through glass, it doesn't belong.
- **No Grid Rigidity:** Don't feel forced to align every element to a 12-column grid. Let the typography and imagery dictate a more fluid, "magazine-style" flow.