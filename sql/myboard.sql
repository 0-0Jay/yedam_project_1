CREATE TABLE users(
user_id VARCHAR2(20) CONSTRAINT users_id_pk PRIMARY KEY,
password VARCHAR2(20) CONSTRAINT users_pw_nn NOT NULL,
nickname VARCHAR2(20) CONSTRAINT users_nick_nn NOT NULL
);

CREATE SEQUENCE post_seq
INCREMENT BY 1
START WITH 1
NOCYCLE
NOCACHE;

CREATE SEQUENCE cmt_seq
INCREMENT BY 1
START WITH 1
NOCYCLE
NOCACHE;

CREATE TABLE posts(
post_id NUMBER CONSTRAINT posts_id_pk PRIMARY KEY,
post_time DATE DEFAULT sysdate CONSTRAINT posts_time_nn NOT NULL,
user_id VARCHAR2(20) CONSTRAINT users_id_fk REFERENCES users(user_id),
title VARCHAR2(50) CONSTRAINT posts_title_nn NOT NULL,
content VARCHAR2(4000));

CREATE TABLE comments(
cmt_id NUMBER CONSTRAINT cmt_id_pk PRIMARY KEY,
post_id NUMBER CONSTRAINT cmt_post_id_fk REFERENCES posts(post_id),
cmt VARCHAR2(500) CONSTRAINT cmt_cmt_nn NOT NULL,
user_id VARCHAR2(20) CONSTRAINT cmt_user_id_fk REFERENCES users(user_id),
cmt_time DATE DEFAULT sysdate);

ALTER TABLE comments
DROP CONSTRAINT cmt_post_id_fk;

ALTER TABLE comments
ADD CONSTRAINT cmt_post_id_fk
FOREIGN KEY (post_id)
REFERENCES posts(post_id)
ON DELETE CASCADE;

INSERT INTO users VALUES ('admin', 'admin', '관리자');
INSERT INTO posts VALUES (post_seq.NEXTVAL, sysdate, 'admin', '샘플제목'||post_seq.CURRVAL, '샘플내용' || post_seq.CURRVAL);
SELECT * FROM posts;
commit;

SELECT * FROM posts;

INSERT INTO comments VALUES(cmt_seq.NEXTVAL, 4, '샘플 댓글3입니다.', 'admin', sysdate);
commit;
SELECT * FROM comments;
commit;

SELECT c.cmt_id, u.nickname, c.cmt, TO_CHAR(c.cmt_time, 'yyyy. mm. dd. hh:mi:ss')
       FROM comments c
       JOIN users u ON u.user_id = c.user_id
       WHERE c.post_id= 4
       ORDER BY 1;
       
SELECT * FROM users;
DELETE FROM users WHERE user_id = '123';
commit;

UPDATE posts
SET title = '수정테스트', content = '수정테스트'
WHERE post_id = 72;
commit;

SELECT * FROM posts;