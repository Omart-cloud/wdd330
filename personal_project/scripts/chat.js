document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");

  // Load existing messages from server
  fetch("http://localhost:3000/api/chat")
    .then(res => res.json())
    .then(messages => {
      messages.forEach(msg => appendMessage(msg));
    })
    .catch(err => {
      chatBox.innerHTML = "<p>Error loading chat messages.</p>";
    });

  // Handle form submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = chatInput.value.trim();
    if (!text) return;

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Chat submission failed");

      appendMessage(result);
      chatInput.value = "";
    } catch (err) {
      alert("Failed to send message: " + err.message);
    }
  });

  function appendMessage(message) {
    const msgDiv = document.createElement("div");
    const time = new Date(message.timestamp).toLocaleTimeString();
    msgDiv.textContent = `[${time}] ${message.text}`;
    msgDiv.style.marginBottom = "0.5rem";
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
