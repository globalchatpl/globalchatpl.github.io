const chat = document.getElementById('chat');
const nickInput = document.getElementById('nick');
const colorInput = document.getElementById('color');
const avatarInput = document.getElementById('avatar');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

const API_URL = 'https://globalchatplbackend.onrender.com'; // podmień na swój backend

function addMessageToChat({ nick, text, color, avatar }) {
  const div = document.createElement('div');
  div.classList.add('message');

  const avatarEl = document.createElement('img');
  avatarEl.classList.add('avatar');
  avatarEl.src = avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  avatarEl.alt = 'avatar';

  const nickEl = document.createElement('span');
  nickEl.classList.add('nick');
  nickEl.style.color = color || '#1e40af';
  nickEl.textContent = nick || 'Anonim';

  const textEl = document.createElement('span');
  textEl.classList.add('text');
  textEl.textContent = text;

  div.appendChild(avatarEl);
  div.appendChild(nickEl);
  div.appendChild(textEl);

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function fetchMessages() {
  try {
    const res = await fetch(`${API_URL}/messages`);
    if (!res.ok) throw new Error('Błąd pobierania wiadomości');
    const data = await res.json();
    chat.innerHTML = '';
    data.forEach(addMessageToChat);
  } catch (err) {
    console.error(err);
  }
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return alert('Wpisz wiadomość');

  const nick = nickInput.value.trim() || 'Anonim';
  const color = colorInput.value || '#1e40af';
  const avatar = avatarInput.value.trim() || null;

  try {
    const res = await fetch(`${API_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, nick, color, avatar }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Błąd wysyłania wiadomości');

    messageInput.value = '';
    fetchMessages();
  } catch (err) {
    alert(err.message);
  }
}

sendBtn.onclick = sendMessage;

messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Odświeżaj co 2 sekundy
setInterval(fetchMessages, 2000);
fetchMessages();