// 로그아웃
document.querySelector("#logout").addEventListener("click", (e) => {
  alert("로그아웃!");
  window.location.replace("../login.html");
});

// 게시글 목록
fetch("http://localhost:3000/board")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("board");
    for (let post of data) {
      console.log(post[0]);
      const tr = document.createElement("tr");
      post.forEach((e) => {
        const td = document.createElement("td");
        td.innerHTML = e;
        tr.appendChild(td);
      });
      tr.addEventListener("click", (e) => {
        fetch(`http://localhost:3000/board/${post[0]}`)
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem("post", data);
            console.log(localStorage.getItem("post"));
            window.location.href = "../post.html";
          });
      });
      container.appendChild(tr);
    }
  })
  .catch((err) => console.error(err));
