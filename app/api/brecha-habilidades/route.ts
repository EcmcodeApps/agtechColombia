// Tarea 5 — Análisis de brecha de habilidades (upskill).
// Endpoint listo; UI en portal candidato pendiente de implementar.
import { z } from "zod";
import { callHaiku, parseJsonFromLLM } from "@/app/lib/ai/anthropic";
import { BRECHA_SYSTEM_PROMPT, buildBrechaUserPrompt } from "@/app/lib/ai/prompts/brecha";

export const runtime = "nodejs";

const BodySchema = z.object({
  vacante:   z.record(z.string(), z.unknown()),
  candidato: z.record(z.string(), z.unknown()),
});

const ResultSchema = z.object({
  nivelCompatibilidad: z.enum(["bajo", "medio", "alto"]),
  brechasIdentificadas: z.array(z.object({
    habilidad:      z.string(),
    nivelActual:    z.string().nullable(),
    nivelRequerido: z.string(),
  })),
  planAprendizaje: z.array(z.object({
    habilidad:          z.string(),
    recurso:            z.string(),
    plataforma:         z.string(),
    duracionEstimada:   z.string(),
    costo:              z.enum(["gratuito", "bajo costo"]),
  })),
  tiempoEstimadoTotal: z.string(),
  mensaje:             z.string(),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }

  let input: z.infer<typeof BodySchema>;
  try { input = BodySchema.parse(body); }
  catch { return Response.json({ error: "Cuerpo inválido" }, { status: 400 }); }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Servicio IA no disponible", fallback: true }, { status: 503 });
  }

  try {
    const raw = await callHaiku({
      system:    BRECHA_SYSTEM_PROMPT,
      user:      buildBrechaUserPrompt(input),
      maxTokens: 1500,
    });
    return Response.json(ResultSchema.parse(parseJsonFromLLM(raw)));
  } catch {
    return Response.json({ error: "Error analizando brecha de habilidades" }, { status: 500 });
  }
}
