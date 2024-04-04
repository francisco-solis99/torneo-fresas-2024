const API_URL = "/api/winners";
import type { WinnerTable } from "@/lib/types";

export const getWinners = () => {
  return fetch(API_URL)
    .then((response) => response.json())
    .then((data) => data)
    .catch(() => null);
};

export const createWinner = async (winnerData: WinnerTable) => {
  const registerWinnerData = JSON.stringify(winnerData);
  const sessionId = window.localStorage.getItem("TF2024");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
    body: registerWinnerData,
  });
  return response;
};

export const updateWinnerByMatchId = async ({
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
