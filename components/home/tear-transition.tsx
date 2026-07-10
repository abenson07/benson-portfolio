import Image from "next/image";

import "@/app/home/tear.css";

type TearTransitionProps = {
  variant: "hero" | "footer";
};

const TEAR_SRC = {
  hero: "/home/tear.png",
  footer: "/home/tear-footer.png",
} as const;

export function TearTransition({ variant }: TearTransitionProps) {
  return (
    <div
      className={`tear-transition tear-transition--${variant}`}
      data-figma-node={variant === "hero" ? "3051:38055" : "3051:41119"}
    >
      <Image
        className="tear-transition__edge"
        src={TEAR_SRC[variant]}
        alt=""
        fill
        sizes="100vw"
        data-figma-node={variant === "hero" ? "3051:41177" : "3051:41120"}
        priority
        unoptimized
      />
    </div>
  );
}
