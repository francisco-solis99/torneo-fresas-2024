import type { APIRoute } from "astro";
import { db } from "@/lib/db";

export const GET: APIRoute = async ({ request }) => {
  try {
    const allGroups = db.prepare("SELECT * FROM groups").all();

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
