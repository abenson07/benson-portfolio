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

export function VaultSection() {
  return (
    <section className="vault" data-figma-node="3051:39501">
      <div className="vault__pin">
        <div className="vault__sticky">
          <p className="vault__support" data-figma-node="3051:40790">
            15 years of experience doesn&apos;t fit on one page
          </p>
          <Link
            href="/work"
            className="vault__heading"
            data-figma-node="3051:40789"
          >
            SEE MORE
          </Link>
          <span className="vault__cta" data-figma-node="3051:40791">
            Click Here Now
            <VaultArrow />
          </span>
        </div>
      </div>
    </section>
  );
}
