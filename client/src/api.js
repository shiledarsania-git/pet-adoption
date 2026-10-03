// This file is the ONLY place that talks to our backend. Components just call these small functions.
// Base address of the API. import.meta.env reads the VITE_API_URL from .env; otherwise use localhost.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic helper used by every call below, so we do not repeat the same code.
async function request(path, options = {}) {
  // fetch() sends an HTTP request. We merge JSON headers with any extra options (method, body).
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  // Read the JSON reply (our server always answers with JSON).
  const data = await res.json();
  // res.ok is false for 400/404/500 codes. Throw so the calling component can show the message.
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// Each function below = one backend endpoint.
// URLSearchParams turns {species:"Dog"} into "species=Dog" for the URL query string.
export const fetchPets = (filters = {}) => {
  // Remove empty filters so we do not send "species=&location=".
  const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
  return request(`/pets?${new URLSearchParams(clean)}`);
};
export const fetchPet = (id) => request(`/pets/${id}`);
// JSON.stringify converts a JavaScript object into text that can travel over the network.
export const createPet = (pet) => request("/pets", { method: "POST", body: JSON.stringify(pet) });
export const deletePet = (id) => request(`/pets/${id}`, { method: "DELETE" });
export const submitRequest = (data) => request("/requests", { method: "POST", body: JSON.stringify(data) });
export const fetchRequests = () => request("/requests");
export const setRequestStatus = (id, status) =>
  request(`/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
