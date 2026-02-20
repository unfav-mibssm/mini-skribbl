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

// Join Room
joinBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  roomId = roomIdInput.value.trim();

  if (!playerName || !roomId) {
    alert("Enter name and room ID");
    return;
  }

  roomSelection.style.display = "none";
  gameArea.style.display = "block";

  listenForStrokes();
  listenForChat();
};

// Drawing Events
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const strokeData = {
    x: x,
    y: y
  };

  database.ref("rooms/" + roomId + "/strokes").push(strokeData);
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

// Chat
sendChatBtn.onclick = () => {
  const text = chatInput.value.trim();
  if (!text) return;

  database.ref("rooms/" + roomId + "/chat").push({
    name: playerName,
    text: text
  });

  chatInput.value = "";
};

function listenForChat() {
  database.ref("rooms/" + roomId + "/chat").on("child_added", (snapshot) => {
    const msg = snapshot.val();

    const div = document.createElement("div");
    div.textContent = msg.name + ": " + msg.text;
    messagesDiv.appendChild(div);
  });
}
