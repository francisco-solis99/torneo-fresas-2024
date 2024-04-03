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

export const updateMatchById = async ({
  idMatch,
  updateData,
}: {
  idMatch: number;
  updateData: any;
}) => {
  const sessionId = window.localStorage.getItem("TF2024");
  const fetchOpts = {
    method: "PATCH",
    body: JSON.stringify({ id: idMatch, data: updateData }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
  };
  const response = await fetch(API_URL, fetchOpts);
  return response;
};

export const deleteMatchById = async ({ idMatch }: { idMatch: number }) => {
  const sessionId = window.localStorage.getItem("TF2024");
  const fetchOpts = {
    method: "DELETE",
    body: JSON.stringify({ id: idMatch }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
  };
  const response = await fetch(API_URL, fetchOpts);
  return response;
};
