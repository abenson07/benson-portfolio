import Image from "next/image";
import Link from "next/link";

type SignatureHeaderProps = {
  showStatus?: boolean;
  className?: string;
};

export function SignatureHeader({
  showStatus = true,
  className,
}: SignatureHeaderProps) {
  return (
    <header className={`signature-header${className ? ` ${className}` : ""}`}>
      <Link href="/" className="signature-header__logo" aria-label="Home">
        <Image
          src="/signature-logo.png"
          alt=""
          width={120}
          height={48}
          className="signature-header__logo-image"
          priority
        />
      </Link>

      {showStatus ? (
        <div className="signature-header__status">
          <span className="signature-header__status-label">Currently...</span>
          <span className="signature-header__status-value">Curious</span>
        </div>
      ) : null}
    </header>
  );
}
