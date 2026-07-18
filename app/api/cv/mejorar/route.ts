// Patrón Drafter → Reviewer para mejorar CVs con Haiku.
// Crédito del patrón: MadsLorentzen/ai-job-search (MIT).
import { z } from "zod";
import { callHaiku, parseJsonFromLLM } from "@/app/lib/ai/anthropic";
import {
  CV_DRAFTER_SYSTEM,   buildCvDrafterPrompt,
  CV_REVIEWER_SYSTEM,  buildCvReviewerPrompt,
} from "@/app/lib/ai/prompts/cv-mejorar";

export const runtime = "nodejs";

const BodySchema = z.object({
  cv:                  z.record(z.string(), z.unknown()),
  vacanteDescripcion:  z.string().max(800).optional(),
  seccion:             z.string().max(50).optional(),
});

const DraftSchema = z.object({
  about:             z.string(),
  experience:        z.array(z.object({
    role:        z.string(),
    company:     z.string(),
    period:      z.string(),
    description: z.string(),
  })),
  skills:            z.array(z.string()),
  education:         z.array(z.object({
    title:       z.string(),
    institution: z.string(),
    period:      z.string(),
  })),
  cambiosRealizados: z.array(z.string()).optional(),
});

const ReviewSchema = z.object({
  aptoParaEnviar:        z.boolean(),
  claimsSinEvidencia:    z.array(z.string()),
  correccionesSugeridas: z.array(z.string()),
  mejorasAdicionales:    z.array(z.string()),
  comentarioGeneral:     z.string(),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "JSON inválido" }, { status: 400 }); }

  let cv: Record<string, unknown>;
  let vacanteDescripcion: string | undefined;
  let seccion: string | undefined;
  try {
    const parsed = BodySchema.parse(body);
    cv                  = parsed.cv;
    vacanteDescripcion  = parsed.vacanteDescripcion;
    seccion             = parsed.seccion;
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Servicio IA no disponible", fallback: true }, { status: 503 });
  }

  // Paso 1 — Drafter: redacta la mejora
  let borrador: z.infer<typeof DraftSchema>;
  try {
    const raw = await callHaiku({
      system:    CV_DRAFTER_SYSTEM,
      user:      buildCvDrafterPrompt({ cv, vacanteDescripcion, seccion }),
      maxTokens: 1500,
    });
    borrador = DraftSchema.parse(parseJsonFromLLM(raw));
  } catch {
    return Response.json({ error: "Error en la generación del borrador" }, { status: 500 });
  }

  // Paso 2 — Reviewer: valida el borrador contra el CV original
  let revision: z.infer<typeof ReviewSchema>;
  try {
    const raw = await callHaiku({
      system:    CV_REVIEWER_SYSTEM,
      user:      buildCvReviewerPrompt({ cvOriginal: cv, borrador: borrador as unknown as Record<string, unknown> }),
      maxTokens: 1024,
    });
    revision = ReviewSchema.parse(parseJsonFromLLM(raw));
  } catch {
    // Si falla el reviewer, devolvemos el borrador con una advertencia
    return Response.json({
      cvMejorado:  borrador,
      revision:    null,
      advertencia: "La revisión automática no pudo completarse. Revisa el contenido antes de usar.",
    });
  }

  return Response.json({ cvMejorado: borrador, revision });
}
