document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  if (message) {
    // Tampilkan pesan pengguna di chat
    displayMessage(message, 'user');

    // Kosongkan input setelah mengirim
    userInput.value = '';
    
    // Tampilkan indikator mengetik bot
    showTypingIndicator();

    try {
      const response = await fetch('https://aihub.xtermai.xyz/api/chat/gpt?key=vyne', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: message
          }]
        })
      });

      const data = await response.json();

      // Cek dan tampilkan respon dari bot
      if (data && data.response) {
        setTimeout(() => {
          displayMessage(data.response, 'bot');
          hideTypingIndicator();
        }, 1500); // Delay untuk efek mengetik
      } else {
        setTimeout(() => {
          displayMessage("Sorry, I didn't understand that.", 'bot');
          hideTypingIndicator();
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        displayMessage('Something went wrong. Please try again later.', 'bot');
        hideTypingIndicator();
      }, 1500);
    }
  }
}

function displayMessage(message, sender) {
  const chatBox = document.getElementById('chatBox');
  
  // Buat elemen pesan baru
  const messageElem = document.createElement('div');
  messageElem.classList.add('message', `${sender}-message`);
  
  // Menampilkan pesan dengan foto profil bot di samping bubble chat
  messageElem.innerHTML = `
    ${sender === 'bot' ? '<div class="bot-profile"><img src="https://files.catbox.moe/jygjrm.jpg" alt="Vyne Ai" class="bot-image"></div>' : ''}
    <div class="bubble">${message}</div>
  `;

  // Menambahkan pesan ke chat box
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll ke bawah agar pesan terbaru terlihat
}

function showTypingIndicator() {
  document.getElementById('typingIndicator').style.display = 'flex';
}

function hideTypingIndicator() {
  document.getElementById('typingIndicator').style.display = 'none';
}