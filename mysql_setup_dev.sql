CREATE DATABASE IF NOT EXISTS qrmenu_db;
CREATE USER IF NOT EXISTS 'qrmenu_user'@'localhost' IDENTIFIED BY 'qrmenu_pwd';
GRANT ALL PRIVILEGES ON `qrmenu_db`.* TO 'qrmenu_user'@'localhost';
FLUSH PRIVILEGES;