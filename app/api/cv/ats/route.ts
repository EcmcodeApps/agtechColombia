import { z } from "zod";
import { callHaiku, parseJsonFromLLM } from "@/app/lib/ai/anthropic";
import { ATS_SYSTEM_PROMPT, buildAtsUserPrompt } from "@/app/lib/ai/prompts/ats";

export const runtime = "nodejs";

const BodySchema = z.object({
  vacanteDescripcion: z.string().max(1000),
  vacanteHabilidades: z.array(z.string().max(100)).max(20).default([]),
  cvTexto:            z.string().max(3000),
});

const AtsResultSchema = z.object({
  scoreATS:             z.number().min(0).max(100),
  keywordsPresentes:    z.array(z.string()),
  keywordsFaltantes:    z.array(z.string()),
  sugerenciasHonestas:  z.array(z.string()),
  resumen:              z.string(),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }

  let input: z.infer<typeof BodySchema>;
  try {
    input = BodySchema.parse(body);
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Servicio IA no disponible", fallback: true }, { status: 503 });
  }

  try {
    const raw = await callHaiku({
      system:    ATS_SYSTEM_PROMPT,
      user:      buildAtsUserPrompt(input),
      maxTokens: 1024,
    });
    const result = AtsResultSchema.parse(parseJsonFromLLM(raw));
    return Response.json(result);
  } catch {
    return Response.json({ error: "Error analizando compatibilidad ATS" }, { status: 500 });
  }
}
