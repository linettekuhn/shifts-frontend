import type { BackendError, CreateShiftInput } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAll() {
  // call getAllShifts endpoint
  const response = await fetch(`${BASE_URL}/shift`, {
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

export async function create(input: CreateShiftInput) {
  // call createShift endpoint
  const response = await fetch(`${BASE_URL}/shift`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as BackendError;
  }

  return result;
}

export async function remove(id: number) {
  // call removeShift endpoint
  const response = await fetch(`${BASE_URL}/shift/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as BackendError;
  }

  return result;
}
