import sqlite from "better-sqlite3";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

// export the types for the database
export interface DatabaseUser {
  id: string;
  username: string;
  hashedPassword: string;
}

//create the sqlite DB
export const db = new sqlite("app.sqlite");

// Create a table with users
db.exec(`CREATE TABLE IF NOT EXISTS user (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  hashedPassword TEXT NOT NULL
)`);

// Create a table with sessions with a relation to users table
db.exec(`CREATE TABLE IF NOT EXISTS session (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
)`);

// Seeds
// const users = [{ username: "pat-mahomes", password: "KC03PLM15" }];

// const queryInsert = db.prepare(
//   "INSERT INTO user (id, username, hashedPassword) VALUES (?, ?, ?)"
// );

// users.forEach(async (user) => {
//   const userId = generateId(15);
//   const hashedPassword = await new Argon2id().hash(user.password);
//   queryInsert.run(userId, user.username, hashedPassword);
// });

// example using the better-sqlite3
// Create a table with users
// db.exec(`CREATE TABLE IF NOT EXISTS user (
//   id TEXT NOT NULL PRIMARY KEY,
//   username TEXT NOT NULL UNIQUE,
//   hashed_password TEXT NOT NULL
// )`);

// // Create a table with sessions with a relation to users table
// db.exec(`CREATE TABLE IF NOT EXISTS session (
//   id TEXT NOT NULL PRIMARY KEY,
//   expires_at INTEGER NOT NULL,
//   user_id TEXT NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES user(id)
// )`);

// ------------------------------------ EXAMPLES WITH DOCS ------------------------------
// INSERT DATA
// const data = [
//   { name: "Caleb Williams", username: "cal-williams" },
//   { name: "Patrick Mahomes", username: "pat-mahomes" },
//   { name: "Joe Burrow", username: "joe-burrow" },
// ];

// const insertData = db.prepare(
//   "INSERT INTO users (name, username) VALUES (?, ?)"
// );

// data.forEach((item) => {
//   insertData.run(item.name, item.username);
// });

// db.close();

// Get all users
// const query = 'SELECT * FROM users'
// const users = db.prepare(query).all()
// console.log('My users: ', users)

// Get a sinlgle user
// const user = db.prepare('SELECT * FROM users WHERE id = ?').get(1)
// console.log(user)

/*
 -> Run is when you dont expect a return value
 -> Use prepare when you expect some return value like when you use a SELECT
*/
