// Tarea 5 — Preparación de entrevista con método STAR.
// Endpoint listo; UI en portal candidato pendiente de implementar.
import { z } from "zod";
import { callHaiku, parseJsonFromLLM } from "@/app/lib/ai/anthropic";
import { ENTREVISTA_SYSTEM_PROMPT, buildEntrevistaUserPrompt } from "@/app/lib/ai/prompts/entrevista";

export const runtime = "nodejs";

const BodySchema = z.object({
  vacante:   z.record(z.string(), z.unknown()),
  candidato: z.record(z.string(), z.unknown()),
});

const ResultSchema = z.object({
  preguntas: z.array(z.object({
    pregunta: z.string(),
    tipo:     z.enum(["comportamental", "técnica", "situacional"]),
    guiaStar: z.object({
      situacion: z.string(),
      tarea:     z.string(),
      accion:    z.string(),
      resultado: z.string(),
    }),
  })),
  consejosGenerales: z.array(z.string()),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }

  let input: z.infer<typeof BodySchema>;
  try { input = BodySchema.parse(body); }
  catch { return Response.json({ error: "Cuerpo inválido" }, { status: 400 }); }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Servicio IA no disponible", fallback: true }, { status: 503 });
  }

  try {
    const raw = await callHaiku({
      system:    ENTREVISTA_SYSTEM_PROMPT,
      user:      buildEntrevistaUserPrompt(input),
      maxTokens: 1500,
    });
    return Response.json(ResultSchema.parse(parseJsonFromLLM(raw)));
  } catch {
    return Response.json({ error: "Error generando preguntas de entrevista" }, { status: 500 });
  }
}
