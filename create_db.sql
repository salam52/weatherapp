CREATE DATABASE IF NOT EXISTS weatherapp;
USE weatherapp;

CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT, username VARCHAR(20), hashedpassword VARCHAR(100), PRIMARY KEY(id));

CREATE USER IF NOT EXISTS "weather_user"@"localhost" IDENTIFIED BY "weather";
GRANT ALL PRIVILEGES ON weatherapp.* TO "weather_user"@"localhost";