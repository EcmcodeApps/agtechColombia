import { Timestamp } from "firebase/firestore";

// ── Usuario (colección: usuarios) ─────────────────────────────────────────────
export interface Usuario {
  uid: string;
  email: string;
  role: "candidato" | "empresa";
  createdAt: Timestamp;
  // empresa
  empresaNombre?: string;
  nit?: string;
  contacto?: string;
  onboardingCompleted?: boolean;
  // candidato
  nombre?: string;
  telefono?: string;
}

// ── Empresa — perfil extendido (colección: empresas) ─────────────────────────
export interface Empresa {
  uid: string;
  nombre: string;
  nit: string;
  logo?: string;
  logoUrl?: string;
  descripcion?: string;
  sector: string;
  tamano: "1-10" | "11-50" | "51-200" | "200+";
  ciudad: string;
  sitioWeb?: string;
  planActual: "gratis" | "pyme_pro" | "enterprise";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Vacante (colección: vacantes) ─────────────────────────────────────────────
export type VacanteEstado   = "activa" | "pausada" | "cerrada";
export type VacanteModalidad = "presencial" | "remoto" | "hibrido";
export type VacanteContrato  = "indefinido" | "fijo" | "obra_labor" | "prestacion";
export type VacanteJornada   = "completa" | "parcial" | "por_horas";

export interface Vacante {
  id: string;
  empresaId: string;
  empresaNombre: string;
  titulo: string;
  categoria: string;
  ciudad: string;
  modalidad: VacanteModalidad;
  salarioMin: number;
  salarioMax: number;
  experiencia: string;
  educacion: string;
  contrato: VacanteContrato;
  jornada: VacanteJornada;
  descripcion: string;
  requisitos: string[];
  habilidades: string[];
  beneficios: string[];
  estado: VacanteEstado;
  vistas: number;
  totalPostulaciones: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt?: Timestamp;
}

// ── Candidato — perfil extendido (colección: candidatos) ─────────────────────
export type Disponibilidad  = "inmediata" | "15_dias" | "30_dias" | "mas_de_30";
export type NivelIdioma     = "basico" | "intermedio" | "avanzado" | "nativo";

export interface ExperienciaLaboral {
  empresa: string;
  cargo: string;
  desde: string;
  hasta: string;
  actual: boolean;
  descripcion?: string;
}

export interface Educacion {
  institucion: string;
  titulo: string;
  desde: string;
  hasta: string;
}

export interface Habilidad {
  nombre: string;
  nivel: number; // 0-100
}

export interface Idioma {
  idioma: string;
  nivel: NivelIdioma;
}

export interface Certificacion {
  nombre: string;
  institucion: string;
  año: number;
  url?: string;
}

export interface Candidato {
  uid: string;
  nombre: string;
  email: string;
  telefono?: string;
  ciudad: string;
  titulo: string;
  avatar?: string;
  cvUrl?: string;
  resumen?: string;
  habilidades: Habilidad[];
  experiencia: ExperienciaLaboral[];
  educacion: Educacion[];
  idiomas: Idioma[];
  certificaciones: Certificacion[];
  salarioEsperado?: number;
  disponibilidad: Disponibilidad;
  modalidadPreferida: VacanteModalidad | "indiferente";
  verificado: boolean;
  profileCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Postulación (colección: postulaciones) ────────────────────────────────────
export type PostulacionEstado =
  | "nueva"
  | "revision"
  | "entrevista"
  | "oferta"
  | "contratado"
  | "rechazado";

export interface Postulacion {
  id: string;
  vacanteId: string;
  vacanteTitulo: string;
  empresaId: string;
  empresaNombre: string;
  candidatoId: string;
  candidatoNombre: string;
  candidatoAvatar?: string;
  estado: PostulacionEstado;
  matchScore: number; // 0-100
  notaInterna?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Match (colección: matches) ────────────────────────────────────────────────
export type MatchEstado = "pendiente" | "revisado" | "contactado" | "descartado";

export interface MatchBreakdown {
  categoria: string;
  score: number;
  explicacion: string;
}

export interface Match {
  id: string;
  vacanteId: string;
  vacanteTitulo: string;
  empresaId: string;
  candidatoId: string;
  candidatoNombre: string;
  candidatoTitulo: string;
  candidatoAvatar?: string;
  candidatoCiudad: string;
  score: number; // 0-100
  breakdown: MatchBreakdown[];
  razones?: string[];
  riesgos?: string[];
  habilidadesCoincidentes?: string[];
  tipo: "activo" | "pasivo"; // activo = candidato aplicó; pasivo = AI proactivo
  estado: MatchEstado;
  createdAt: Timestamp;
}

// ── Conversación + Mensaje (colecciones: conversaciones / conversaciones/{id}/mensajes) ──
export interface Conversacion {
  id: string;
  participantes: [string, string]; // [empresaId, candidatoId]
  vacanteId?: string;
  vacanteTitulo?: string;
  candidatoNombre: string;
  candidatoAvatar?: string;
  empresaNombre: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  lastSenderId: string;
  unreadCount: number;
  createdAt: Timestamp;
}

export interface Mensaje {
  id: string;
  senderId: string;
  texto: string;
  leido: boolean;
  createdAt: Timestamp;
}
