import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="KOM'MEL, retour à l'accueil"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src="/brand/logo-kommel.png"
        alt=""
        width={753}
        height={212}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
