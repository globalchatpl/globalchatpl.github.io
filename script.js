const messagesEl = document.getElementById('messages');
const messageInput = document.getElementById('message');
const nickInput = document.getElementById('nick');
const colorInput = document.getElementById('color');
const avatarInput = document.getElementById('avatar');
const sendBtn = document.getElementById('sendBtn');

let lastSent = 0;
let messages = [];

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
    messages.push(msg);
    renderMessages();
    messageInput.value = "";
    lastSent = now;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onloadend();
  }
}

function renderMessages() {
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