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

INSERT INTO users VALUES ('admin', 'admin', '包府磊');
INSERT INTO posts VALUES (post_seq.NEXTVAL, sysdate, 'admin', '基敲力格4', '基敲郴侩4');
SELECT * FROM posts;
commit;

SELECT * FROM posts;