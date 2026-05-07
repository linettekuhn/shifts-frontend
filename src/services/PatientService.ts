import type { BackendError } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAll() {
  // call getAllPatients endpoint
  const response = await fetch(`${BASE_URL}/patient`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // parse response
  const result = await response.json();

  if (!response.ok) {
    throw result as BackendError;
  }
  return result;
}

export async function create(name: string) {
  // call createPatient endpoint
  const response = await fetch(`${BASE_URL}/patient`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as BackendError;
  }

  return result;
}

export async function remove(id: number) {
  // call removePatient endpoint
  const response = await fetch(`${BASE_URL}/patient/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as BackendError;
  }

  return result;
}
