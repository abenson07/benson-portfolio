export type Testimonial = {
  id: string;
  quote: string;
  emphasis: string;
  name: string;
  title: string;
  photoSrc: string;
  /** Stack placement relative to the previous card (rotated space). */
  rotation: number;
  offsetX: number;
  offsetY: number;
  /**
   * Fine position nudge in the image wrapper (unrotated screen space).
   * Use these to correct stacking after rotation without fighting the stack offsets.
   */
  nudgeX: number;
  nudgeY: number;
  figmaNode: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "mary-carnes",
    quote:
      "He brings a unique blend of experimentation and intentionality to the problems he solves",
    emphasis: "experimentation and intentionality",
    name: "Mary Carnes",
    title: "Senior Product Designer 2019",
    photoSrc: "/testimonials/mary.png",
    rotation: 2.84,
    offsetX: 0,
    offsetY: 0,
    nudgeX: 0,
    nudgeY: 0,
    figmaNode: "3051:41100",
  },
  {
    id: "nitar-lohaphasian",
    quote: "He is a visionary and I'd follow him anywhere.",
    emphasis: "I'd follow him anywhere.",
    name: "Nitar Lohaphasian",
    title: "Product Manager 2023",
    photoSrc: "/testimonials/nitar.png",
    rotation: -2.81,
    offsetX: -22,
    offsetY: 22,
    nudgeX: 0,
    nudgeY: 0,
    figmaNode: "3051:40795",
  },
  {
    id: "nate-olson",
    quote:
      "His best qualities stem from deep empathy for the end-user, his ability to listen, and his humble confidence to deliver.",
    emphasis: "his humble confidence to deliver",
    name: "Nate Olson",
    title: "VP of Client Solutions 2016",
    photoSrc: "/testimonials/nate.png",
    rotation: 7.03,
    offsetX: 54,
    offsetY: -22,
    nudgeX: 0,
    nudgeY: 0,
    figmaNode: "3051:40935",
  },
  {
    id: "alison-stark",
    quote:
      "true product mindset, unmatchable design skills... one of the most talented designers I have worked with",
    emphasis: "most talented designers",
    name: "Alison Stark",
    title: "Product Manager 2024",
    photoSrc: "/testimonials/alison.png",
    rotation: -0.27,
    offsetX: -54,
    offsetY: 2,
    nudgeX: 0,
    nudgeY: 0,
    figmaNode: "3051:40990",
  },
  {
    id: "winnie-liu",
    quote:
      "Alex is one of the best design partners I've ever had. I would jump at the opportunity to work with Alex again",
    emphasis: "would jump at the opportunity",
    name: "Winnie Liu",
    title: "UX Research Manager 2021",
    photoSrc: "/testimonials/winnie.png",
    rotation: 8.36,
    offsetX: 64,
    offsetY: -2,
    nudgeX: 0,
    nudgeY: 0,
    figmaNode: "3051:41045",
  },
];
