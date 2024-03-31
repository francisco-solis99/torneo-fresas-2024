import sqlite from "better-sqlite3";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

// export the types for the database
export interface DatabaseUser {
  id: string;
  username: string;
  hashedPassword: string;
}
export interface DatabaseGroup {
  id: number;
  name: string;
}
export interface DatabaseDuo {
  id: number;
  player1: string;
  player2: string;
  groupId?: number;
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
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
)`);

// Group
db.exec(`CREATE TABLE IF NOT EXISTS groups (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
)`);

// Duo
db.exec(`CREATE TABLE IF NOT EXISTS duos (
  id INTEGER NOT NULL PRIMARY KEY,
  player1 TEXT NOT NULL UNIQUE,
  player2 TEXT NOT NULL UNIQUE,
  group_id INTEGER,
  FOREIGN KEY (group_id)
    REFERENCES groups (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)`);

// Seeds users
// const users = [{ username: "pat-mahomes", password: "KC03PLM15" }];

// const queryInsert = db.prepare(
//   "INSERT INTO user (id, username, hashedPassword) VALUES (?, ?, ?)"
// );

// users.forEach(async (user) => {
//   const userId = generateId(15);
//   const hashedPassword = await new Argon2id().hash(user.password);
//   queryInsert.run(userId, user.username, hashedPassword);
// });

// Seeds groups
// const groups = [
//   {
//     id: 1,
//     name: "A",
//   },
//   {
//     id: 2,
//     name: "B",
//   },
//   {
//     id: 3,
//     name: "C",
//   },
// ];
// const queryInsertGroups = db.prepare(
//   "INSERT INTO groups (id, name) VALUES (?, ?)"
// );

// groups.forEach((group) => {
//   queryInsertGroups.run(group.id, group.name);
// });

// Seeds users
// const users = [{ username: "pat-mahomes", password: "KC03PLM15" }];

// const queryInsert = db.prepare(
//   "INSERT INTO user (id, username, hashedPassword) VALUES (?, ?, ?)"
// );

// users.forEach(async (user) => {
//   const userId = generateId(15);
//   const hashedPassword = await new Argon2id().hash(user.password);
//   queryInsert.run(userId, user.username, hashedPassword);
// });

// Seeds duos
// const duos = [
//   {
//     player1: "Dak Prescott",
//     player2: "Ceede Lamb",
//   },
//   {
//     player1: "Jalen Hurts",
//     player2: "Aj Brown",
//   },
//   {
//     player1: "Brock Purdy",
//     player2: "Brando Ayuk",
//   },
//   {
//     player1: "Tom Brady",
//     player2: "Rob Gronkoski",
//   },
//   {
//     player1: "Kirk Cousins",
//     player2: "Justin Jefferson",
//   },
//   {
//     player1: "Patrick Mahomes",
//     player2: "Travis Kelce",
//   },
//   {
//     player1: "Tua Tagovailoa",
//     player2: "Tyreek Hill",
//   },
//   {
//     player1: "Josh Allen",
//     player2: "Stephon Diggs",
//   },
//   {
//     player1: "Joe Burrow",
//     player2: "Jamar Chase",
//   },
//   {
//     player1: "Lamar Jackson",
//     player2: "Zay Flowers",
//   },
//   {
//     player1: "Matthew Stafford",
//     player2: "Puca Nakua",
//   },
//   {
//     player1: "CJ Stroud",
//     player2: "Nico Collins",
//   },
//   {
//     player1: "Jared Goff",
//     player2: "Amon-Ra St Brown",
//   },
//   {
//     player1: "Justin Herbert",
//     player2: "Keenan Allen",
//   },
//   {
//     player1: "Baker Mayyield",
//     player2: "Mike Evans",
//   },
//   {
//     player1: "Jordan Love",
//     player2: "Romeo Doubs",
//   },
//   {
//     player1: "Aaron Rodgers",
//     player2: "Garret Wilson",
//   },
//   {
//     player1: "Russel Wilson",
//     player2: "Courtland Sutton",
//   },
//   {
//     player1: "Jimmy Garapollo",
//     player2: "Davante Adams",
//   },
//   {
//     player1: "Derek Car",
//     player2: "Chris Olave",
//   },
// ];
// const queryInsertDuos = db.prepare(
//   "INSERT INTO duos (player1, player2) VALUES (?, ?)"
// );

// duos.forEach((duo) => {
//   queryInsertDuos.run(duo.player1, duo.player2);
// });

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

function fillDuosGroupRandomly() {
  const randomDuos = db
    .prepare(
      `
    SELECT duos.id, player1, player2, group_id AS groupId, groups.name AS groupName
    FROM duos
    LEFT JOIN groups ON groups.id = duos.group_id
    ORDER BY random()
  `
    )
    .all();
  console.log(randomDuos);
  // const groupsId: any[] = db.prepare("SELECT id FROM groups").all();
  // const numDuosPerGroup = 3;

  // const updateDuoGroupId = db.prepare(
  //   "UPDATE duos SET group_id = ? WHERE id = ?"
  // );
  // let indexGroup = 0;
  // randomDuos.forEach((duo: any, index: number) => {
  //   if (index % numDuosPerGroup === 0) indexGroup += 1;
  //   const groupId = groupsId[indexGroup - 1];
  //   updateDuoGroupId.run(groupId.id, duo.id);
  // });
}

fillDuosGroupRandomly();

// const duosByGroup = db
//   .prepare(
//     "SELECT duos.id, player1, player2, group_id As groupId, groups.name AS group_name FROM duos LEFT JOIN groups ON groups.id = duos.group_id"
//   )
//   .all();
// console.log(duosByGroup);
