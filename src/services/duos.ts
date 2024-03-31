const API_URL = "/api/duos";

export const getDuos = (params: null | {} = null) => {
  const queryParams =
    params === null
      ? ""
      : `?${Object.entries(params)
          .map((prop) => {
            return prop.join("=");
          })
          .join("&")}`;
  const urlString = `${API_URL}/${queryParams}`;
  return fetch(urlString)
    .then((response) => response.json())
    .then((data) => data)
    .catch(() => null);
};

export const deleteDuoById = async ({ idDuo }: { idDuo: number }) => {
  const sessionId = window.localStorage.getItem("TF2024");
  const fetchOpts = {
    method: "DELETE",
    body: JSON.stringify({ id: idDuo }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
  };
  const response = await fetch(API_URL, fetchOpts);
  return response;
};

export const updateDuoById = async ({
  idDuo,
  updateData,
}: {
  idDuo: number;
  updateData: any;
}) => {
  const sessionId = window.localStorage.getItem("TF2024");
  const fetchOpts = {
    method: "PATCH",
    body: JSON.stringify({ id: idDuo, data: updateData }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionId}`,
    },
  };
  const response = await fetch("/api/duos", fetchOpts);
  return response;
};
