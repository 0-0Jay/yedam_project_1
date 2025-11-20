// 회원가입 버튼
document
  .querySelector("button[type='button']")
  .addEventListener("click", (e) => {
    window.location.href = "../signup.html";
  });

// 로그인 버튼
document
  .querySelector("button[type='submit']")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const pw = document.getElementById("pw").value;
    console.log(id, pw);

    fetch("http://localhost:3000/logIn", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        pw: pw,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.rows);
        if (data.rows.length == 1) {
          alert("로그인하였습니다.");
          window.location.replace("../main.html");
        } else {
          alert("아이디 또는 비밀번호가 틀렸습니다.");
        }
      });
  });
