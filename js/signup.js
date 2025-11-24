const id = document.querySelector("#id");
const pw = document.querySelector("#pw");
const pwchk = document.querySelector("#pwchk");
const nick = document.querySelector("#nick");
const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// 회원가입 버튼
document.querySelector(".btn-signup").addEventListener("click", async (e) => {
  e.preventDefault();
  // 유효성 검사
  if (!id.value) {
    alert("아이디를 입력해주세요.");
    id.focus();
  } else if (!pw.value) {
    alert("비밀번호를 입력해주세요.");
    pw.focus();
  } else if (!regex.test(pw.value)) {
    alert("비밀번호는 8자 이상 영문과 숫자로 구성해주세요.");
  } else if (!pwchk.value) {
    alert("비밀번호 확인을 입력해주세요.");
    pwchk.focus();
  } else if (!nick.value) {
    alert("닉네임을 입력해주세요.");
    nick.focus();
  } else if (id.value.length < 4 || id.value.length > 20) {
    alert("아이디는 4~20자로 입력해주세요.");
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
