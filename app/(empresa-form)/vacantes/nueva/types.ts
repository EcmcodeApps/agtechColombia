/** Datos acumulados a lo largo del formulario multi-paso */
export interface VacanteFormData {
  // ─── Paso 1: Información General ─────────────────────────────────────────
  jobTitle: string;
  category: string;
  city: string;
  description: string;

  // ─── Paso 2: Requisitos ───────────────────────────────────────────────────
  educationLevel: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  hideSalary: boolean;
  selectedSkills: string[];
}

export const INITIAL_FORM_DATA: VacanteFormData = {
  jobTitle: "",
  category: "",
  city: "",
  description: "",
  educationLevel: "",
  experienceLevel: "",
  salaryMin: "",
  salaryMax: "",
  hideSalary: false,
  selectedSkills: [],
};

export const CATEGORIES = [
  { value: "ventas", label: "Ventas y Comercial" },
  { value: "gastronomia", label: "Gastronomía y Turismo" },
  { value: "logistica", label: "Logística y Bodega" },
  { value: "administrativo", label: "Administrativo" },
  { value: "servicios", label: "Servicios Generales" },
];

export const EDUCATION_LEVELS = [
  "Primaria completa",
  "Bachiller",
  "Técnico / Tecnólogo",
  "Universitario",
  "Especialización / Maestría",
];

export const EXPERIENCE_LEVELS = [
  "Sin experiencia",
  "Menos de 1 año",
  "1 a 2 años",
  "3 a 5 años",
  "Más de 5 años",
];

export const PREDEFINED_SKILLS = [
  "Atención al Cliente",
  "Ventas B2C",
  "Manejo de Inventario",
  "Liderazgo de Equipos",
  "Excel Básico",
  "Comunicación Asertiva",
];
