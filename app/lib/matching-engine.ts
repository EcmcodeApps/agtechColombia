import type { Candidato, Match, MatchBreakdown, Vacante } from "./types";

const WEIGHTS = {
  habilidades: 0.35,
  experiencia: 0.25,
  ubicacion: 0.15,
  salario: 0.1,
  formacion: 0.1,
  disponibilidad: 0.05,
};

const clean = (v = "") =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const yearsFromText = (txt = "") => {
  const m = clean(txt).match(/(\d+)/);
  return m ? Number(m[1]) : 0;
};

const yearsFromCandidate = (c: Candidato) => {
  if (!c.experiencia?.length) return 0;
  return c.experiencia.reduce((total, e) => {
    const from = Number((e.desde || "").slice(0, 4));
    const to = e.actual ? new Date().getFullYear() : Number((e.hasta || "").slice(0, 4));
    return total + (from && to && to >= from ? to - from : 2);
  }, 0);
};

const candidateSkills = (c: Candidato) => c.habilidades?.map(h => h.nombre) ?? [];

function scoreSkills(v: Vacante, c: Candidato) {
  const req = v.habilidades.map(clean).filter(Boolean);
  const cand = candidateSkills(c).map(clean).filter(Boolean);
  if (!req.length) return 70;
  const hits = req.filter(r => cand.some(s => s.includes(r) || r.includes(s)));
  return clamp((hits.length / req.length) * 100);
}

function scoreExperience(v: Vacante, c: Candidato) {
  const needed = Math.max(1, yearsFromText(v.experiencia));
  const years = yearsFromCandidate(c);
  if (!years) return 45;
  return clamp((years / needed) * 100);
}

function scoreLocation(v: Vacante, c: Candidato) {
  const sameCity = clean(v.ciudad) === clean(c.ciudad);
  const modeOk =
    c.modalidadPreferida === "indiferente" ||
    c.modalidadPreferida === v.modalidad ||
    v.modalidad === "hibrido";
  return sameCity && modeOk ? 100 : sameCity || modeOk ? 75 : 45;
}

function scoreSalary(v: Vacante, c: Candidato) {
  if (!c.salarioEsperado || (!v.salarioMin && !v.salarioMax)) return 70;
  if (c.salarioEsperado >= v.salarioMin && c.salarioEsperado <= v.salarioMax) return 100;
  if (c.salarioEsperado < v.salarioMin) return 85;
  const gap = ((c.salarioEsperado - v.salarioMax) / Math.max(v.salarioMax, 1)) * 100;
  return clamp(100 - gap * 2);
}

function scoreEducation(v: Vacante, c: Candidato) {
  const target = clean(v.educacion);
  const edu = c.educacion?.map(e => clean(`${e.titulo} ${e.institucion}`)).join(" ") ?? "";
  const certs = c.certificaciones?.map(x => clean(x.nombre)).join(" ") ?? "";
  if (!target) return 75;
  if (edu.includes(target) || certs.includes(target)) return 100;
  if (target.includes("bachiller") || target.includes("tecnico")) return c.educacion?.length ? 85 : 55;
  return c.educacion?.length || c.certificaciones?.length ? 75 : 45;
}

function scoreAvailability(c: Candidato) {
  return ({ inmediata: 100, "15_dias": 85, "30_dias": 70, mas_de_30: 50 } as const)[c.disponibilidad] ?? 65;
}

const explain = (categoria: string, score: number, explicacion: string): MatchBreakdown => ({
  categoria,
  score,
  explicacion,
});

export function calculateMatch(v: Vacante, c: Candidato): Omit<Match, "id" | "createdAt"> {
  const skills = scoreSkills(v, c);
  const exp = scoreExperience(v, c);
  const loc = scoreLocation(v, c);
  const salary = scoreSalary(v, c);
  const edu = scoreEducation(v, c);
  const availability = scoreAvailability(c);
  const score = clamp(
    skills * WEIGHTS.habilidades +
      exp * WEIGHTS.experiencia +
      loc * WEIGHTS.ubicacion +
      salary * WEIGHTS.salario +
      edu * WEIGHTS.formacion +
      availability * WEIGHTS.disponibilidad
  );
  const hits = v.habilidades.filter(h =>
    candidateSkills(c).some(s => clean(s).includes(clean(h)) || clean(h).includes(clean(s)))
  );

  return {
    vacanteId: v.id,
    vacanteTitulo: v.titulo,
    empresaId: v.empresaId,
    candidatoId: c.uid,
    candidatoNombre: c.nombre,
    candidatoTitulo: c.titulo,
    candidatoAvatar: c.avatar,
    candidatoCiudad: c.ciudad,
    score,
    breakdown: [
      explain("Habilidades", skills, `${hits.length} habilidades coinciden con la vacante.`),
      explain("Experiencia", exp, `${yearsFromCandidate(c)} años estimados frente a ${yearsFromText(v.experiencia) || 1} requeridos.`),
      explain("Ubicación y modalidad", loc, `Ciudad ${c.ciudad}; preferencia ${c.modalidadPreferida}.`),
      explain("Salario", salary, c.salarioEsperado ? `Aspiración salarial: $${c.salarioEsperado.toLocaleString("es-CO")} COP.` : "Sin aspiración salarial registrada."),
      explain("Formación", edu, `${c.educacion?.length ?? 0} estudios y ${c.certificaciones?.length ?? 0} certificaciones registradas.`),
      explain("Disponibilidad", availability, `Disponibilidad: ${c.disponibilidad.replaceAll("_", " ")}.`),
    ],
    razones: [
      hits.length ? `Coincide en ${hits.slice(0, 4).join(", ")}.` : "Tiene habilidades transferibles para la vacante.",
      loc >= 75 ? "La ubicación o modalidad encaja con la necesidad de la empresa." : "La ubicación requiere validación durante entrevista.",
      exp >= 80 ? "La experiencia estimada cubre el nivel requerido." : "Puede requerir acompañamiento inicial en experiencia específica.",
    ],
    riesgos: [
      skills < 60 ? "Brecha en habilidades técnicas clave." : "",
      salary < 65 ? "Expectativa salarial por encima del rango publicado." : "",
      availability < 70 ? "Disponibilidad no inmediata." : "",
    ].filter(Boolean),
    habilidadesCoincidentes: hits,
    tipo: "pasivo",
    estado: "pendiente",
  };
}

export function buildMatches(vacantes: Vacante[], candidatos: Candidato[], minScore = 60) {
  return vacantes
    .flatMap(v => candidatos.map(c => calculateMatch(v, c)))
    .filter(m => m.score >= minScore)
    .sort((a, b) => b.score - a.score);
}
