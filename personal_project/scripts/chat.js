// scripts/chat.js

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");

  // Load messages from localStorage (simulated)
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  messages.forEach(msg => appendMessage(msg));

  // Handle new message
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = chatInput.value.trim();
    if (!text) return;

    const message = {
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    appendMessage(message);
    saveMessage(message);
    chatInput.value = "";
  });

  function appendMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = `[${message.timestamp}] ${message.text}`;
    msgDiv.style.marginBottom = "0.5rem";
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function saveMessage(message) {
    const stored = JSON.parse(localStorage.getItem("chatMessages")) || [];
    stored.push(message);
    localStorage.setItem("chatMessages", JSON.stringify(stored));
  }
});
