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

  // Obsługa komend /ban, /owner, /say - wysyłamy jako POST, ale bez pokazywania komendy w chacie
  const banCmd = text.match(/^\/ban\s+[0-9.:]+\s+\S+/i);
  const ownerCmd = text.match(/^\/owner\s+\S+/i);
  const sayCmd = text.match(/^\/say\s+\S+\s+.+/i);

  if (banCmd || ownerCmd || sayCmd) {
    fetch(`${BACKEND_URL}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, nick: nickInput.value.trim() || "Anonim" })
    }).then(res => {
      if (!res.ok) return res.json().then(data => alert(data.error || 'Błąd'));
    });

    messageInput.value = "";
    return; // nie wysyłamy dalej
  }

  // Zwykła wiadomość

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
      messagesEl.innerHTML = data.map(msg => {
        // Kolory i znaczek właściciela
        let nickColor = msg.color || '#1e40af';
        let displayNick = escapeHtml(msg.nick);

        // Jeśli to właściciel
        if (msg.isOwner) {
          // złoty gradient i znaczek ✓
          nickColor = 'gold-gradient';
          displayNick += ' ✓';
        } else if (msg.color === 'gradient-green') {
          // wiadomości /say mają zielony gradient i znaczek ✓
          nickColor = 'green-gradient';
          displayNick += ' ✓';
        }

        return `
          <div class="msg">
            ${msg.avatar ? `<img src="${msg.avatar}" alt="avatar">` : `<img src="https://via.placeholder.com/40" alt="anonim">`}
            <div>
              <span class="${nickColor}">${displayNick}:</span>
              <div>${escapeHtml(msg.text)}</div>
            </div>
          </div>
        `;
      }).join("");
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