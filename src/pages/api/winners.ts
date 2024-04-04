import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import type { WinnerTable } from "@/lib/types";

export const GET: APIRoute = async () => {
  try {
    const allWinners = db
      .prepare(
        `
        SELECT * FROM winners;
    `
      )
      .all();

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
    const { errorMessage, validated } = validateWinnerData(dataWinner);
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
      const query = db.prepare(
        "INSERT INTO winners (duo_id, match_id, phase_id) VALUES (?, ?, ?)"
      );
      query.run(duo_id, match_id, phase_id);
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
  const { errorMessage, validated } = validateWinnerData(dataToUpdate);
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
    const query = db.prepare(
      `UPDATE winners SET phase_id = ?, duo_id = ? WHERE match_id = ?`
    );
    query.run(dataToUpdate.phase_id, dataToUpdate.duo_id, idMatch);
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

function validateWinnerData(winnerData: WinnerTable) {
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
  const matchSelected = db
    .prepare("SELECT * FROM matches WHERE id = ?")
    .get(match_id);
  if (!matchSelected) {
    return {
      errorMessage: `Error al verificar la fase, verifica que exista`,
      validated: false,
    };
  }

  // Validate if the phase id exist
  const phaseSelected = db
    .prepare("SELECT * FROM phases WHERE id = ?")
    .get(phase_id);
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
