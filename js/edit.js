// 로그아웃
document.querySelector(".btn-logout").addEventListener("click", (e) => {
  alert("로그아웃하였습니다.");
  localStorage.clear();
  window.location.replace("../login.html");
});

// 환영인사
document.querySelector(".header span").innerText =
  localStorage.getItem("nick") + " 님 환영합니다!";

// 취소
document.querySelector(".btn-cancel").addEventListener("click", (e) => {
  window.history.back();
});

// 데이터 그대로 들고오기
const data = JSON.parse(localStorage.getItem("post"))[0];
document.querySelector("#title").value = data[1];
document.querySelector("#content").value = data[4];

// 데이터 수정
document.querySelector(".btn-submit").addEventListener("click", async (e) => {
  e.preventDefault();
  const title = document.querySelector("input").value;
  const content = document.querySelector("textarea").value;

  const res = await fetch("http://localhost:3000/editPost", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post_id: data[0],
      title: title,
      content: content,
    }),
  });
  window.location.replace("../main.html");
});
