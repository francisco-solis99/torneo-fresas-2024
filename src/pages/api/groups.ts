import type { APIRoute } from "astro";
import { db } from "@/lib/db";

export const GET: APIRoute = async ({ request }) => {
  try {
    const { rows: allGroups } = await db.execute("SELECT * FROM groups");

    return new Response(
      JSON.stringify({
        groups: allGroups,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Error del servidor interno`,
      }),
      {
        status: 500,
      }
    );
  }
};
