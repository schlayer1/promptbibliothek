/**
 * Vercel Serverless Function: /api/gemini
 * Schützt den Schul-GEMINI_API_KEY serverseitig als Vercel Secret.
 * Eigenständig (ohne relative Imports) für maximale Vercel-ESM-Kompatibilität.
 */

const CANDIDATE_FLASH_MODELS = [
  'gemini-4-hydrogen',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
];

const REQUEST_TIMEOUT_MS = 55000;
const DEFAULT_MAX_OUTPUT_TOKENS = 32768;
const MAX_ALLOWED_OUTPUT_TOKENS = 65536;

function extractCandidateText(candidate: any): string {
  const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
  return parts
    .filter((p: any) => !p?.thought && typeof p?.text === 'string')
    .map((p: any) => p.text)
    .join('');
}

function isOriginAllowed(urlStr: string, requestHost: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    const host = parsed.host.toLowerCase();
    if (requestHost && host === requestHost.toLowerCase()) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return extraOrigins.includes(parsed.origin.toLowerCase());
  } catch {
    return false;
  }
}

function applyOriginProtection(req: any, res: any): boolean {
  const rawHost = req.headers?.['x-forwarded-host'] || req.headers?.host || '';
  const requestHost = (Array.isArray(rawHost) ? rawHost[0] : String(rawHost)).split(',')[0].trim();
  const rawOrigin = req.headers?.origin;
  const origin = Array.isArray(rawOrigin) ? rawOrigin[0] : (rawOrigin || '');
  const rawReferer = req.headers?.referer;
  const referer = Array.isArray(rawReferer) ? rawReferer[0] : (rawReferer || '');

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Vary', 'Origin');

  if (origin && isOriginAllowed(origin, requestHost)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    if (origin && !isOriginAllowed(origin, requestHost)) {
      res.status(403).json({ error: 'CORS: Herkunft nicht erlaubt.' });
      return false;
    }
    res.status(200).end();
    return false;
  }

  if (origin) {
    if (!isOriginAllowed(origin, requestHost)) {
      res.status(403).json({ error: 'Zugriff verweigert: Unzulässige Herkunft (Origin).' });
      return false;
    }
    return true;
  }

  if (referer && isOriginAllowed(referer, requestHost)) {
    return true;
  }

  res.status(403).json({ error: 'Zugriff verweigert: Fehlender Origin-Header.' });
  return false;
}

export default async function handler(req: any, res: any) {
  if (!applyOriginProtection(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST-Anfragen sind für /api/gemini zulässig.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Ungültiges JSON im Request-Body.' });
      }
    }
    body = body || {};

    const {
      systemPrompt,
      userPrompt,
      model,
      temperature = 0.4,
      responseMimeType,
      maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS,
    } = body;

    const clientKey =
      typeof body.apiKey === 'string' && body.apiKey.trim() && body.apiKey.trim() !== 'serverless-proxy'
        ? body.apiKey.trim()
        : '';
    const serverKey = (process.env.GEMINI_API_KEY || '').trim();
    const activeKey = clientKey || serverKey;

    if (!activeKey) {
      return res.status(401).json({
        error:
          'Kein Gemini API-Schlüssel konfiguriert. Bitte hinterlege GEMINI_API_KEY in Vercel als Secret oder trage einen persönlichen Schlüssel ein.',
      });
    }

    if (!userPrompt && !systemPrompt) {
      return res.status(400).json({ error: 'userPrompt oder systemPrompt erforderlich.' });
    }

    const candidateModels: string[] = [];
    if (typeof model === 'string' && model.trim() && model !== 'auto') {
      candidateModels.push(model.trim());
    }
    for (const m of CANDIDATE_FLASH_MODELS) {
      if (!candidateModels.includes(m)) {
        candidateModels.push(m);
      }
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${userPrompt || ''}`.trim() : String(userPrompt);
    let lastErrorMessage = '';

    const requestedMaxTokens =
      typeof maxOutputTokens === 'number' && maxOutputTokens > 0
        ? Math.min(Math.round(maxOutputTokens), MAX_ALLOWED_OUTPUT_TOKENS)
        : DEFAULT_MAX_OUTPUT_TOKENS;

    for (const currentModel of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(currentModel)}:generateContent?key=${encodeURIComponent(activeKey)}`;
      const tokenBudgetsToTry = requestedMaxTokens > 8192 ? [requestedMaxTokens, 8192] : [requestedMaxTokens];

      for (const tokenBudget of tokenBudgetsToTry) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
          const generationConfig: Record<string, any> = {
            temperature: typeof temperature === 'number' ? temperature : 0.4,
            maxOutputTokens: tokenBudget,
          };
          if (responseMimeType === 'application/json') {
            generationConfig.responseMimeType = 'application/json';
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
              generationConfig,
            }),
          });

          clearTimeout(timeoutId);
          const data: any = await response.json().catch(() => null);

          if (response.ok && data) {
            const firstCandidate = data.candidates?.[0];
            const text = extractCandidateText(firstCandidate);
            const finishReason = firstCandidate?.finishReason || 'STOP';

            if (text.trim().length > 0) {
              return res.status(200).json({
                text,
                model: currentModel,
                finishReason,
                truncated: finishReason === 'MAX_TOKENS',
              });
            }

            const blockReason = data.promptFeedback?.blockReason;
            if (finishReason && finishReason !== 'STOP') {
              lastErrorMessage = `Modell ${currentModel} beendet mit Status "${finishReason}".`;
            } else if (blockReason) {
              lastErrorMessage = `Prompt wurde durch Sicherheitsfilter geblockt (${blockReason}).`;
            } else {
              lastErrorMessage = `Modell ${currentModel} lieferte eine leere Antwort.`;
            }
            break;
          }

          const errMsg = data?.error?.message || `HTTP ${response.status}`;
          lastErrorMessage = errMsg;

          if (
            response.status === 400 &&
            (errMsg.includes('API_KEY_INVALID') || errMsg.includes('key not valid'))
          ) {
            return res.status(400).json({ error: 'Der Gemini API-Schlüssel ist ungültig. Bitte prüfe den Schlüssel.' });
          }

          const isMaxTokensError =
            response.status === 400 &&
            /max_output_tokens|maxOutputTokens|output token/i.test(errMsg);
          if (isMaxTokensError && tokenBudget > 8192) {
            continue;
          }
          break;
        } catch (err: any) {
          clearTimeout(timeoutId);
          lastErrorMessage =
            err?.name === 'AbortError'
              ? `Zeitüberschreitung nach ${REQUEST_TIMEOUT_MS / 1000}s bei Modell ${currentModel}`
              : err?.message || String(err);
          break;
        }
      }
    }

    return res.status(502).json({
      error: `Kein Gemini-Modell erreichbar. Letzter Fehler: ${lastErrorMessage}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Interner Serverfehler im Gemini-Proxy.' });
  }
}
