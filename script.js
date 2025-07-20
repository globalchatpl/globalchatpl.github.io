const messagesEl = document.getElementById('messages');
const messageInput = document.getElementById('message');
const nickInput = document.getElementById('nick');
const colorInput = document.getElementById('color');
const avatarInput = document.getElementById('avatar');
const sendBtn = document.getElementById('sendBtn');

const SERVER = 'https://globalchatplbackend.onrender.com';

async function loadMessages() {
  const res = await fetch(`${SERVER}/messages`);
  const data = await res.json();
  renderMessages(data);
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const file = avatarInput.files[0];
  let avatarData = null;

  if (file) {
    avatarData = await toBase64(file);
  }

  const payload = {
    text,
    nick: nickInput.value.trim() || "Anonim",
    color: colorInput.value,
    avatar: avatarData,
  };

  const res = await fetch(`${SERVER}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    messageInput.value = "";
    await loadMessages();
  } else {
    const err = await res.json();
    alert(err.error || "Błąd wysyłania wiadomości.");
  }
}

function renderMessages(messages) {
  messagesEl.innerHTML = messages.map(msg => `
    <div class="msg">
      ${msg.avatar ? `<img src="${msg.avatar}" alt="avatar">` : `<img src="https://via.placeholder.com/40" alt="anonim">`}
      <div>
        <span style="color: ${msg.color}">${escapeHtml(msg.nick)}:</span>
        <div>${escapeHtml(msg.text)}</div>
      </div>
    </div>
  `).join("");
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

sendBtn.onclick = sendMessage;
setInterval(loadMessages, 3000);
loadMessages();