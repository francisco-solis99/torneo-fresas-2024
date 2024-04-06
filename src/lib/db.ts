import { createClient } from "@libsql/client";

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
export const db = createClient({
  url: import.meta.env.DATABASE_URL ?? "",
  authToken: import.meta.env.DATABASE_AUTH_TOKEN ?? "",
});
// create the sqlite DB for dev
// export const db = createClient({
//   url: "file:local.db.sqlite",
// });
