export const CV_STORAGE_KEY = "talentoya.cv.formato-sidebar";

export interface CvExperience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface CvEducation {
  title: string;
  institution: string;
  period: string;
}

export interface CvData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  photoUrl: string;
  about: string;
  skills: string[];
  education: CvEducation[];
  experience: CvExperience[];
}

export const DEFAULT_CV: CvData = {
  fullName: "Carla Rodríguez",
  headline: "Lic. en Contabilidad",
  email: "hola@sitioincreible.com",
  phone: "+57 300 123 4567",
  website: "www.sitioincreible.com",
  city: "Bogotá, Colombia",
  photoUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDuN9hRkYw6t-RnSw4ybb9yf9SMKGQVms3pH-RZm5RWunsBf6U-H9dllKNheGk2UhAzSDVI9-aLp3_ngV0zba9901h6lUxsdSaxjlYu86iF3-_0Ugr7EWLhAUXx9ssTkgriGp-Bhsrv3yZReB7AurpH-c-JwZ_aEbcn7YcE9tOT4sqv2PCTk9O0O6qM4NkIOhKShso8pR91iVDCpBNOED1JgnkfVM2fc3AIVvaatmEf9QwigY1lEcPrrPWGdRFNl2mdzXmfjKWVM4Fb",
  about:
    "Profesional con experiencia en gestión contable, análisis financiero y elaboración de reportes para equipos administrativos. Me destaco por la organización, la comunicación asertiva y la capacidad para resolver problemas con criterio práctico.",
  skills: [
    "Liderazgo",
    "Comunicación asertiva",
    "Gestión de activos",
    "Resolución de problemas",
    "Elaboración de reportes",
    "Trabajo en equipo",
  ],
  education: [
    {
      title: "Licenciatura en Contabilidad",
      institution: "Universidad Alta Pinta",
      period: "2010 - 2014",
    },
    {
      title: "Diplomado en Finanzas",
      institution: "Universidad Alta Pinta",
      period: "2014 - 2016",
    },
  ],
  experience: [
    {
      role: "Área de Contabilidad",
      company: "Empresa Borcelle",
      period: "2010 - 2012",
      description:
        "Apoyo en procesos contables, conciliaciones, seguimiento documental y preparación de reportes administrativos para cierres mensuales.",
    },
    {
      role: "Analista Contable",
      company: "Empresa Borcelle",
      period: "2012 - 2014",
      description:
        "Gestión de activos, revisión de cuentas y coordinación con áreas internas para mantener información financiera actualizada.",
    },
    {
      role: "Coordinadora Financiera",
      company: "Empresa Borcelle",
      period: "2014 - 2016",
      description:
        "Liderazgo de reportes ejecutivos, análisis presupuestal y mejora de procesos para reducir tiempos de entrega.",
    },
  ],
};

export function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
