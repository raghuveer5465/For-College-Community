require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.NVIDIA_API_KEY) {
  console.error("⚠️ WARNING: NVIDIA_API_KEY is missing in .env!");
} else {
  console.log("✅ NVIDIA API Key loaded successfully.");
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bindex.html'));
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NVIDIA Response Error Data:', data);
      return res.status(response.status).json({ error: data.detail || data.message || 'API Error' });
    }

    const aiAnswer = data.choices[0].message.content;
    res.json({ result: aiAnswer });

  } catch (error) {
    console.error('AI Processing Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
// Explicitly serve bindex.html as the main page
app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'bindex.html'));
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});