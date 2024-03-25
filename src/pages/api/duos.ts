import type { APIRoute } from "astro";
import { db } from "@/lib/db";

export const GET: APIRoute = async ({ request }) => {
  try {
    const allDuos = db.prepare("SELECT * from duos").all();

    return new Response(
      JSON.stringify({
        data: allDuos,
        status: 200,
      })
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

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { player1, player2 } = body;

    // Valid the player name
    let playerNum = 1;
    for (const player of [player1, player2]) {
      if (
        typeof player !== "string" ||
        player.length < 2 ||
        player.length > 35 ||
        !/^[a-zA-Z\s]+$/.test(player)
      ) {
        return new Response(
          JSON.stringify({
            error: `Nombre del juagador ${playerNum} invalido`,
          }),
          {
            status: 400,
          }
        );
      }
      playerNum += 1;
    }

    // create the new duo`
    try {
      const query = db.prepare(
        "INSERT INTO duos (player1, player2) VALUES (?, ?)"
      );
      query.run(player1, player2);
      return new Response(
        JSON.stringify({
          status: 201,
          message: "Duo created successfully",
        })
      );
    } catch (error: any) {
      // check if the erros is cause the players name are not unique
      if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return new Response(
          JSON.stringify({
            error: `Datos previamente registrados, los nombres tienen que ser unicos`,
          }),
          {
            status: 400,
          }
        );
      }
      return new Response(
        JSON.stringify({
          error: `Error del servidor interno`,
        }),
        {
          status: 500,
        }
      );
    }
  }
  return new Response(null, { status: 400 });
};
// export const DELETE: APIRoute = ({ request }) => {
//   return new Response(
//     JSON.stringify({
//       message: "This was a DELETE!",
//     })
//   );
// };

// export const ALL: APIRoute = ({ request }) => {
//   return new Response(
//     JSON.stringify({
//       message: `This was a ${request.method}!`,
//     })
//   );
// };
