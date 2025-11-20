document.querySelector("#logout").addEventListener("click", (e) => {
  alert("로그아웃!");
  window.location.replace("../login.html");
});

document.querySelector("#list").addEventListener("click", (e) => {
  window.location.href = "../main.html";
});

const data = localStorage.getItem("post").split(",");
console.log(data);
document.querySelector("title").innerText = data;
