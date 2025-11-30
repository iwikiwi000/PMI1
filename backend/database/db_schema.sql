USE feitsecurity;

CREATE TABLE
    IF NOT EXISTS user (
        u_id int primary key auto_increment,
        name varchar(255) not null,
        hashed varchar(255) not null,
        salt varchar(255) not null
    );

CREATE TABLE
    IF NOT EXISTS camera (
        c_id int primary key auto_increment,
        title varchar(255) not null,
        link varchar(255) not null,
        source varchar(255) not null
    );

SELECT
    *
FROM
    user;

SELECT
    *
FROM
    camera;