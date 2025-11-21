//db.js
const oracledb = require("oracledb");
const express = require("express");
const cors = require("cors");
const app = express(); //웹서버기능
const port = 3000;

app.use(cors()); //cors원칙  CORS 허용 (프론트에서 요청 가능하게)
app.use(express.json()); // body-parser json 처리 / 바디에 오는 데이터
app.use(express.urlencoded()); // key = val&key=val&.....

// db setting
const dbConfig = {
  user: "C##myboard",
  password: "myboard",
  connectString: "localhost:1521/xe",
};

async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    // console.log("db 접속 성공");
    return connection;
  } catch (err) {
    throw err;
  }
}
getConnection();

// 게시글 목록 요청
app.get("/board", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT p.post_id, p.title, u.nickname, TO_CHAR(p.post_time, 'yyyy. mm. dd.') 
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY 1 DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 게시글 내용 요청
app.get("/board/:id", async (req, res) => {
  const post_id = req.params.id;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT p.post_id, p.title, u.nickname, TO_CHAR(p.post_time, 'yyyy. mm. dd. hh:mi:ss'), p.content
       FROM posts p
       JOIN users u ON u.user_id = p.user_id
       WHERE post_id=${post_id}`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 로그인 요청
app.post("/logIn", async (req, res) => {
  const { id, pw } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT *
       FROM users
       WHERE user_id = :id AND password = :pw`,
      [id, pw]
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 회원가입 - 아이디 중복 체크
app.post("/chkID", async (req, res) => {
  const { id } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT *
       FROM users
       WHERE user_id = :id`,
      [id]
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 회원가입 - 닉네임 중복 체크
app.post("/chkNick", async (req, res) => {
  const { nick } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT *
       FROM users
       WHERE nickname = :nick`,
      [nick]
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 회원가입 요청
app.post("/signup", async (req, res) => {
  const { id, pw, nick } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `INSERT INTO users
       VALUES(:id, :pw, :nick)`,
      [id, pw, nick],
      { autoCommit: true }
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 댓글 내역 요청
app.get("/comments/:id", async (req, res) => {
  const post_id = req.params.id;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT c.cmt_id, u.nickname, c.cmt, TO_CHAR(c.cmt_time, 'yyyy. mm. dd. hh:mi:ss')
       FROM comments c
       JOIN users u ON u.user_id = c.user_id
       WHERE c.post_id=${post_id}
       ORDER BY 1`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 게시글 작성
app.post("/upload", async (req, res) => {
  const { title, content, user_id } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `INSERT INTO posts(post_id, title, content, user_id)
       VALUES(post_seq.NEXTVAL, :title, :content, :user_id)`,
      [title, content, user_id],
      { autoCommit: true }
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 게시글 삭제
app.delete("/delPost", async (req, res) => {
  const { post_id } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `DELETE FROM posts
       WHERE post_id = :post_id`,
      [post_id],
      { autoCommit: true }
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 게시글 수정
app.put("/editPost", async (req, res) => {
  const { post_id, title, content } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `UPDATE posts
       SET title = :title, content = :content
       WHERE post_id = :post_id`,
      [title, content, post_id],
      { autoCommit: true }
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// 댓글 작성
app.post("/comment", async (req, res) => {
  const { post_id, cmt, user_id } = req.body;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `INSERT INTO comments(cmt_id, post_id, cmt, user_id)
       VALUES(cmt_seq.NEXTVAL, :post_id, :cmt, :user_id)`,
      [post_id, cmt, user_id],
      { autoCommit: true }
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

app.listen(port, () => {
  console.log("server running on port 3000");
});
