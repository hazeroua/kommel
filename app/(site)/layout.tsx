import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-pill focus:bg-bleu-roi focus:px-5 focus:py-3 focus:font-bold focus:text-blanc"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
