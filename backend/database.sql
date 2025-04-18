create TABLE city (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    event_ids INTEGER[] DEFAULT '{}'
);

create TABLE event (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descr TEXT,
    id_city INT NOT NULL,
    FOREIGN KEY (id_city) REFERENCES city(id)
);

CREATE TABLE event_city (
    event_id INT REFERENCES event(id) ON DELETE CASCADE,
    city_id INT REFERENCES city(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, city_id)
);

CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE artist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    followers INT
);

CREATE TABLE organizer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    followers INT
);

CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'user');

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user'
);

