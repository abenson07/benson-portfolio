import Link from "next/link";

import "@/app/home/vault.css";

function VaultArrow() {
  return (
    <svg
      className="vault__cta-arrow"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 14c3.5-1 6.5-5.5 8-9 0.4 3.2 1.2 6.5 4 8.5M12 5c2.5 2 5.5 3.2 8 2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type VaultSectionProps = {
  support: string;
  heading: string;
  cta: string;
  /** When set, the heading is a link. Otherwise it renders as plain text. */
  headingHref?: string;
  id?: string;
  figmaNode?: string;
  supportFigmaNode?: string;
  headingFigmaNode?: string;
  ctaFigmaNode?: string;
  showArrow?: boolean;
};

export function VaultSection({
  support,
  heading,
  cta,
  headingHref,
  id,
  figmaNode,
  supportFigmaNode,
  headingFigmaNode,
  ctaFigmaNode,
  showArrow = true,
}: VaultSectionProps) {
  const headingClassName = "vault__heading";

  return (
    <section className="vault" id={id} data-figma-node={figmaNode}>
      <div className="vault__pin">
        <div className="vault__sticky">
          <p className="vault__support" data-figma-node={supportFigmaNode}>
            {support}
          </p>
          {headingHref ? (
            <Link
              href={headingHref}
              className={headingClassName}
              data-figma-node={headingFigmaNode}
            >
              {heading}
            </Link>
          ) : (
            <p className={headingClassName} data-figma-node={headingFigmaNode}>
              {heading}
            </p>
          )}
          <span className="vault__cta" data-figma-node={ctaFigmaNode}>
            {cta}
            {showArrow ? <VaultArrow /> : null}
          </span>
        </div>
      </div>
    </section>
  );
}
