const id = document.querySelector("#id");
const pw = document.querySelector("#pw");
const pwchk = document.querySelector("#pwchk");
const nick = document.querySelector("#nick");

// 회원가입 버튼
document.querySelector("#signup").addEventListener("click", async (e) => {
  // 유효성 검사
  if (!id.value) {
    alert("아이디를 입력해주세요.");
    id.focus();
  } else if (!pw.value) {
    alert("비밀번호를 입력해주세요.");
    pw.focus();
  } else if (!pwchk.value) {
    alert("비밀번호 확인을 입력해주세요.");
    pwchk.focus();
  } else if (!nick.value) {
    alert("닉네임을 입력해주세요.");
    nick.focus();
  } else if (!(await chkUserId(id.value))) {
    alert("이미 존재하는 ID 입니다.");
    id.focus();
  } else if (pw.value != pwchk.value) {
    alert("비밀번호 확인과 비밀번호가 일치하지 않습니다.");
    pwchk.focus();
  } else if (!(await chkNickname(nick.value))) {
    alert("이미 존재하는 닉네임입니다.");
    nick.focus();
  } else {
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id.value,
        pw: pw.value,
        nick: nick.value,
      }),
    });
    alert("회원가입 되었습니다. 로그인 해주세요.");
    window.location.href = "../login.html";
  }
});

// 이전 버튼
document.querySelector("#undo").addEventListener("click", (e) => {
  window.location.replace("../login.html");
});

async function chkUserId(id) {
  const res = await fetch("http://localhost:3000/chkId", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  });
  const data = await res.json();
  return data.rows.length === 0; // 존재하지 않으면 true
}

async function chkNickname(nick) {
  const res = await fetch("http://localhost:3000/chkNick", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick: nick }),
  });
  const data = await res.json();
  return data.rows.length === 0; // 존재하지 않으면 true
}
