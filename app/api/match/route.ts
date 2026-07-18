import { z } from "zod";
import { calculateMatch } from "@/app/lib/matching-engine";
import { callHaiku, parseJsonFromLLM } from "@/app/lib/ai/anthropic";
import { MATCH_SYSTEM_PROMPT, buildMatchUserPrompt } from "@/app/lib/ai/prompts/match";
import type { Candidato, Vacante } from "@/app/lib/types";

export const runtime = "nodejs";

const BodySchema = z.object({
  vacante:   z.record(z.string(), z.unknown()),
  candidato: z.record(z.string(), z.unknown()),
});

const AnalisisIASchema = z.object({
  veredicto:                z.string(),
  explicacion:              z.string(),
  fortalezas:               z.array(z.string()),
  riesgos:                  z.array(z.string()),
  habilidadesTransferibles: z.array(z.string()),
  scoreAjustado:            z.number().nullable().optional(),
  justificacionScore:       z.string().nullable().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }

  let vacante: Record<string, unknown>;
  let candidato: Record<string, unknown>;
  try {
    const parsed = BodySchema.parse(body);
    vacante   = parsed.vacante;
    candidato = parsed.candidato;
  } catch {
    return Response.json({ error: "Cuerpo de la solicitud inválido" }, { status: 400 });
  }

  // 1. Match heurístico (siempre corre, es el fallback)
  let match: ReturnType<typeof calculateMatch>;
  try {
    match = calculateMatch(
      vacante   as unknown as Vacante,
      candidato as unknown as Candidato,
    );
  } catch {
    return Response.json({ error: "Error calculando match" }, { status: 500 });
  }

  // 2. Enriquecimiento con Haiku (opcional — degrada con gracia si falla)
  let analisisIA = null;
  try {
    const raw = await callHaiku({
      system:    MATCH_SYSTEM_PROMPT,
      user:      buildMatchUserPrompt(vacante, candidato, match as unknown as Record<string, unknown>),
      maxTokens: 1024,
    });
    analisisIA = AnalisisIASchema.parse(parseJsonFromLLM(raw));
  } catch {
    // Silencioso — el cliente recibe el resultado heurístico con analisisIA: null
  }

  return Response.json({ ...match, analisisIA });
}
