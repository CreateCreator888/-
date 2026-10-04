// 우리들의 이야기 - 기본 기능

const createRoomButton = document.getElementById("createRoom");
const joinRoomButton = document.getElementById("joinRoom");

const roomCodeInput = document.getElementById("roomCode");
const nicknameInput = document.getElementById("nickname");

// 새로운 방코드 만들기
function makeRoomCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }

  return code;
}

// 새로운 단톡방 만들기
createRoomButton.addEventListener("click", function () {
  const roomCode = makeRoomCode();

  alert(
    "🎉 새로운 단톡방이 만들어졌어요!\n\n" +
    "방코드: " + roomCode +
    "\n\n친구들에게 이 코드를 알려주세요!"
  );

  roomCodeInput.value = roomCode;
  roomCodeInput.focus();
});

// 기존 단톡방 들어가기
joinRoomButton.addEventListener("click", function () {
  const roomCode = roomCodeInput.value.trim();
  const nickname = nicknameInput.value.trim();

  if (!roomCode) {
    alert("방코드를 입력해주세요!");
    roomCodeInput.focus();
    return;
  }

  if (!nickname) {
    alert("닉네임을 입력해주세요!");
    nicknameInput.focus();
    return;
  }

  alert(
    "환영해요, " + nickname + "님! 🎉\n\n" +
    "방코드: " + roomCode
  );
});
