const CONFIRM_KEYWORDS = new Set([
  'SI', 'YES', 'S', 'NO', 'N', 'BANDO',
  'FIESTAS', 'FIESTA', 'CULTURA', 'CULTURAL',
  'NATURALEZA', 'GASTRONOMIA', 'GASTRO',
  'FORMACION', 'SERVICIOS', 'SERVICIO',
]);

function normalize(text) {
  return text.trim().toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default {
  async fetch(request, env) {
    // 1. Validar secreto del webhook (header que Telegram envía)
    const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (secret !== env.TELEGRAM_SECRET_TOKEN) {
      return new Response('', { status: 403 });
    }

    // 2. Parsear el cuerpo del webhook
    const body = await request.json().catch(() => null);
    if (!body) return new Response('ok');

    const msg = body.message;
    if (!msg) return new Response('ok');

    // 3. Validar propietario (doble validación; el script Python también lo hace)
    const senderId = String(msg?.from?.id ?? '');
    if (senderId !== env.TELEGRAM_OWNER_ID) return new Response('ok');

    // 4. Determinar modo: foto/doc/texto libre → scan; keywords → confirm
    const hasMedia = !!(msg.photo || msg.document);
    const text = normalize(msg.text || msg.caption || '');
    const mode = (!hasMedia && CONFIRM_KEYWORDS.has(text)) ? 'confirm' : 'scan';
    const workflow = mode === 'confirm' ? 'agenda-confirm.yml' : 'agenda-scan.yml';

    // 5. Disparar el workflow de GitHub con el update completo como input
    try {
      const resp = await fetch(
        `https://api.github.com/repos/${env.GH_REPO}/actions/workflows/${workflow}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.GH_PAT}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
            'User-Agent': 'enguidanos-telegram-bot/1.0',
          },
          body: JSON.stringify({
            ref: 'main',
            inputs: { update_json: JSON.stringify(body) },
          }),
        }
      );
      if (!resp.ok) {
        const err = await resp.text();
        console.error(`GitHub dispatch failed [${resp.status}]: ${err}`);
      }
    } catch (e) {
      console.error('GitHub dispatch error:', e.message);
    }

    // Siempre 200 a Telegram — evita reintentos automáticos
    return new Response('ok');
  },
};
