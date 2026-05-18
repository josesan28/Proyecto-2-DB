import { authStorage } from "./auth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  return text ? { error: text } : {};
}

async function request(path, options = {}) {
  const token = authStorage.getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await parseResponse(res);

  if (res.status === 401) {
    authStorage.clear();

    if (token) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    throw new Error(data.error || "No autorizado");
  }

  if (!res.ok) throw new Error(data.error || "Error en la solicitud");
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export { AUTH_UNAUTHORIZED_EVENT };
