import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import type { MatchTable } from "@/lib/types";

export const GET: APIRoute = async () => {
  try {
    const { rows: allMatches } = await db.execute(`SELECT * FROM matches;`);

    return new Response(
      JSON.stringify({
        matches: allMatches,
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

    // create the match
    const dataMatch = await request.json();
    // Valid the dataDuo
    const { errorMessage, validated } = await validateMatchData(dataMatch);
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

    const { duo1_id, duo2_id, points_d1, points_d2, phase_id } = dataMatch;

    // create the new duo
    try {
      await db.execute({
        sql: "INSERT INTO matches (duo1_id, duo2_id, points_d1, points_d2, phase_id) VALUES (?, ?, ?, ?, ?)",
        args: [duo1_id, duo2_id, points_d1 ?? 0, points_d2 ?? 0, phase_id],
      });
      return new Response(
        JSON.stringify({
          message: "Match creado exiosamente",
        }),
        {
          status: 201,
        }
      );
    } catch (error: any) {
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
  const { id: idMatchToUpdate, data: dataToUpdate } = await request.json();

  // Valid the match
  const { errorMessage, validated } = await validateMatchData(dataToUpdate);
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

  // update the match
  try {
    await db.execute({
      sql: "UPDATE matches SET points_d1 = ?, points_d2 = ? WHERE id = ?",
      args: [dataToUpdate.points_d1, dataToUpdate.points_d2, idMatchToUpdate],
    });
    return new Response(
      JSON.stringify({
        message: "Match actualizado exiosamente",
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
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

  const { id: idMatchToDelete } = await request.json();
  // verify the id
  if (!idMatchToDelete) {
    return new Response(
      JSON.stringify({
        error: `Match no encontrado`,
      }),
      {
        status: 404,
      }
    );
  }

  try {
    const response = await db.execute({
      sql: "DELETE FROM matches WHERE id = ?",
      args: [idMatchToDelete],
    });
    // verify the delete action
    if (response.rowsAffected === 0) {
      return new Response(
        JSON.stringify({
          error: `Match no encontrado`,
        }),
        {
          status: 404,
        }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Match eliminada exitosamente",
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

async function validateMatchData(matchData: MatchTable) {
  const { duo1_id, duo2_id, points_d1, points_d2, phase_id } = matchData;
  // Validate duos id and points type
  for (const duo of [duo1_id, duo2_id, Number(points_d1), Number(points_d2)]) {
    if (typeof duo !== "number") {
      return {
        errorMessage: `Error en los datos proporcionados, verificalos`,
        validated: false,
      };
    }
  }

  // Validate if exists the duosIds
  for (const duoId of [duo1_id, duo2_id]) {
    const { rows } = await db.execute({
      sql: "SELECT * FROM duos WHERE id = ?",
      args: [duoId],
    });
    const duoSelected = rows[0];
    if (!duoSelected) {
      return {
        errorMessage: `Error al verificar las parejas o duos, verifica que existan`,
        validated: false,
      };
    }
  }

  // Validate if the phase id exist
  const { rows } = await db.execute({
    sql: "SELECT * FROM phases WHERE id = ?",
    args: [phase_id],
  });
  const phaseSelected = rows[0];
  if (!phaseSelected) {
    return {
      errorMessage: `Error al verificar la fase, verifica que exista`,
      validated: false,
    };
  }
  console.log("validated");

  // Pass validation
  return {
    errorMessage: null,
    validated: true,
  };
}
