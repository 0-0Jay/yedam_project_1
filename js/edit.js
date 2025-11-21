document.querySelector("#logout").addEventListener("click", (e) => {
  alert("로그아웃하였습니다.");
  localStorage.clear();
  window.location.replace("../login.html");
});

// 취소
document.querySelector("#undo").addEventListener("click", (e) => {
  window.history.back();
});

// 데이터 그대로 들고오기
const data = JSON.parse(localStorage.getItem("post"))[0];
document.querySelector("#title").value = data[1];
document.querySelector("#content").value = data[4];

// 데이터 수정
document.querySelector("#upload").addEventListener("click", async (e) => {
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
