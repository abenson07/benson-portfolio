"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/work", label: "Work" },
  { href: "/expertise", label: "Expertise" },
  { href: "/skills", label: "Skills" },
] as const;

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type TopNavProps = {
  variant?: "default" | "work";
};

export function TopNav({ variant = "default" }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header
      className={`top-nav${variant === "work" ? " top-nav--work" : ""}`}
    >
      <Link href="/" className="top-nav__logo" aria-label="Home">
        <svg
          width="40"
          height="24"
          viewBox="0 0 40 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M6 18C8 8 14 4 20 4C26 4 32 8 34 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10 20C12 12 16 9 20 9C24 9 28 12 30 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Link>

      <nav className="top-nav__pill" aria-label="Primary">
        {navItems.map((item) => {
          const isActive = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`top-nav__link${isActive ? " top-nav__link--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="top-nav__status">
        <span className="top-nav__status-label">Currently...</span>
        <span className="top-nav__status-value">Curious</span>
      </div>
    </header>
  );
}
