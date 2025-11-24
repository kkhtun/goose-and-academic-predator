// Lightweight fetch wrapper with JWT + JSON/error handling
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.yourdomain.com";

let token = null;
export function setToken(t) { token = t; }
export function getToken() { return token; }

async function request(path, { method="GET", body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = data?.error || { code: "HTTP_ERROR", message: res.statusText };
    err.status = res.status;
    throw err;
  }
  return data;
}

export const http = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: "POST", body: b }),
};
