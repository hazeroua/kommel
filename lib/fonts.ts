import localFont from "next/font/local";

/*
 * Polices auto-hébergées (fichiers woff2 dans app/fonts, licence SIL OFL).
 * next/font calcule une police de secours aux mêmes métriques : aucun saut de mise en page.
 *
 * Combinaison retenue : Gluten (titres) + Nunito (texte courant).
 */

export const gluten = localFont({
  src: "../app/fonts/gluten.woff2",
  variable: "--font-gluten",
  weight: "100 900",
  display: "swap",
});

export const nunito = localFont({
  src: "../app/fonts/nunito.woff2",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
});

export const fontVariables = `${gluten.variable} ${nunito.variable}`;
