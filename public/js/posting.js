// 로그아웃
document.querySelector(".btn-logout").addEventListener("click", (e) => {
  alert("로그아웃하였습니다.");
  localStorage.clear();
  window.location.replace("/login.html");
});

// 환영인사
document.querySelector(".header span").innerText =
  localStorage.getItem("nick") + " 님 환영합니다!";

// 취소
document.querySelector(".btn-cancel").addEventListener("click", (e) => {
  window.location.href = "/main.html";
});

// 등록
document.querySelector(".btn-submit").addEventListener("click", async (e) => {
  e.preventDefault();
  const title = document.querySelector("input").value;
  const content = document.querySelector("textarea").value;
  const user_id = localStorage.getItem("user");

  if (!title) {
    alert("제목을 작성해주세요.");
  } else if (!content) {
    alert("내용을 작성해주세요.");
  } else {
    const res = await fetch("/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        content: content,
        user_id: user_id,
      }),
    });

    window.location.href = "/main.html";
  }
});
