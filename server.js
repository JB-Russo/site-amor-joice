const express = require('express');
const cron = require('node-cron');
const twilio = require('twilio');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const SITE_URL = 'https://SEU-SITE.onrender.com';
let numeroJoice = '';

app.post('/set-number', (req, res) => {
  numeroJoice = req.body.numero;
  res.json({ ok: true });
});

function enviarMensagem(texto, gif) {
  if (!numeroJoice) return;

  client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${numeroJoice}`,
    body: `${texto}\n💖 ${SITE_URL}`,
    mediaUrl: [gif]
  });
}

cron.schedule('0 9 24 * *', () => {
  enviarMensagem(
    '💖 Mais um mês juntinhos, meu amor! Você é tudo pra mim.',
    'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
  );
});

cron.schedule('0 */6 * * *', () => {
  if (Math.random() > 0.7) {
    enviarMensagem(
      '💌 Só passei pra lembrar o quanto você é especial pra mim.',
      'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
    );
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log('Servidor rodando 💖');
});
