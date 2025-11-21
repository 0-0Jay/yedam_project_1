document.querySelector("#logout").addEventListener("click", (e) => {
  alert("로그아웃하였습니다.");
  localStorage.clear();
  window.location.replace("../login.html");
});

document.querySelector("#list").addEventListener("click", (e) => {
  window.location.href = "../main.html";
});

const data = JSON.parse(localStorage.getItem("post"))[0];
const user_id = localStorage.getItem("user");
document.querySelector("#title").innerText = data[1];
document.querySelector("#nickname").innerText = `작성자 : ${data[2]}`;
document.querySelector("#post_time").innerText = `작성일 : ${data[3]}`;
document.querySelector("#content").innerText = data[4];

// 댓글 조회
fetch(`http://localhost:3000/comments/${data[0]}`)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("comments");
    for (let cmt of data) {
      const div = document.createElement("div");
      div.className = "cmt";
      const user = document.createElement("span");
      user.innerText = cmt[1];
      const date = document.createElement("span");
      date.innerText = cmt[3];
      const rp = document.createElement("p");
      rp.innerText = cmt[2];
      div.appendChild(user);
      div.appendChild(date);
      div.appendChild(rp);
      container.appendChild(div);
    }
  })
  .catch((err) => console.error(err));

// 댓글 작성
document.querySelector("#cmt").addEventListener("click", (e) => {
  const cmt = document.querySelector("#cmt_value").value;
  if (cmt == "") {
    alert("내용을 입력 후 등록해주세요.");
    return;
  }
  fetch("http://localhost:3000/comment", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post_id: data[0],
      cmt: cmt,
      user_id: user_id,
    }),
  });
  location.reload();
});

// 게시글 삭제
document.querySelector("#del").addEventListener("click", (e) => {
  if (
    data[2] == localStorage.getItem("nick") ||
    localStorage.getItem("id") == "admin"
  ) {
    if (confirm("정말 삭제하시겠습니까?")) {
      fetch("http://localhost:3000/delPost", {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: data[0],
        }),
      });
      alert("삭제되었습니다.");
      window.location.replace("../main.html");
    }
  } else {
    alert("다른 사람의 게시글은 삭제할 수 없습니다.");
  }
});

// 게시글 수정
document.querySelector("#put").addEventListener("click", (e) => {
  if (
    data[2] == localStorage.getItem("nick") ||
    localStorage.getItem("id") == "admin"
  ) {
    window.location.href = "../edit.html";
  } else {
    alert("다른 사람의 게시글은 수정할 수 없습니다.");
  }
});
