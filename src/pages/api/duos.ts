import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import type { DatabaseDuo } from "@/lib/db";

export const GET: APIRoute = async ({ request }) => {
  try {
    const allDuos = db
      .prepare(
        `
    SELECT duos.id, player1, player2, group_id AS groupId, groups.name AS groupName
      FROM duos
      LEFT JOIN groups ON groups.id = duos.group_id
    `
      )
      .all();

    return new Response(
      JSON.stringify({
        duos: allDuos,
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

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    // verify the session
    const authorizationHeader = request.headers.get("Authorization");
    const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
    if (!sessionId) {
      return new Response(null, {
        status: 401,
      });
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (!session || !user) {
      return new Response(null, {
        status: 403,
      });
    }

    const dataDuo = await request.json();
    // Valid the dataDuo
    const { errorMessage, validated } = validateDuoData(dataDuo);
    if (!validated) {
      return new Response(
        JSON.stringify({
          error: errorMessage,
        }),
        {
          status: 400,
        }
      );
    }

    const { player1, player2 } = dataDuo;
    // create the new duo
    try {
      const query = db.prepare(
        "INSERT INTO duos (player1, player2) VALUES (?, ?)"
      );
      query.run(player1, player2);
      return new Response(
        JSON.stringify({
          message: "Pareja creada exiosamente",
        }),
        {
          status: 201,
        }
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

export const DELETE: APIRoute = async ({ request }) => {
  // verify the session
  const authorizationHeader = request.headers.get("Authorization");
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
  if (!sessionId) {
    return new Response(null, {
      status: 401,
    });
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (!session || !user) {
    return new Response(null, {
      status: 403,
    });
  }

  const { id: idDuoToDelete } = await request.json();
  // verify the id
  if (!idDuoToDelete) {
    return new Response(
      JSON.stringify({
        error: `Pareja no encontrada`,
      }),
      {
        status: 404,
      }
    );
  }

  try {
    const queryDelete = db.prepare(`DELETE FROM duos WHERE id = ?`);
    const response = queryDelete.run(idDuoToDelete);
    // verify the delete action
    if (response.changes === 0) {
      return new Response(
        JSON.stringify({
          error: `Pareja no encontrada`,
        }),
        {
          status: 404,
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Pareja eliminada exitosamente",
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

export const PATCH: APIRoute = async ({ request }) => {
  // verify the session
  const authorizationHeader = request.headers.get("Authorization");
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
  if (!sessionId) {
    return new Response(null, {
      status: 401,
    });
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (!session || !user) {
    return new Response(null, {
      status: 403,
    });
  }

  const { id: idDuoToUpdate, data: dataToUpdate } = await request.json();

  // Valid the dataDuo
  const { errorMessage, validated } = validateDuoData(dataToUpdate);
  if (!validated) {
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 400,
      }
    );
  }

  // update the duo
  try {
    const query = db.prepare(
      `UPDATE duos SET player1 = ?, player2 = ?, group_id = ? WHERE id = ?`
    );
    query.run(
      dataToUpdate.player1,
      dataToUpdate.player2,
      dataToUpdate.group_id,
      idDuoToUpdate
    );
    return new Response(
      JSON.stringify({
        message: "Pareja actualizada exiosamente",
      }),
      {
        status: 200,
      }
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
};

function validateDuoData(duoData: DatabaseDuo) {
  const { player1, player2 } = duoData;
  // Validate the players name
  let playerNum = 1;
  for (const player of [player1, player2]) {
    if (
      typeof player !== "string" ||
      player.length < 2 ||
      player.length > 35 ||
      !/^[a-zA-Z\s]+$/.test(player)
    ) {
      return {
        errorMessage: `Nombre del juagador ${playerNum} invalido`,
        validated: false,
      };
    }
    playerNum += 1;
  }
  // TODO: validate the group and group id (remeber is not strict necessary to create a duo)

  // Correct validation
  return {
    errorMessage: null,
    validated: true,
  };
}

// async function isSessionVerify(authTk: string | null) {
//   const sessionId = lucia.readBearerToken(authTk ?? "");
//   if (!sessionId) {
//     return [
//       false,
//       new Response(null, {
//         status: 401,
//       }),
//     ];
//   }
//   const { session, user } = await lucia.validateSession(sessionId);
//   if (!session || !user) {
//     return [
//       false,
//       new Response(null, {
//         status: 403,
//       }),
//     ];
//   }
//   return [true];
// }
