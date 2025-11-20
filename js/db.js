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
  console.log(req.params.id);
  const post_id = req.params.id;
  let connection;
  try {
    connection = await getConnection();
    let result = await connection.execute(
      `SELECT p.post_id, p.title, u.nickname, TO_CHAR(p.post_time, 'yyyy. mm. dd.'), p.content
       FROM posts p
       JOIN users u ON u.user_id = p.user_id
       WHERE post_id=${post_id}`
    );
    console.log(result.rows);
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

app.listen(3000, () => {
  console.log("server running on port 3000");
});
