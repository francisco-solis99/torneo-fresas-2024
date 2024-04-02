const API_URL = "/api/groups";
import type { GroupTable } from "@/lib/types";

export const getGroups = () => {
  return fetch(API_URL)
    .then((response) => response.json())
    .then((data) => data)
    .catch(() => null);
};
