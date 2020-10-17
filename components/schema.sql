CREATE TABLE "public" . "users" (
    user_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) UNIQUE NOT NULL,
    roles TEXT, 
    activated BOOLEAN,
    is_admin BOOLEAN

);

CREATE TABLE "public" . "Viewing Permissions" (
    viewee_id INTEGER NULL,
    viewer_id INTEGER NOT NULL,
    relationship_type VARCHAR(255)
);