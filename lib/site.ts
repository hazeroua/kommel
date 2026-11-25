export const site = {
  name: "KOM'MEL",
  tagline: "Révéler la force des jeunes par le sport",
  description:
    "KOM'MEL accompagne les jeunes, et les jeunes filles en particulier, vers l'émancipation par le sport et l'éducation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    phone: "06 51 78 36 12",
    phoneHref: "tel:+33651783612",
    email: "associationkommel@gmail.com",
  },
  // Identifiants à confirmer avec l'association
  /**
   * Lien de la cagnotte HelloAsso (celui de la bio Instagram).
   * Peut être remplacé via la variable NEXT_PUBLIC_HELLOASSO_URL.
   */
  helloAssoUrl:
    process.env.NEXT_PUBLIC_HELLOASSO_URL ||
    "https://www.helloasso.com/associations/kom-mel-kml/adhesions/lancement-kom-mel",
  /** Brochure : déposer le fichier dans public/docs/ avec exactement ce nom. */
  brochureFile: "brochure-kommel.pdf",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/associationkommel" },
    { label: "Facebook", href: "https://www.facebook.com/associationkommel" },
    { label: "TikTok", href: "https://www.tiktok.com/@associationkommel" },
  ],
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "L'association", href: "/association" },
  { label: "L'équipe", href: "/equipe" },
  { label: "Nos actions", href: "/actions" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

export const supportHref = "/nous-soutenir";
export const volunteerHref = "/devenir-benevole";

export const legalNav: NavItem[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
];
