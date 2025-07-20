const BACKEND_URL = 'https://globalchatplbackend.onrender.com';

const messagesEl = document.getElementById('messages');
const messageInput = document.getElementById('message');
const nickInput = document.getElementById('nick');
const colorInput = document.getElementById('color');
const avatarInput = document.getElementById('avatar');
const sendBtn = document.getElementById('sendBtn');

let lastSent = 0;

sendBtn.onclick = sendMessage;

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const now = Date.now();
  if (now - lastSent < 3000) {
    alert("Poczekaj 3 sekundy przed kolejną wiadomością.");
    return;
  }

  const reader = new FileReader();
  const file = avatarInput.files[0];

  reader.onloadend = () => {
    const msg = {
      text,
      nick: nickInput.value.trim() || "Anonim",
      color: colorInput.value,
      avatar: reader.result || null
    };

    fetch(`${BACKEND_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    });

    messageInput.value = "";
    lastSent = now;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onloadend();
  }
}

function fetchMessages() {
  fetch(`${BACKEND_URL}/messages`)
    .then(res => res.json())
    .then(data => {
      messagesEl.innerHTML = data.map(msg => `
        <div class="msg">
          ${msg.avatar ? `<img src="${msg.avatar}" alt="avatar">` : `<img src="https://via.placeholder.com/40" alt="anonim">`}
          <div>
            <span style="color: ${msg.color}">${escapeHtml(msg.nick)}:</span>
            <div>${escapeHtml(msg.text)}</div>
          </div>
        </div>
      `).join("");
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
}

setInterval(fetchMessages, 2000);
fetchMessages();

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}