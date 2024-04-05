import { createClient } from "@libsql/client";
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

//create the sqlite DB for production
// export const db = createClient({
//   url: import.meta.env.DATABASE_URL ?? "",
//   authToken: import.meta.env.DATABASE_AUTH_TOKEN ?? "",
// });
//create the sqlite DB for dev
export const db = createClient({
  url: "file:local.db.sqlite",
});

// // Create a table with users
await db.execute(`CREATE TABLE IF NOT EXISTS user (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  hashedPassword TEXT NOT NULL
)`);

// // Create a table with sessions with a relation to users table
await db.execute(`CREATE TABLE IF NOT EXISTS session (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id)
    REFERENCES user(id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)`);

// Group
// db.exec("DELETE FROM groups");
await db.execute(`CREATE TABLE IF NOT EXISTS groups (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
)`);

// Duo
db.execute(`CREATE TABLE IF NOT EXISTS duos (
  id INTEGER NOT NULL PRIMARY KEY,
  player1 TEXT NOT NULL UNIQUE,
  player2 TEXT NOT NULL UNIQUE,
  group_id INTEGER,
  FOREIGN KEY (group_id)
    REFERENCES groups (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)`);

// Phases Table
db.execute(`CREATE TABLE IF NOT EXISTS phases (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
)`);

// Matches Table
// db.execute("DELETE FROM matches");
db.execute(`CREATE TABLE IF NOT EXISTS matches (
  id INTEGER NOT NULL PRIMARY KEY,
  duo1_id INTEGER NOT NULL,
  duo2_id INTEGER NOT NULL,
  points_d1 INTEGER NOT NULL DEFAULT 0,
  points_d2 INTEGER NOT NULL DEFAULT 0,
  phase_id INTEGER NOT NULL,
  CHECK (points_d1 >= 0 AND points_d1 <= 10),
  CHECK (points_d2 >= 0 AND points_d2 <= 10),
  FOREIGN KEY (phase_id)
    REFERENCES phases (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
  FOREIGN KEY (duo1_id)
    REFERENCES duos (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
  FOREIGN KEY (duo2_id)
    REFERENCES duos (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)`);

// // Winners/Phase Table
db.execute(`CREATE TABLE IF NOT EXISTS winners (
  id INTEGER NOT NULL PRIMARY KEY,
  phase_id INTEGER NOT NULL,
  duo_id INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  FOREIGN KEY (duo_id)
    REFERENCES duos (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
  FOREIGN KEY (phase_id)
    REFERENCES phases (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
  FOREIGN KEY (match_id)
    REFERENCES matches (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)`);

// ---------------------------------------------- SEED --------------------------------
// Seeds users
// const users = [{ username: "pat-mahomes", password: "KC03PLM15" }];
// const usersHashed = users.map(async (user) => {
//   const userId = generateId(15);
//   const hashedPassword = await new Argon2id().hash(user.password);
//   return {
//     userId,
//     username: user.username,
//     hashedPassword,
//   };
// });

// const queryUserInsert =
//   "INSERT INTO user (id, username, hashedPassword) VALUES (?, ?, ?)";

// const usersHashedResolved = await Promise.all(usersHashed);
// const usersInserts = usersHashedResolved.map((user: any) => {
//   const { userId, username, hashedPassword } = user;
//   return {
//     sql: queryUserInsert,
//     args: [userId, username, hashedPassword],
//   };
// });
// await db.batch(usersInserts, "write");

// Seeds groups
// const groups = [
//   {
//     name: "A",
//   },
//   {
//     name: "B",
//   },
//   {
//     name: "C",
//   },
// ];
// const groupsInserts = groups.map((group) => {
//   return {
//     sql: "INSERT INTO groups (name) VALUES (?)",
//     args: [group.name],
//   };
// });
// await db.batch(groupsInserts, "write");

// Seed for phases
// const phases = [
//   {
//     name: "Fase 1",
//   },
//   {
//     name: "Fase 2",
//   },
//   {
//     name: "Fase 3",
//   },
// ];
// const phasesInserts = phases.map((phase) => {
//   return {
//     sql: "INSERT INTO phases (name) VALUES (?)",
//     args: [phase.name],
//   };
// });
// await db.batch(phasesInserts, "write");
