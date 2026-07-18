// Módulo servidor — NUNCA importar desde componentes client.
// Requiere ANTHROPIC_API_KEY como variable de entorno del servidor.
import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY no configurada en el servidor");
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const HAIKU_MODEL = "claude-haiku-4-5-20251001";
export const DEFAULT_MAX_TOKENS = 1024;
// Tiempo máximo de espera a la API (ms); si se supera, se usa el fallback heurístico.
export const AI_TIMEOUT_MS = 12_000;

export function extractText(msg: Anthropic.Message): string {
  const block = msg.content[0];
  return block?.type === "text" ? block.text : "";
}

/**
 * Wrapper conveniente para llamar a Haiku con timeout automático.
 * Lanza error si ANTHROPIC_API_KEY no está configurada o si la llamada supera AI_TIMEOUT_MS.
 */
export async function callHaiku(opts: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<string> {
  const client = getAnthropicClient();
  const msg = await client.messages.create(
    {
      model: HAIKU_MODEL,
      max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
    },
    { signal: AbortSignal.timeout(AI_TIMEOUT_MS) }
  );
  return extractText(msg);
}

/** Extrae un bloque JSON de la respuesta del modelo (tolerante a markdown fences). */
export function parseJsonFromLLM(raw: string): unknown {
  const trimmed = raw.trim();
  // Quitar ```json ... ``` si el modelo los incluyó a pesar de las instrucciones
  const cleaned = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}
