const joinBtn = document.getElementById("join-room");
const playerNameInput = document.getElementById("player-name");
const roomIdInput = document.getElementById("room-id");
const roomSelection = document.getElementById("room-selection");
const gameArea = document.getElementById("game-area");
const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-chat");
const messagesDiv = document.getElementById("messages");

let roomId = "";
let playerName = "";
let drawing = false;

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Join room
joinBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  roomId = roomIdInput.value.trim();

  if (!playerName || !roomId) {
    alert("Enter name and room ID");
    return;
  }

  roomSelection.style.display = "none";
  gameArea.style.display = "flex";

  listenForStrokes();
  listenForChat();
};

// Drawing function
function draw(x, y) {
  database.ref("rooms/" + roomId + "/strokes").push({
    x: x,
    y: y
  });
}

// Touch support
canvas.addEventListener("touchstart", (e) => {
  drawing = true;
});

canvas.addEventListener("touchend", () => drawing = false);

canvas.addEventListener("touchmove", (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];

  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  draw(x, y);
});

// Mouse support (for desktop)
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  draw(x, y);
});

// Listen for strokes
function listenForStrokes() {
  database.ref("rooms/" + roomId + "/strokes").on("child_added", (snapshot) => {
    const data = snapshot.val();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(data.x, data.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Send chat
sendChatBtn.onclick = () => {
  const text = chatInput.value.trim();
  if (!text) return;

  database.ref("rooms/" + roomId + "/chat").push({
    name: playerName,
    text: text
  });

  chatInput.value = "";
};

// Listen for chat
function listenForChat() {
  database.ref("rooms/" + roomId + "/chat").on("child_added", (snapshot) => {
    const msg = snapshot.val();

    const div = document.createElement("div");
    div.textContent = msg.name + ": " + msg.text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
