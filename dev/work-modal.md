# Work modal

Smooth case-study overlay opened from the homepage (and anywhere linking to `/work/[slug]`). Reference implementation studied: Humaan `SmoothModal` (Framer Motion + Lenis). Ours uses **Lenis + GSAP ScrollTrigger** with the same DOM layering idea.

## Routing

Next.js **parallel routes** + **intercepting routes**:

```
app/
  layout.tsx              → renders {children} + {modal}
  @modal/
    default.tsx           → null when no modal
    (.)work/[slug]/page.tsx → intercepts /work/[slug] from same origin (soft nav)
  work/[slug]/page.tsx    → full page on direct load / refresh
```

- Soft navigation from `/` → `/work/crema` shows the modal over the homepage.
- Hard navigation or refresh on `/work/crema` renders the full case study page (no modal shell).
- Close calls `router.back()` (or `/` if no history).

## Key files

| File | Role |
|------|------|
| `components/work/work-modal-shell.tsx` | Portal, GSAP enter/exit, Lenis scroll, scroll chrome |
| `components/work/work-page-shell.tsx` | Lenis on full-page case studies (`.work-page`) |
| `lib/motion/lenis-gsap.ts` | Lenis + ScrollTrigger scrollerProxy wiring |
| `app/work/work-modal.css` | Layout, header chrome, cream bg layer |
| `components/work/work-overlay-context.tsx` | `isOpen` for hero cursor + body state |
| `app/@modal/(.)work/[slug]/page.tsx` | Intercepted route → shell + `CaseStudyPage variant="modal"` |
| `content/work-pages.ts` | Project content source of truth |

## DOM structure (match Humaan’s layer split)

```
.work-modal (fixed, full viewport, portal to body)
├── .work-modal__backdrop          ← fades 0 → 0.5
└── .work-modal__panel             ← Lenis wrapper / scroll container (full viewport, padding-inline 30px)
    └── .work-modal__enter         ← slides on y for enter/exit (GSAP only)
        └── .work-modal__inner     ← Lenis content; margin-top card offset
        ├── .work-modal__bg        ← cream surface; expands on scroll (not the panel)
        ├── .work-modal__close
        └── .work-modal__content   → CaseStudyPage
```

**Important:** animate **`enter`**, not `inner` or `panel`. Panel stays fixed as the Lenis wrapper. Inner is Lenis scroll content only — GSAP and Lenis must not share the same transform target.

Do **not** put `display: flex` on the panel — it pins inner to viewport height and the cream bg stops at ~100vh.

## Enter / exit (GSAP)

Constants in `work-modal-shell.tsx`:

| Constant | Value | Notes |
|----------|-------|-------|
| `INNER_ENTER_DURATION` | 0.8s | Inner slide |
| `BACKDROP_ENTER_DURATION` | 0.5s | Linear backdrop |
| `EXIT_DURATION` | 0.5s | Both layers |
| `PANEL_EASE` | `expo.out` | ~Humaan `cubic-bezier(0.87, 0, 0.13, 1)` |
| `enterOffset` | `innerHeight - max(20vh, 200px)` | Start translateY |

- **Enter:** inner `y: enterOffset → 0`, backdrop `opacity: 0 → 0.5`
- **Exit:** inner `y → enterOffset + panel.scrollTop`, backdrop `opacity → 0`, then `router.back()`
- **`prefers-reduced-motion`:** instant state, no tweens

## Scroll chrome (first ~200px of panel scroll)

ScrollTrigger on `.work-modal__panel`, scrubbed over `max(20vh, 200px)`:

| Progress 0 → 1 | Desktop | Mobile (≤640px) |
|----------------|---------|-----------------|
| Bg inset (left/right/top) | 0 → -30px | 0 → -16px |
| Top border radius | 50px → 0 | 30px → 0 |
| Close button translate | 0 → (60px, -30px) | 0 → (35px, -15px) |

Inset end values match panel horizontal padding so the bg bleeds to viewport edges when expanded.

`--work-modal-chrome-progress` (0 → 1) drives homepage header logo invert + status label colors while scrolling.

## Background height

`.work-modal__bg` is `position: absolute` inside inner. A **ResizeObserver** on inner sets explicit `height` so cream covers all content, not just the first viewport. Height accounts for negative `top` inset during scroll chrome.

## Header & page interaction

When `body.work-modal-open`:

- `.page-wrapper` → `pointer-events: none` (homepage frozen underneath)
- `.signature-header` → `position: fixed; z-index: 110` above modal (z-index 100)
- Custom cursor hidden on homepage

Modal case study uses `variant="modal"` — no duplicate `SignatureHeader` inside content.

## Lenis + ScrollTrigger

Case studies use Lenis on `.work-modal__panel` (modal) and `.work-page:has(.case-study-page)` (direct load). GSAP still drives enter/exit, scroll chrome, and content reveals.

- `lib/motion/lenis-gsap.ts` creates Lenis, wires `lenis.on("scroll", ScrollTrigger.update)`, drives `lenis.raf` from `gsap.ticker`, and sets `ScrollTrigger.scrollerProxy` on the wrapper.
- Modal: Lenis initializes **after** the enter slide completes. GSAP animates `.work-modal__enter`; Lenis scrolls `.work-modal__inner`.
- Exit: read `lenis.scroll`, destroy Lenis, preserve scroll offset on `inner`, then GSAP exit on `enter`.
- `prefers-reduced-motion`: native overflow scroll, no Lenis.

## Case study scroll animations

`case-study-scroll-motion.tsx` resolves scroller via `.work-modal__panel` or `.work-page` so ScrollTrigger reveals work in both modal and full-page contexts.

## Tuning checklist

1. **Card too high/low at rest** → `--work-modal-top-offset` in `work-modal.css`
2. **Expand feels short/long** → `scrollDistance` in `getModalChrome()`
3. **Enter/exit speed** → `INNER_ENTER_DURATION` / `EXIT_DURATION`
4. **Cream cuts off on long pages** → check inner grows (no flex on panel) + ResizeObserver / `syncBgHeight`
5. **Header wrong color** → `--work-modal-chrome-progress` / chrome CSS on `body.work-modal-open`

## Motion standards

Follow `.cursor/skills/smooth-motion/SKILL.md` for crossfades and reduced-motion. Modal-specific: don’t kill enter timeline on re-renders; commit scroll chrome only after enter completes.
