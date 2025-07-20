const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const nickInput = document.getElementById('nick');
const colorInput = document.getElementById('color');
const avatarInput = document.getElementById('avatar');

let avatarDataUrl = null;

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  if (!file) {
    avatarDataUrl = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    avatarDataUrl = reader.result;
  };
  reader.readAsDataURL(file);
});

function createMessageElement(msg) {
  const div = document.createElement('div');
  div.classList.add('msg');

  if (msg.isOwner) {
    div.classList.add('owner');
  }

  if (msg.nick === 'GLOBALCHATPL ✓') {
    div.classList.add('globalchat');
  }

  // Avatar
  if (msg.avatar) {
    const img = document.createElement('img');
    img.src = msg.avatar;
    img.alt = "Avatar";
    div.appendChild(img);
  }

  // Nick
  const nickSpan = document.createElement('span');
  nickSpan.classList.add('nick');
  nickSpan.textContent = msg.nick + ": ";
  nickSpan.style.color = msg.color || '#1e40af';

  // If color is a gradient class name (like gradient-green), override color style:
  if (msg.color === 'gradient-green') {
    nickSpan.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
    nickSpan.style.webkitBackgroundClip = 'text';
    nickSpan.style.webkitTextFillColor = 'transparent';
    nickSpan.style.color = 'initial';
  }
  else if (msg.color === 'gradient-yellow-red') {
    nickSpan.style.background = 'linear-gradient(90deg, #dc2626, #facc15)';
    nickSpan.style.webkitBackgroundClip = 'text';
    nickSpan.style.webkitTextFillColor = 'transparent';
    nickSpan.style.color = 'initial';
  }

  div.appendChild(nickSpan);

  // Text
  const textSpan = document.createElement('span');
  textSpan.classList.add('text');
  textSpan.textContent = msg.text;
  div.appendChild(textSpan);

  return div;
}

async function fetchMessages() {
  try {
    const res = await fetch('/messages');
    const data = await res.json();

    messagesDiv.innerHTML = '';
    data.forEach(msg => {
      const el = createMessageElement(msg);
      messagesDiv.appendChild(el);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error('Błąd podczas pobierania wiadomości:', err);
  }
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const nick = nickInput.value.trim() || 'Anonim';
  const color = colorInput.value;
  const avatar = avatarDataUrl;

  try {
    const res = await fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, nick, color, avatar }),
    });

    const data = await res.json();
    if (data.error) {
      alert('Błąd: ' + data.error);
    } else {
      messageInput.value = '';
      avatarInput.value = '';
      avatarDataUrl = null;
      fetchMessages();
    }
  } catch (err) {
    alert('Błąd wysyłania wiadomości');
  }
}

sendBtn.addEventListener('click', () => {
  sendMessage();
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

fetchMessages();
setInterval(fetchMessages, 3000);