export default async function handler(req, res) {
  // CORS allow
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ error: "Bot Token or Chat ID missing" });
    }

    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message || "নতুন পোস্ট তৈরি হয়েছে",
        parse_mode: "HTML",
        disable_web_page_preview: false
      })
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: data.description || "Telegram error" });
    }

    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
