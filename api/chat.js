export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, password } = req.body;

  const chatPassword = process.env.CHAT_PASSWORD;
  if (chatPassword && password !== chatPassword) {
    return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
  }

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 받지 못했습니다.';
  res.status(200).json({ reply: text });
}
