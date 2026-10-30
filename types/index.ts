// =====================================================================
// KOM'MEL — Types & constantes partagés
// =====================================================================

// ----- Couleurs d'accent -----
export const accentColors = ["corail", "pervenche", "moutarde", "vert-sauge", "rose"] as const;
export type AccentColor = (typeof accentColors)[number];

export const accentLabels: Record<AccentColor, string> = {
  corail: "Corail",
  pervenche: "Pervenche",
  moutarde: "Moutarde",
  "vert-sauge": "Vert sauge",
  rose: "Rose",
};

// ----- Posts -----
export const postKinds = ["actualite", "evenement"] as const;
export type PostKind = (typeof postKinds)[number];

export const postKindLabels: Record<PostKind, string> = {
  actualite: "Actualité",
  evenement: "Événement",
};

export const postStatuses = ["brouillon", "publie"] as const;
export type PostStatus = (typeof postStatuses)[number];

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  kind: PostKind;
  status: PostStatus;
  published_on: string;
  cover_url: string | null;
  cover_alt: string;
  content: RichNode | null;
  image_rights_ok: boolean;
  created_at: string;
  updated_at: string;
}

// ----- Témoignages -----
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  color: AccentColor;
  visible: boolean;
  sort_order: number;
  created_at: string;
}

// ----- Chiffres clés -----
export interface Stat {
  id: string;
  prefix: string;
  value: number;
  suffix: string;
  label: string;
  color: AccentColor;
  sort_order: number;
}

// ----- Statuts de demande / message -----
export const requestStatuses = ["nouvelle", "en_cours", "traitee"] as const;
export type RequestStatus = (typeof requestStatuses)[number];

export const requestStatusLabels: Record<RequestStatus, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  traitee: "Traitée",
};

// ----- Demandes d'intervention -----
export const structureTypes = ["ecole", "college", "lycee", "universite", "club", "autre"] as const;
export type StructureType = (typeof structureTypes)[number];

export const structureTypeLabels: Record<StructureType, string> = {
  ecole: "École",
  college: "Collège",
  lycee: "Lycée",
  universite: "Université / Grandes écoles",
  club: "Club sportif",
  autre: "Autre structure",
};

export const actionTypes = ["scolaire", "club", "tout-public", "autre"] as const;
export type ActionType = (typeof actionTypes)[number];

export const actionTypeLabels: Record<ActionType, string> = {
  scolaire: "Intervention scolaire",
  club: "Club / Association",
  "tout-public": "Événement tout public",
  autre: "Autre",
};

export interface InterventionRequest {
  id: string;
  structure_name: string;
  structure_type: StructureType;
  contact_name: string;
  email: string;
  phone: string | null;
  youth_age: string;
  participants: number | null;
  desired_dates: string | null;
  action_type: ActionType;
  message: string | null;
  status: RequestStatus;
  created_at: string;
}

// ----- Messages de contact -----
export const messageKinds = ["contact", "partenariat", "benevolat"] as const;
export type MessageKind = (typeof messageKinds)[number];

export const messageKindLabels: Record<MessageKind, string> = {
  contact: "Contact",
  partenariat: "Partenariat",
  benevolat: "Bénévolat",
};

export interface ContactMessage {
  id: string;
  kind: MessageKind;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  topic: string | null;
  message: string;
  status: RequestStatus;
  created_at: string;
}

// ----- Éditeur riche (Tiptap JSON) -----
export interface RichNode {
  type: string;
  content?: RichNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
}
