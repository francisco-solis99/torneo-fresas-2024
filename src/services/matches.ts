const API_URL = "/api/matches";
import type { MatchTable } from "@/lib/types";

export const getMatches = () => {
  return fetch(API_URL)
    .then((response) => response.json())
    .then((data) => data)
    .catch(() => null);
};

export const createMatch = async (matchData: MatchTable) => {
  const registerMatchData = JSON.stringify(matchData);
  const sessionId = window.localStorage.getItem("TF2024");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    body: registerMatchData,
  });
  return response;
};
