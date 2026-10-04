const db = window.firebaseDB;
const {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} = window.firebaseFunctions;

const createRoom = document.getElementById("createRoom");
const joinRoom = document.getElementById("joinRoom");
const roomCode = document.getElementById("roomCode");
const nickname = document.getElementById("nickname");

const chatRoom = document.getElementById("chatRoom");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");
const leaveRoom = document.getElementById("leaveRoom");
const roomNumber = document.getElementById("roomNumber");

let currentRoom = "";
let currentNickname = "";
let unsubscribe = null;


// 방 코드 만들기
function makeRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}


// 새로운 방 만들기
createRoom.addEventListener("click", async () => {
  const code = makeRoomCode();

  roomCode.value = code;

  alert("새로운 방이 만들어졌어요!\n방코드: " + code);
});


// 방 입장
joinRoom.addEventListener("click", async () => {
  const code = roomCode.value.trim().toUpperCase();
  const name = nickname.value.trim();

  if (!code) {
    alert("방코드를 입력해주세요.");
    return;
  }

  if (!name) {
    alert("닉네임을 입력해주세요.");
    return;
  }

  currentRoom = code;
  currentNickname = name;

  roomNumber.textContent = "방코드: " + currentRoom;

  document.querySelector(".join").style.display = "none";
  createRoom.style.display = "none";
  chatRoom.style.display = "flex";

  startListening();
});


// 메시지 실시간으로 불러오기
function startListening() {

  if (unsubscribe) {
    unsubscribe();
  }

  messages.innerHTML = "";

  const messagesRef = collection(
    db,
    "rooms",
    currentRoom,
    "messages"
  );

  const q = query(
    messagesRef,
    orderBy("createdAt", "asc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {

    messages.innerHTML = "";

    snapshot.forEach((doc) => {

      const data = doc.data();

      const message = document.createElement("div");

      if (data.nickname === currentNickname) {
        message.className = "message mine";
      } else {
        message.className = "message other";
      }

      message.innerHTML = `
        <span class="name">${escapeHTML(data.nickname)}</span>
        <div class="bubble">
          ${escapeHTML(data.text)}
        </div>
      `;

      messages.appendChild(message);
    });

    messages.scrollTop = messages.scrollHeight;
  });
}


// 메시지 보내기
async function sendChatMessage() {

  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  if (!currentRoom || !currentNickname) {
    return;
  }

  try {

    await addDoc(
      collection(
        db,
        "rooms",
        currentRoom,
        "messages"
      ),
      {
        nickname: currentNickname,
        text: text,
        createdAt: serverTimestamp()
      }
    );

    messageInput.value = "";
    messageInput.focus();

  } catch (error) {

    console.error(error);

    alert(
      "메시지를 보내지 못했어요.\n" +
      "Firestore 보안 규칙을 확인해주세요."
    );
  }
}


// 전송 버튼
sendMessage.addEventListener("click", sendChatMessage);


// 엔터로 보내기
messageInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {
    sendChatMessage();
  }

});


// 방 나가기
leaveRoom.addEventListener("click", () => {

  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  currentRoom = "";
  currentNickname = "";

  messages.innerHTML = "";

  chatRoom.style.display = "none";
  document.querySelector(".join").style.display = "flex";
  createRoom.style.display = "block";

});


// HTML 코드가 메시지로 실행되는 것을 막기
function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
