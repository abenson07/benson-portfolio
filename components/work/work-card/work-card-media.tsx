import Image from "next/image";

import type { WorkCardMedia } from "@/content/work-card";

type WorkCardMediaProps = {
  media: WorkCardMedia;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function WorkCardMediaView({
  media,
  className = "work-card__media",
  sizes = "(max-width: 960px) 100vw, 72rem",
  priority = false,
}: WorkCardMediaProps) {
  if (media.type === "placeholder") {
    return (
      <div className={`${className} work-card__media--placeholder`}>
        <span className="work-card__placeholder-label">{media.label}</span>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <video
        className={className}
        autoPlay
        loop
        muted
        playsInline
        poster={media.poster}
        aria-label={media.alt ?? ""}
      >
        <source src={media.src} />
      </video>
    );
  }

  return (
    <div className="work-card__media-frame" key={media.src}>
      <Image
        src={media.src}
        alt={media.alt ?? ""}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        draggable={false}
        unoptimized
      />
    </div>
  );
}
