const API = 'https://globalchatplbackend.onrender.com';

let nick = '';
let color = '#1e40af';
let lastSent = 0;

const loginNick = document.getElementById('login-nick');
const loginPass = document.getElementById('login-password');
const loginBtn = document.getElementById('loginBtn');
const messageInput = document.getElementById('message');
const colorInput = document.getElementById('color');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const loginArea = document.querySelector('.login-area');
const chatArea = document.getElementById('chat');

loginBtn.onclick = async () => {
  const n = loginNick.value.trim();
  const p = loginPass.value.trim();

  if (!n || !p) return alert('Podaj nick i hasło');

  try {
    const res = await fetch(`${API}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick: n, password: p })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Błąd logowania');

    nick = n;
    color = colorInput.value;
    loginArea.style.display = 'none';
    chatArea.style.display = 'flex';
    loadMessages();
  } catch (err) {
    alert('Błąd połączenia z serwerem');
  }
};

sendBtn.onclick = async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const now = Date.now();
  if (now - lastSent < 3000) return alert('Poczekaj 3 sekundy');

  try {
    const res = await fetch(`${API}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick, text, color })
    });

    if (!res.ok) {
      const data = await res.json();
      return alert(data.error || 'Błąd');
    }

    messageInput.value = '';
    lastSent = now;
    loadMessages();
  } catch (err) {
    console.error(err);
  }
};

async function loadMessages() {
  try {
    const res = await fetch(`${API}/messages`);
    const data = await res.json();
    messagesDiv.innerHTML = data.map(msg =>
      `<p><strong style="color: ${escapeHtml(msg.color || '#000')}">${escapeHtml(msg.nick)}:</strong> ${escapeHtml(msg.text)}</p>`
    ).join('');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error('Błąd pobierania wiadomości');
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

setInterval(loadMessages, 3000);