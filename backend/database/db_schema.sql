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

CREATE TABLE
    IF NOT EXISTS archive_policy (
        p_id INT PRIMARY KEY AUTO_INCREMENT,
        camera_id INT NOT NULL,
        retention_days INT NOT NULL,
        storage_type VARCHAR(50) NOT NULL,
        resolution VARCHAR(50),
        file_format VARCHAR(20),
        segment_minutes INT DEFAULT 60,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (camera_id) REFERENCES camera (c_id)
    );

CREATE TABLE
    IF NOT EXISTS camera_recording (
        r_id INT PRIMARY KEY AUTO_INCREMENT,
        camera_id INT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_link VARCHAR(255) NOT NULL,
        file_size BIGINT,
        recorded_at DATETIME NOT NULL,
        expires_at DATETIME NOT NULL,
        archived BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (camera_id) REFERENCES camera (c_id)
    );

SELECT
    *
FROM
    user;

SELECT
    *
FROM
    camera;