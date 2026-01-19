const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');
const path = require('path');

const app = express();
app.use(express.json());

// 📁 SERVIR O SITE CORRETAMENTE
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📲 TWILIO (nomes certos)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const SITE_URL = 'https://site-amor-joice.onrender.com';
let numeroJoice = '';

// 📞 DEFINIR NÚMERO
app.post('/set-number', (req, res) => {
  numeroJoice = req.body.numero;
  res.json({ ok: true });
});

// 💌 FUNÇÃO DE ENVIO
function enviarMensagem(texto, gif) {
  if (!numeroJoice) return;

  client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${numeroJoice}`,
    body: `${texto}\n💖 ${SITE_URL}`,
    mediaUrl: [gif]
  });
}

// 📅 TODO DIA 24 (9h)
cron.schedule('0 9 24 * *', () => {
  enviarMensagem(
    '💖 Mais um mês juntinhos, meu amor! Você é tudo pra mim.',
    'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
  );
});

// 🎀 MENSAGENS ALEATÓRIAS
cron.schedule('0 */6 * * *', () => {
  if (Math.random() > 0.7) {
    enviarMensagem(
      '💌 Só passei pra lembrar o quanto você é especial pra mim.',
      'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
    );
  }
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Servidor rodando 💖');
});
