// 로그아웃
document.querySelector(".btn-logout").addEventListener("click", (e) => {
  alert("로그아웃하였습니다.");
  localStorage.clear();
  window.location.replace("../login.html");
});

// 환영인사
document.querySelector(".header span").innerText =
  localStorage.getItem("nick") + " 님 환영합니다!";

// 글쓰기 버튼
document.querySelector(".btn-write").addEventListener("click", (e) => {
  window.location.href = "../posting.html";
});

const ROWS_PER_PAGE = 5; // 한 페이지당 10개
const PAGE_GROUP_SIZE = 5; // 페이지 버튼 최대 5개
let allPosts = [];
let allPostsOriginal = [];
let currentPage = 1;

// 서버에서 전체 게시글 불러오기
fetch("http://localhost:3000/board")
  .then((res) => res.json())
  .then((data) => {
    allPosts = data;
    allPostsOriginal = data;
    renderTable();
    renderPagination();
  });

// 현재 페이지 테이블 렌더링
function renderTable() {
  const container = document.getElementById("board");
  container.innerHTML = "";

  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  const pagePosts = allPosts.slice(start, end);

  for (let post of pagePosts) {
    const post_item = document.createElement("div");
    post_item.className = "post-item";

    const post_title = document.createElement("div");
    post_title.className = "post-title";
    post_title.innerText = post[1];

    const post_meta = document.createElement("div");
    post_meta.className = "post-meta";
    const author = document.createElement("span");
    author.innerText = "👤 작성자 : " + post[2];
    const date = document.createElement("span");
    date.innerText = "📅 " + post[3];
    post_meta.appendChild(author);
    post_meta.appendChild(date);
    post_item.appendChild(post_title);
    post_item.appendChild(post_meta);

    post_item.addEventListener("click", () => {
      fetch(`http://localhost:3000/board/${post[0]}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("post", JSON.stringify(data));
          window.location.href = "../post.html";
        });
    });

    container.appendChild(post_item);
  }
}

// 동적 페이징 (5개 단위 그룹)
function renderPagination() {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(allPosts.length / ROWS_PER_PAGE);

  // 현재 페이지가 속한 "그룹" 계산
  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);

  // 그룹의 시작/끝 페이지 번호
  const groupStart = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, totalPages);

  // << 버튼 (이전 그룹)
  const prevGroupBtn = document.createElement("button");
  prevGroupBtn.className = "page-btn page-prev";
  prevGroupBtn.innerHTML = "&laquo;";
  prevGroupBtn.disabled = groupStart === 1;
  prevGroupBtn.addEventListener("click", () => {
    currentPage = groupStart - PAGE_GROUP_SIZE;
    renderTable();
    renderPagination();
  });
  pagination.appendChild(prevGroupBtn);

  // 그룹의 페이지 버튼 생성
  for (let i = groupStart; i <= groupEnd; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.innerText = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
      renderPagination();
    });

    pagination.appendChild(btn);
  }

  // >> 버튼 (다음 그룹)
  const nextGroupBtn = document.createElement("button");
  nextGroupBtn.className = "page-btn page-next";
  nextGroupBtn.innerHTML = "&raquo;";
  nextGroupBtn.disabled = groupEnd >= totalPages;
  nextGroupBtn.addEventListener("click", () => {
    currentPage = groupEnd + 1;
    renderTable();
    renderPagination();
  });
  pagination.appendChild(nextGroupBtn);
}

// 게시글 검색
document.querySelector(".btn-search").addEventListener("click", () => {
  const keyword = document
    .querySelector(".search-input")
    .value.trim()
    .toLowerCase();

  allPosts = allPostsOriginal.filter(
    (post) =>
      post[1].toLowerCase().includes(keyword) || // 제목
      post[2].toLowerCase().includes(keyword) // 닉네임
  );

  currentPage = 1;
  renderTable();
  renderPagination();
});

document.querySelector(".search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.querySelector(".btn-search").click(); // 검색 버튼 클릭과 동일하게 처리
  }
});
