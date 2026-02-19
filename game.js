// References to HTML elements
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
const playersListDiv = document.getElementById("players-list");

// Game variables
let playerName = "";
let roomId = "";
let drawing = false;

// Mouse position
let lastX, lastY;

// Join room
joinBtn.onclick = () => {
    playerName = playerNameInput.value.trim();
    roomId = roomIdInput.value.trim();
    if (!playerName || !roomId) {
        alert("Enter name and room ID");
        return;
    }

    roomSelection.style.display = "none";
    gameArea.style.display = "block";

    startListening();
};

// Canvas drawing events
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    // Draw locally
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Send stroke to Firebase
    const strokeRef = database.ref(`rooms/${roomId}/strokes`);
    strokeRef.push({
        x1: lastX,
        y1: lastY,
        x2: x,
        y2: y
    });

    [lastX, lastY] = [x, y];
});

// Listen for strokes from Firebase
function startListening() {
    // Listen to strokes
    const strokeRef = database.ref(`rooms/${roomId}/strokes`);
    strokeRef.on("child_added", (snapshot) => {
        const stroke = snapshot.val();
        ctx.beginPath();
        ctx.moveTo(stroke.x1, stroke.y1);
        ctx.lineTo(stroke.x2, stroke.y2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    });

    // Listen to chat messages
    const chatRef = database.ref(`rooms/${roomId}/chat`);
    chatRef.on("child_added", (snapshot) => {
        const msg = snapshot.val();
        const msgDiv = document.createElement("div");
        msgDiv.textContent = `${msg.name}: ${msg.text}`;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Send chat
sendChatBtn.onclick = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    const chatRef = database.ref(`rooms/${roomId}/chat`);
    chatRef.push({
        name: playerName,
        text
    });

    chatInput.value = "";
};