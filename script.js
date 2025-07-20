const apiUrl = 'https://globalchatplbackend.onrender.com'; // ← Zmień na swój backend!
let lastSentTime = 0;

const nickInput = document.getElementById('nick');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');

sendBtn.onclick = async () => {
  const nick = nickInput.value.trim();
  const text = messageInput.value.trim();

  if (!nick || !text) {
    alert('Wpisz nick i wiadomość!');
    return;
  }

  const now = Date.now();
  if (now - lastSentTime < 3000) {
    alert('Poczekaj 3 sekundy przed kolejną wiadomością');
    return;
  }

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick, text })
    });
    messageInput.value = '';
    lastSentTime = now;
    loadMessages();
  } catch (err) {
    alert('Błąd przy wysyłaniu wiadomości');
    console.error(err);
  }
};

async function loadMessages() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    messagesDiv.innerHTML = data.map(msg =>
      `<p><strong>${msg.nick}:</strong> ${msg.text}</p>`
    ).join('');
  } catch (err) {
    console.error('Błąd przy pobieraniu wiadomości', err);
  }
}

setInterval(loadMessages, 3000);
loadMessages();
