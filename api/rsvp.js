// Серверная функция Vercel: принимает анкету и отправляет её в Telegram-бот.
// Токен бота хранится только на сервере (переменные окружения), в сайт он не попадает.
//
// Нужны переменные окружения:
//   TG_BOT_TOKEN — токен от @BotFather
//   TG_CHAT_ID   — ваш chat id (или id группы), куда присылать ответы

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method" });
  }

  const token = "9087977083:AAHi9Stv8YUK7IlBPrW4cA7yo4NkJ4Weoxk";
  const chatId = "6759677828";
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // скрытое поле-ловушка: люди его не заполняют, боты — да
  if (body.trap) return res.status(200).json({ ok: true });

  const name = String(body.name || "")
    .trim()
    .slice(0, 100);
  const attending =
    body.attending === "yes" ? "yes" : body.attending === "no" ? "no" : "";
  if (name.length < 2 || !attending) {
    return res.status(400).json({ ok: false, error: "invalid" });
  }

  const text = [
    `👤 Гость: ${esc(name)}`,
    `💬 Ответ: ${attending === "yes" ? "Да, приду" : "Не приду"}`,
  ].join("\n");

  try {
    const api =
      "https://api.telegram.org/bot9087977083:AAHi9Stv8YUK7IlBPrW4cA7yo4NkJ4Weoxk/sendMessage";
    const r = await fetch(`${api}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: "telegram" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: "network" });
  }
}