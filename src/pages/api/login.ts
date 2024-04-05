import { lucia } from "@/lib/auth";
import { Argon2id } from "oslo/password";
import { db } from "@/lib/db";

import type { DatabaseUser } from "@/lib/db";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  // Valid username
  const formData = await context.request.formData();
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response(JSON.stringify({ error: "Invalid username" }), {
      status: 400,
    });
  }
  // Valid password
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 400,
    });
  }

  // Valid if exist that user to make a login
  const { rows } = await db.execute({
    sql: "SELECT * FROM user WHERE username = ?",
    args: [username],
  });

  const existingUser: any = rows[0] ?? null;
  if (!existingUser) {
    return new Response(
      JSON.stringify({
        error: "Incorrect username or password",
      }),
      {
        status: 400,
      }
    );
  }

  // verify the password with argon
  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password
  );
  if (!validPassword) {
    return new Response(
      JSON.stringify({
        error: "Incorrect username or password",
      }),
      {
        status: 400,
      }
    );
  }

  // create a session if the username and password are valid
  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return new Response(null, { status: 200 });
}
