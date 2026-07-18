// Módulo servidor — NUNCA importar desde componentes client.
// Requiere GEMINI_API_KEY como variable de entorno del servidor.
import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no configurada en el servidor");
  }
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _client;
}

export const GEMINI_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_MAX_TOKENS = 1024;
export const AI_TIMEOUT_MS = 12_000;

/**
 * Wrapper conveniente para llamar a Gemini con timeout automático.
 * Mantiene la misma firma que callHaiku para no cambiar los route handlers.
 */
export async function callHaiku(opts: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const ai = getGeminiClient();

  const generate = ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: opts.user,
    config: {
      systemInstruction: opts.system,
      responseMimeType: "application/json",
      maxOutputTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Timeout IA después de ${AI_TIMEOUT_MS}ms`)),
      AI_TIMEOUT_MS
    )
  );

  const result = await Promise.race([generate, timeoutPromise]);
  return result.text ?? "";
}

/** Extrae un bloque JSON de la respuesta del modelo (tolerante a markdown fences). */
export function parseJsonFromLLM(raw: string): unknown {
  const trimmed = raw.trim();
  const cleaned = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}
