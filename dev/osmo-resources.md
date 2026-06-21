# Osmo Supply resources

Purchase and implementation backlog. Each entry links to the Osmo resource, where it should live on the site, and any open decisions.

**Source:** [Osmo Supply](https://www.osmo.supply/)

---

## Initial site load (loading screen)

These apply to the **first visit / initial site load** only — not cross-page transitions.

| Resource | Link | Where / what |
|----------|------|--------------|
| Crisp loading animation | [crisp-loading-animation](https://www.osmo.supply/resource/crisp-loading-animation) | Loading animation should feel like **project images** from the portfolio. Runs on initial site load, after the site has finished loading (see progress indicator below). |
| Draw path cursor effect | [draw-path-cursor-effect](https://www.osmo.supply/resource/draw-path-cursor-effect) | Same initial loading screen. |
| Scroll progress number | [scroll-progress-number](https://www.osmo.supply/resource/scroll-progress-number) | Shows load progress on the initial loading screen. |
| Looping words with selector | [looping-words-with-selector](https://www.osmo.supply/resource/looping-words-with-selector) | **Alternative** to scroll progress number — pick one, not both. |

### Open decision: load progress UI

- **Option A:** [Scroll progress number](https://www.osmo.supply/resource/scroll-progress-number)
- **Option B:** [Looping words with selector](https://www.osmo.supply/resource/looping-words-with-selector)

---

## Page transitions (after site has loaded)

| Resource | Link | Where / what |
|----------|------|--------------|
| Overlapping parallax page transition | [overlapping-parallax-page-transition](https://www.osmo.supply/resource/overlapping-parallax-page-transition) | Transitions between **work pages** and back to **home**. Should also work for **any future pages** site-wide. Not for the initial load screen. |

---

## Home page — work & highlight items

| Resource | Link | Where / what |
|----------|------|--------------|
| Magnetic cursor | [magnetic-cursor](https://www.osmo.supply/resource/magnetic-cursor) | **Work items** on the home page — unless we go with an underline treatment instead. |
| Draw random underline | [draw-random-underline](https://www.osmo.supply/resource/draw-random-underline) | **Highlight items** on the home page — replaces the current circle treatment. |

### Open decision: work item hover

- **Option A:** [Magnetic cursor](https://www.osmo.supply/resource/magnetic-cursor) on work items
- **Option B:** Underline (TBD — not an Osmo resource listed here)

---

## 404 page

| Resource | Link | Where / what |
|----------|------|--------------|
| Draw path cursor effect | [draw-path-cursor-effect](https://www.osmo.supply/resource/draw-path-cursor-effect) | Same scribble/draw-path cursor as the initial loading screen — but used as a **maze mini-game** (see concept below). |

### Concept: maze 404

Use the draw-path cursor on a 404 page where the user is literally lost and has to find their way out.

**Core mechanic**

- The page is a **maze** (walls/paths drawn or implied on the 404 screen).
- The cursor draws a **line that follows the pointer** along a path — same Osmo draw-path behavior.
- The line has a **fixed max length** (only so many pixels). When the user runs out of line, they can't go further until they **backtrack** (move backward along their own trail) to reclaim length.
- Goal: navigate the maze from a start point to an **exit** (e.g. link back home, or a hidden “you found it” moment).

**Feel**

- Playful punishment for hitting a dead URL — you're stuck until you puzzle your way out.
- Backtracking is intentional: wrong turns cost line budget, so exploration feels like solving a maze rather than idle doodling.
- Could pair with minimal copy (“You're lost.” / “Find your way back.”) and no obvious nav until they escape.

**Implementation notes (for later)**

- Maze layout: pre-authored SVG/path or grid-generated; collision so the drawn line only advances along valid corridors.
- Line budget: track path length; trim from the tail when moving backward or when exceeding max pixels.
- Win state: reaching exit triggers navigation home or a reveal of normal site chrome.
- Reuse the same Osmo draw-path resource as the loading screen; maze logic is custom on top.

---

## Quick checklist (purchase)

- [ ] [Crisp loading animation](https://www.osmo.supply/resource/crisp-loading-animation)
- [ ] [Overlapping parallax page transition](https://www.osmo.supply/resource/overlapping-parallax-page-transition)
- [ ] [Draw path cursor effect](https://www.osmo.supply/resource/draw-path-cursor-effect) *(loading + 404)*
- [ ] [Magnetic cursor](https://www.osmo.supply/resource/magnetic-cursor) *(if not using underline on work items)*
- [ ] [Draw random underline](https://www.osmo.supply/resource/draw-random-underline)
- [ ] [Scroll progress number](https://www.osmo.supply/resource/scroll-progress-number) **OR** [Looping words with selector](https://www.osmo.supply/resource/looping-words-with-selector)

---

## Notes

_Add implementation notes, purchase dates, license keys, or integration decisions here as you go._
