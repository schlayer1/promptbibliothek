// Zukunftssichere Google Gemini Anbindung nach HBS-Schulstandard (/api/gemini Proxy)

export const CANDIDATE_FLASH_MODELS = [
  'gemini-4-hydrogen',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];

let cachedWorkingModel: string | null = 'gemini-4-hydrogen';

const DEFAULT_MAX_OUTPUT_TOKENS = 32768;

function extractCandidateText(candidate: any): string {
  const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
  return parts
    .filter((p: any) => !p?.thought && typeof p?.text === 'string')
    .map((p: any) => p.text)
    .join('');
}

/**
 * Liefert die verifizierte Modellliste ohne zusätzlichen Vorab-API-Roundtrip.
 */
export async function discoverAvailableGeminiModels(): Promise<string[]> {
  return CANDIDATE_FLASH_MODELS;
}

export interface GeminiCallResult {
  text: string;
  modelUsed: string;
  finishReason?: string;
  truncated?: boolean;
}

/**
 * Ruft Gemini primär über den sicheren Serverless-Proxy (/api/gemini) auf.
 * Direktaufruf erfolgt nur als Fallback bei 404 (statisches Hosting) und vorhandenem BYOK-Key.
 */
export async function callGeminiApi({
  apiKey,
  systemPrompt,
  userPrompt,
  model,
  temperature = 0.4,
  maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS,
  responseMimeType,
}: {
  apiKey?: string;
  systemPrompt?: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}): Promise<GeminiCallResult> {
  const customKey = apiKey?.trim() && apiKey.trim() !== 'serverless-proxy' ? apiKey.trim() : '';
  const requestedModel =
    model && model !== 'auto' ? model : cachedWorkingModel || 'auto';

  // 1. Primärer Pfad: Sicherer Serverless Proxy (/api/gemini)
  try {
    const proxyResponse = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: customKey || 'serverless-proxy',
        systemPrompt,
        userPrompt,
        model: requestedModel,
        temperature,
        maxOutputTokens,
        responseMimeType,
      }),
    });

    if (proxyResponse.ok) {
      const data = await proxyResponse.json();
      if (data?.text) {
        const usedModel = data.model || CANDIDATE_FLASH_MODELS[0];
        cachedWorkingModel = usedModel;
        return {
          text: data.text,
          modelUsed: usedModel,
          finishReason: data.finishReason || 'STOP',
          truncated: Boolean(data.truncated || data.finishReason === 'MAX_TOKENS'),
        };
      }
    }

    if (proxyResponse.status !== 404) {
      const errJson = await proxyResponse.json().catch(() => ({}));
      throw new Error(errJson?.error || `HTTP ${proxyResponse.status} von /api/gemini`);
    }
  } catch (proxyErr: any) {
    if (proxyErr?.message && !proxyErr.message.includes('404')) {
      throw proxyErr;
    }
  }

  // 2. Fallback bei 404 nur mit persönlichem BYOK-Schlüssel
  if (!customKey) {
    throw new Error(
      'Der Gemini-Server-Proxy (/api/gemini) ist nicht erreichbar und es ist kein persönlicher API-Schlüssel hinterlegt.'
    );
  }

  const candidateModels: string[] = [];
  if (model && model !== 'auto' && !candidateModels.includes(model)) {
    candidateModels.push(model);
  }
  if (cachedWorkingModel && !candidateModels.includes(cachedWorkingModel)) {
    candidateModels.push(cachedWorkingModel);
  }
  for (const m of CANDIDATE_FLASH_MODELS) {
    if (!candidateModels.includes(m)) {
      candidateModels.push(m);
    }
  }

  let lastError: any = null;
  const budgetsToTry = maxOutputTokens > 8192 ? [maxOutputTokens, 8192] : [maxOutputTokens];

  for (const currentModel of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(currentModel)}:generateContent?key=${encodeURIComponent(customKey)}`;

    for (const tokenBudget of budgetsToTry) {
      try {
        const generationConfig: Record<string, any> = {
          temperature,
          maxOutputTokens: tokenBudget,
        };
        if (responseMimeType === 'application/json') {
          generationConfig.responseMimeType = 'application/json';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt,
                  },
                ],
              },
            ],
            generationConfig,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const firstCandidate = data.candidates?.[0];
          const text = extractCandidateText(firstCandidate);
          const finishReason = firstCandidate?.finishReason || 'STOP';
          if (text.trim().length > 0) {
            cachedWorkingModel = currentModel;
            return {
              text,
              modelUsed: currentModel,
              finishReason,
              truncated: finishReason === 'MAX_TOKENS',
            };
          }
          break;
        }

        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `HTTP ${response.status}`;
        lastError = new Error(errMsg);

        if (
          response.status === 400 &&
          (errMsg.includes('API_KEY_INVALID') || errMsg.includes('key not valid'))
        ) {
          throw new Error('Der Gemini API-Schlüssel ist ungültig. Bitte prüfe den Schlüssel.');
        }

        if (
          response.status === 400 &&
          /max_output_tokens|maxOutputTokens|output token/i.test(errMsg) &&
          tokenBudget > 8192
        ) {
          continue;
        }
        break;
      } catch (err: any) {
        lastError = err;
        if (err?.message && err.message.includes('ungültig')) {
          throw err;
        }
        break;
      }
    }
  }

  throw lastError || new Error('Kein funktionierendes Gemini-Modell erreichbar.');
}

/**
 * Optimiert einen Prompt didaktisch mit Gemini
 */
export async function optimizePromptWithAI(
  rawText: string,
  apiKey?: string
): Promise<{
  optimizedTitle: string;
  optimizedPrompt: string;
  detectedVariables: string[];
  tips: string;
}> {
  const systemPrompt = `Du bist ein didaktischer KI-Prompt-Engineer für Lehrer an einer Regelschule.
Deine Aufgabe ist es, einen groben, unausgereiften Prompt einer Lehrkraft in einen hochprofessionellen, erprobten Schul-Prompt zu verwandeln.
Befolge folgende Prinzipien:
1. Klare Rollenzuweisung (z.B. "Du bist eine erfahrene Lehrkraft für...")
2. Klare didaktische Zielsetzung und Zielgruppe (z.B. "Klasse 8, Regelschule")
3. Anforderungsbereiche (AFB I-III) und KMK-Operatoren berücksichtigen
4. Platzhalter in eckigen Klammern definieren (z.B. [Fach], [Thema], [Klassenstufe], [Differenzierung])
5. Konkrete Ausgabeformatierung verlangen (z.B. Tabelle, Arbeitsblatt, Kriterienraster)

Antworte STRIKT im folgenden JSON-Format ohne Markdown-Backticks:
{
  "optimizedTitle": "Prägnanter Titel",
  "optimizedPrompt": "Der vollständige, strukturierte Prompt mit [Platzhaltern]",
  "detectedVariables": ["Fach", "Thema", "Klassenstufe"],
  "tips": "1-2 didaktische Tipps zur Durchführung im Unterricht"
}`;

  const userPrompt = `Verfeinere folgenden Entwurf zu einem didaktisch hochwertigen Schul-Prompt:\n\n"${rawText}"`;

  const { text } = await callGeminiApi({
    apiKey,
    systemPrompt,
    userPrompt,
    temperature: 0.2,
    responseMimeType: 'application/json',
  });

  try {
    const cleaned = text.replace(/^```json\s*/im, '').replace(/^```\s*/im, '').replace(/```\s*$/m, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      optimizedTitle: 'Optimierter Schul-Prompt',
      optimizedPrompt: text,
      detectedVariables: ['Thema', 'Klassenstufe'],
      tips: 'Aufbau und Kriterien können vor dem Absenden noch individuell angepasst werden.',
    };
  }
}
