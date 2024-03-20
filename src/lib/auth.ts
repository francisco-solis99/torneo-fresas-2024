import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./db";
import type { DatabaseUser } from "./db";

// create the adapter, with lucia and the db(depends of the db)
const adapter = new BetterSqlite3Adapter(db, {
  user: "user",
  session: "session",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    };
  },
});

// TypeScript  types
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}
