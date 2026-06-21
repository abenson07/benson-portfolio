import Image from "next/image";
import Link from "next/link";

export function CaseStudyHeader() {
  return (
    <header className="case-study-header">
      <Link href="/" className="case-study-header__logo" aria-label="Home">
        <Image
          src="/signature-logo.png"
          alt=""
          width={120}
          height={48}
          className="case-study-header__logo-image"
          priority
        />
      </Link>

      <Link href="/" className="case-study-header__other-work">
        Other work
      </Link>
    </header>
  );
}
