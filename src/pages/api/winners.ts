import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import type { WinnerTable } from "@/lib/types";

export const GET: APIRoute = async () => {
  try {
    const { rows: allWinners } = await db.execute(
      `
        SELECT * FROM winners;
    `
    );

    return new Response(
      JSON.stringify({
        matches: allWinners,
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
    const dataWinner = await request.json();
    // Valid the dataDuo
    const { errorMessage, validated } = await validateWinnerData(dataWinner);
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

    const { duo_id, match_id, phase_id } = dataWinner;

    // create the new winner
    try {
      await db.execute({
        sql: "INSERT INTO winners (duo_id, match_id, phase_id) VALUES (?, ?, ?)",
        args: [duo_id, match_id, phase_id],
      });
      return new Response(
        JSON.stringify({
          message: "Winner creado exiosamente",
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
  const { id: idMatch, data: dataToUpdate } = await request.json();

  console.log(idMatch, dataToUpdate);
  // Valid the match
  const { errorMessage, validated } = await validateWinnerData(dataToUpdate);
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

  // update the winner
  try {
    await db.execute({
      sql: "UPDATE winners SET phase_id = ?, duo_id = ? WHERE match_id = ?",
      args: [dataToUpdate.phase_id, dataToUpdate.duo_id, idMatch],
    });
    return new Response(
      JSON.stringify({
        message: "Winner actualizado exiosamente",
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

async function validateWinnerData(winnerData: WinnerTable) {
  const { duo_id, match_id, phase_id } = winnerData;
  // Validate types
  for (const item of [Number(duo_id), match_id, phase_id]) {
    if (typeof item !== "number") {
      return {
        errorMessage: `Error en los datos proporcionados, verificalos`,
        validated: false,
      };
    }
  }

  // Validate if exists the matchId
  const { rows: rowsMatches } = await db.execute({
    sql: "SELECT * FROM matches WHERE id = ?",
    args: [match_id],
  });
  const matchSelected = rowsMatches[0];
  if (!matchSelected) {
    return {
      errorMessage: `Error al verificar la fase, verifica que exista`,
      validated: false,
    };
  }

  // Validate if the phase id exist
  const { rows: rowsPhases } = await db.execute({
    sql: "SELECT * FROM phases WHERE id = ?",
    args: [phase_id],
  });
  const phaseSelected = rowsPhases[0];
  if (!phaseSelected) {
    return {
      errorMessage: `Error al verificar la fase, verifica que exista`,
      validated: false,
    };
  }
  console.log("validated winner");

  // Pass validation
  return {
    errorMessage: null,
    validated: true,
  };
}
