// =====================================================
// BACK-END (Node.js + Express)
// SITE ROMÂNTICO DEFINITIVO 💖🎀 (RESPONSIVO)
// =====================================================

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const { Twilio } = require('twilio');
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// =====================
// CONFIG
// =====================
const PORT = 3000;
const START_DATE = new Date('2025-10-24');
const SITE_URL = 'https://SEU-SITE.onrender.com';

// =====================
// BANCO
// =====================
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS couple (id INTEGER PRIMARY KEY, phone TEXT)`);
});

// =====================
// TWILIO
// =====================
const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const FROM = 'whatsapp:+14155238886';

// =====================
// GERADOR DE MENSAGENS INFINITAS
// =====================
const openings = ['Meu amor', 'Minha Joice linda', 'Amor da minha vida', 'Meu coração'];
const middles = ['pensar em você ilumina meu dia', 'amar você é minha parte favorita da vida', 'cada momento contigo é um presente', 'meu mundo é melhor com você'];
const endings = ['te amo infinitamente 💖', 'sou muito seu 🥰', 'você é tudo pra mim 💕', 'meu coração é seu 🎀'];

function randomMessage() {
  return `${openings[Math.floor(Math.random()*openings.length)]}, ${middles[Math.floor(Math.random()*middles.length)]}. ${endings[Math.floor(Math.random()*endings.length)]}`;
}

const gifs = [
  'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
  'https://media.giphy.com/media/13k4VSc3ngLPUY/giphy.gif'
];

// =====================
// ADMIN
// =====================
app.post('/admin/register', (req, res) => {
  db.run('INSERT OR REPLACE INTO couple (id, phone) VALUES (1, ?)', [req.body.phone]);
  res.json({ ok: true });
});

// =====================
// MESVERSÁRIO
// =====================
cron.schedule('0 9 24 * *', () => {
  db.get('SELECT phone FROM couple WHERE id=1', (_, c) => {
    if (!c) return;
    const today = new Date();
    const months = (today.getFullYear()-START_DATE.getFullYear())*12 + (today.getMonth()-START_DATE.getMonth()) + 1;

    client.messages.create({
      from: FROM,
      to: `whatsapp:${c.phone}`,
      body: `💖 Feliz mesversário, Joice! 💖\n\nHoje completamos ${months} meses juntinhos 🥹\n${randomMessage()}\n\n🌸 Abre isso aqui: ${SITE_URL}`,
      mediaUrl: [gifs[Math.floor(Math.random()*gifs.length)]]
    });
  });
});

// =====================
// SURPRESAS ALEATÓRIAS
// =====================
cron.schedule('0 */6 * * *', () => {
  if (Math.random() < 0.7) return;
  db.get('SELECT phone FROM couple WHERE id=1', (_, c) => {
    if (!c) return;
    client.messages.create({
      from: FROM,
      to: `whatsapp:${c.phone}`,
      body: `💌 Surpresa 💌\n${randomMessage()}\n\n✨ ${SITE_URL}`,
      mediaUrl: [gifs[Math.floor(Math.random()*gifs.length)]]
    });
  });
});

// =====================
// API
// =====================
app.get('/days', (_, res) => {
  const days = Math.floor((new Date()-START_DATE)/(1000*60*60*24));
  res.json({ days });
});

app.listen(PORT, () => console.log('Servidor romântico no ar 💖'));

// =====================================================
// FRONT-END (RESPONSIVO / HELLO KITTY THEME)
// =====================================================

/*
==================== public/index.html ====================
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Júlio & Joice 💖</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<div class="sidebar">
  <button onclick="show('days')">💗 Dias juntos</button>
  <button onclick="show('calendar')">📅 Calendário</button>
  <button onclick="show('photos')">📸 Álbum</button>
  <button onclick="show('game')">🎮 Mini game</button>
  <button onclick="show('movies')">🎬 Filmes</button>
</div>

<div class="content">
  <section id="days"><h1 id="daysText"></h1></section>

  <section id="calendar">
    <h2>Nosso calendário 💕</h2>
    <div class="calendar-bg">🐱🎀</div>
  </section>

  <section id="photos">
    <h2>Nosso álbum 💖</h2>
    <input type="file" accept="image/*" multiple onchange="addPhotos(this.files)" />
    <div id="gallery"></div>
  </section>

  <section id="game">
    <h2>Joguinho do Amor 💕</h2>
    <button onclick="score++ ; document.getElementById('score').innerText=score">💖 Clique no amor</button>
    <p>Pontos: <span id="score">0</span></p>
  </section>

  <section id="movies">
    <h2>Filmes românticos no cinema 🇧🇷</h2>
    <ul>
      <li>❤️ Diário de Uma Paixão (reexibição) – 14/02</li>
      <li>💘 Romance Surpresa – 28/03</li>
    </ul>
  </section>
</div>

<script src="script.js"></script>
</body>
</html>
*/

/*
==================== public/script.js ====================
let score = 0;

async function loadDays(){
 const r = await fetch('/days');
 const d = await r.json();
 document.getElementById('daysText').innerText = `Estamos juntos há ${d.days} dias 💖`;
}

function show(id){
 document.querySelectorAll('section').forEach(s=>s.style.display='none');
 document.getElementById(id).style.display='block';
}

function addPhotos(files){
 const g = document.getElementById('gallery');
 [...files].forEach(f=>{
  const img=document.createElement('img');
  img.src=URL.createObjectURL(f);
  g.appendChild(img);
 });
}

loadDays(); show('days');
*/

/*
==================== public/style.css ====================
body{margin:0;font-family:'Comic Sans MS';display:flex;min-height:100vh;background:#ffe6f2}
.sidebar{width:80px;background:pink;display:flex;flex-direction:column;align-items:center}
.sidebar button{background:none;border:none;font-size:20px;margin:10px}
.content{flex:1;padding:20px}
section{display:none}
#gallery img{width:100px;border-radius:15px;margin:5px}
.calendar-bg{font-size:80px;opacity:0.1}
@media(max-width:600px){.sidebar{width:60px}}
*/
