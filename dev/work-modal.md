# Work modal

Smooth case-study overlay opened from the homepage (and anywhere linking to `/work/[slug]`). Reference implementation studied: Humaan `SmoothModal` (Framer Motion + Lenis). Ours uses **GSAP + ScrollTrigger** with the same DOM layering idea.

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
| `components/work/work-modal-shell.tsx` | Portal, GSAP enter/exit, scroll chrome |
| `app/work/work-modal.css` | Layout, header chrome, cream bg layer |
| `components/work/work-overlay-context.tsx` | `isOpen` for hero cursor + body state |
| `app/@modal/(.)work/[slug]/page.tsx` | Intercepted route → shell + `CaseStudyPage variant="modal"` |
| `content/work-pages.ts` | Project content source of truth |

## DOM structure (match Humaan’s layer split)

```
.work-modal (fixed, full viewport, portal to body)
├── .work-modal__backdrop          ← fades 0 → 0.5
└── .work-modal__panel             ← scroll container (full viewport, padding-inline 30px)
    └── .work-modal__inner         ← slides on y; margin-top: max(20vh, 200px)
        ├── .work-modal__bg        ← cream surface; expands on scroll (not the panel)
        ├── .work-modal__close
        └── .work-modal__content   → CaseStudyPage
```

**Important:** animate **`inner`**, not `panel`. Panel stays fixed as the scroller. The rounded “card” look is the bg layer + top margin, not inset positioning on the panel.

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
