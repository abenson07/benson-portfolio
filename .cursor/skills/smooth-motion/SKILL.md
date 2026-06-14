---
name: smooth-motion
description: >-
  GSAP and CSS motion standards for this portfolio — crossfades, hover-driven
  state, debounced triggers, double-buffer layers, and reduced-motion support.
  Use when adding or tuning animations, transitions, crossfades, GSAP timelines,
  scroll/hover reveals, or when motion feels abrupt or duration tweaks have no effect.
---

# Smooth Motion

## Philosophy

Motion should feel **continuous and intentional**, never like a hard swap.

- Animate **opacity** for blends; scale/position are secondary garnish.
- **Never** stack two full-opacity layers and call it a crossfade.
- **Protect in-flight transitions** — don't kill timelines on every pointer move.
- **Decouple fast UI state from slow visual state** when hover/scrub drives backgrounds.
- **Wait for assets** (images, fonts) before starting entrance transitions.
- Honor `prefers-reduced-motion: reduce` with instant state commits.

## Default timings (tune per interaction)

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Background crossfade | 2.5–4s | `power2.inOut` (opacity), `power2.out` (scale) |
| List/scroll follow | 0.4–0.6s | `power2.out` |
| Micro UI (buttons, labels) | 0.15–0.25s | `ease` / `power2.out` |

Keep durations in **named constants** at the top of the file (`FADE_DURATION`, etc.) so they are easy to tune.

## Double-buffer crossfade (canonical pattern)

Reference: `components/work/work-background.tsx`

```
Layer A ←→ Layer B (ping-pong via activeSlotRef)

On change:
1. incoming = inactive slot, outgoing = active slot
2. Load asset into incoming; start only when ready (onload / complete)
3. incoming opacity 0 → 1, outgoing 1 → 0 (same duration, position 0)
4. Subtle scale on both layers in parallel (incoming 1.05→1, outgoing 1→1.03)
5. onComplete: hide outgoing, commit activeSlot + currentUrl
```

### State rules (critical)

- `activeSlotRef` and `currentUrlRef` update **only in `onComplete`** — never when the effect fires.
- If a new target arrives mid-transition: **queue** in `pendingUrlRef`, do **not** `kill()` the timeline.
- On complete, if `pendingUrlRef` differs from `currentUrlRef`, run the next crossfade.

### Opacity checklist

- [ ] Incoming starts at `opacity: 0`
- [ ] Outgoing starts at `opacity: 1`
- [ ] Both tween in parallel
- [ ] Incoming gets higher `zIndex` during blend
- [ ] `will-change: opacity` on layers (see `app/work/work.css`)

## Debounced visual state (canonical pattern)

Reference: `components/work/work-stage.tsx`

When pointer/hover updates **faster** than a crossfade can play:

- `activeIndex` — immediate (row highlight, accent, meta)
- `backgroundIndex` — debounced ~150–200ms before passing to `WorkBackground`

This prevents timeline restarts on every `mousemove` row crossing.

```tsx
useEffect(() => {
  if (activeIndex < 0) return;
  const timeout = window.setTimeout(() => setBackgroundIndex(activeIndex), 180);
  return () => window.clearTimeout(timeout);
}, [activeIndex]);
```

## Image / asset loading

```tsx
incomingImg.onload = runWhenReady;
incomingImg.onerror = runWhenReady;
incomingImg.src = nextUrl;

if (incomingImg.complete && incomingImg.naturalWidth > 0) {
  runWhenReady();
}
```

Clear handlers inside `runWhenReady` to avoid double-firing on cached images.

## Reduced motion

```tsx
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) {
  gsap.set(incomingLayer, { opacity: 1, zIndex: 1 });
  gsap.set(outgoingLayer, { opacity: 0, zIndex: 0 });
  finish(); // commit refs immediately
  return;
}
```

Also disable `will-change` and long GSAP durations in CSS `@media (prefers-reduced-motion: reduce)`.

## Debugging "duration changes do nothing"

Check in order:

1. Is the timeline **killed** on every prop change? → debounce or queue.
2. Are both layers at **opacity 1**? → add real opacity crossfade.
3. Is **slot state** updated before `onComplete`? → defer ref commits.
4. Is the effect short-circuiting (`currentUrl === imageUrl`) with stale refs?
5. Is `prefers-reduced-motion` enabled in OS/browser?

## Anti-patterns

```tsx
// ❌ Scale-only "transition" — both layers fully opaque
gsap.set(incomingLayer, { opacity: 1, zIndex: 2 });

// ❌ Kill and restart on every hover tick
timelineRef.current?.kill();
activeSlotRef.current = incomingSlot; // before animation finishes

// ❌ Same prop drives fast UI + slow background
<WorkBackground imageUrl={activeProject.imageUrl} />

// ❌ Magic numbers scattered in tweens
duration: 1.1
```

## Implementation checklist

Before shipping motion work:

- [ ] Named duration constants
- [ ] Real opacity crossfade for layer swaps
- [ ] Transition queue or debounce for rapid input
- [ ] Slot/state commits in `onComplete` only
- [ ] Asset-ready gate before starting
- [ ] Reduced-motion path tested
- [ ] Verify scrubbing vs dwelling — both should feel correct

## Project stack

- **GSAP** (`gsap`, `gsap.quickTo`) for timelines and scroll/list follow
- **CSS** for static `will-change`, scrims, and reduced-motion overrides
- **React refs** for imperative layer control — avoid fighting GSAP with React re-renders on every frame
