import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import type { MatchTable } from "@/lib/types";

export const GET: APIRoute = async () => {
  try {
    const AllMatches = db
      .prepare(
        `
        SELECT * FROM matches;
    `
      )
      .all();

    return new Response(
      JSON.stringify({
        duos: AllMatches,
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
    console.log(dataMatch);
    // Valid the dataDuo
    const { errorMessage, validated } = validateMatchData(dataMatch);
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
      const query = db.prepare(
        "INSERT INTO matches (duo1_id, duo2_id, points_d1, points_d2, phase_id) VALUES (?, ?, ?, ?, ?)"
      );
      query.run(duo1_id, duo2_id, points_d1 ?? 0, points_d2 ?? 0, phase_id);
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

function validateMatchData(matchData: MatchTable) {
  const { duo1_id, duo2_id, points_d1, points_d2, phase_id } = matchData;

  // Validate duos id and points type
  for (const duo of [duo1_id, duo2_id, points_d1, points_d2]) {
    if (typeof duo !== "number") {
      return {
        errorMessage: `Error en los datos proporcionados, verificalos`,
        validated: false,
      };
    }
  }

  // Validate if exists the duosIds
  for (const duoId of [duo1_id, duo2_id]) {
    const duoSelected = db
      .prepare("SELECT * FROM duos WHERE id = ?")
      .get(duoId);
    if (!duoSelected) {
      return {
        errorMessage: `Error al verificar las parejas o duos, verifica que existan`,
        validated: false,
      };
    }
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
  console.log("validated");

  // Pass validation
  return {
    errorMessage: null,
    validated: true,
  };
}
