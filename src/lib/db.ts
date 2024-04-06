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

// Test queries
// const { rows } = await db.execute(`
// WITH RankedDuos AS (
//   SELECT g.name AS group_name, d.id AS duo_id, d.player1, d.player2,
//          COALESCE(SUM(CASE WHEN w.duo_id = d.id THEN 1 ELSE 0 END), 0) AS wins,
//          SUM(CASE WHEN m.duo1_id = d.id THEN m.points_d1 ELSE
//               CASE WHEN m.duo2_id = d.id THEN m.points_d2 ELSE 0 END
//          END) AS total_points
//   FROM groups g
//   INNER JOIN duos d ON g.id = d.group_id
//   LEFT JOIN matches m ON d.id IN (m.duo1_id, m.duo2_id)  -- Use LEFT JOIN for all duos
//   LEFT JOIN winners w ON m.id = w.match_id  -- Use LEFT JOIN for potential un-won matches
//   GROUP BY g.name, d.id, d.player1, d.player2
// )
// , RankedDuosByGroup AS (
//   SELECT *,
//          DENSE_RANK() OVER (PARTITION BY group_name ORDER BY wins DESC, total_points DESC) AS rank_within_group
//   FROM RankedDuos
// )
// SELECT g1.group_name AS group1_name, rd1.duo_id AS duo1_id, rd1.player1 AS player1_1, rd1.player2 AS player2_1,
//        g2.group_name AS group2_name, rd2.duo_id AS duo2_id, rd2.player1 AS player2_1, rd2.player2 AS player2_2
// FROM RankedDuosByGroup rd1
// INNER JOIN RankedDuosByGroup rd2 ON rd1.rank_within_group = 1 AND rd2.rank_within_group = 2 AND rd1.group_name <> rd2.group_name  -- Top duos from different groups
// INNER JOIN groups g1 ON rd1.group_name = g1.name
// INNER JOIN groups g2 ON rd2.group_name = g2.name
// ORDER BY g1.group_name, rd1.rank_within_group;`);

// console.log(rows);
