export type ExperienceHoverCard = {
  eyebrow: string;
  title: string;
  imageUrl?: string;
};

export type ExperienceRow = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  hasHoverCard?: boolean;
  hoverCard?: ExperienceHoverCard;
};

export type ExperienceSection = {
  id: string;
  label: string;
  year: string;
  rows: ExperienceRow[];
};

export type ExperiencesContent = {
  hero: {
    lead: string;
    emphasis: string;
  };
  sections: ExperienceSection[];
};

export const experiencesContent: ExperiencesContent = {
  hero: {
    lead: "Recommending the right",
    emphasis: "TECHNOLOGY",
  },
  sections: [
    {
      id: "meta",
      label: "Meta",
      year: "2019",
      rows: [
        {
          id: "spend-better",
          title: "Spend Better",
          description:
            "In our journey towards smarter spending, we will explore innovative strategies that empower users to make informed decisions.",
          tags: ["Strategy", "Design", "Research"],
        },
        {
          id: "eclipse-rx",
          title: "Eclipse RX",
          description:
            "A wearable UV exposure tracker helping users understand safe sun exposure through real-time monitoring and personalized guidance.",
          tags: ["Product Design", "Research"],
          href: "/work/eclipse-rx",
          hasHoverCard: true,
          hoverCard: {
            eyebrow: "Eclipse RX",
            title: "Uncovering UV Safe Exposure",
            imageUrl: "/work/eclipse-rx.png",
          },
        },
        {
          id: "conversions-api",
          title: "Conversions API",
          description:
            "Streamlined event setup tooling that reduced integration friction for advertisers adopting server-side measurement.",
          tags: ["Product Design"],
          href: "/work/conversions-api",
        },
        {
          id: "event-setup-tool",
          title: "Event Setup Tool",
          description:
            "Guided setup flows that help teams configure tracking events with confidence and fewer support escalations.",
          tags: ["Product Design", "Strategy"],
          href: "/work/event-setup-tool",
        },
      ],
    },
    {
      id: "dave",
      label: "Dave",
      year: "2021",
      rows: [
        {
          id: "dave-plus",
          title: "Dave+ Positioning",
          description:
            "Research-led positioning work that clarified the value proposition for Dave's premium membership offering.",
          tags: ["Strategy", "Research"],
          href: "/work/dave-plus-positioning",
        },
        {
          id: "flexcard",
          title: "FlexCard",
          description:
            "End-to-end product design for a flexible spending card that adapts to users' financial needs in real time.",
          tags: ["Product Design"],
          href: "/work/flexcard",
          hasHoverCard: true,
          hoverCard: {
            eyebrow: "FlexCard",
            title: "Flexible Spending Reimagined",
            imageUrl: "/work/flexcard.png",
          },
        },
        {
          id: "setup-quality",
          title: "Setup Quality",
          description:
            "Diagnostic tooling and UX improvements that raised onboarding completion rates across key user segments.",
          tags: ["Product Design", "Research"],
          href: "/work/setup-quality",
        },
      ],
    },
    {
      id: "independent",
      label: "Independent",
      year: "2023",
      rows: [
        {
          id: "nutrilyze",
          title: "Nutrilyze",
          description:
            "A nutrition tracking app that makes macro logging effortless through photo recognition and smart suggestions.",
          tags: ["Product Design", "Strategy"],
          href: "/work/nutrilyze",
          hasHoverCard: true,
          hoverCard: {
            eyebrow: "Nutrilyze",
            title: "Nutrition Made Effortless",
            imageUrl: "/work/nutrilyze-cover.png",
          },
        },
        {
          id: "journey-map",
          title: "Journey Map",
          description:
            "Cross-functional journey mapping that aligned product, engineering, and leadership on priority user pain points.",
          tags: ["Strategy", "Research"],
          href: "/work/journey-map",
        },
      ],
    },
  ],
};
