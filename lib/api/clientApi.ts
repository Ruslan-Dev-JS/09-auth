import axios from "axios";
import type { Note } from "@/types/note";
import type { FetchNotesResponse } from "@/types/api";
import type { User } from "@/types/user";
import { api } from "./api";

type AuthPayload = {
  email: string;
  password: string;
};

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag?: string,
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(
  payload: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  try {
    const { data } = await api.get<User | null>("/auth/session");
    return data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      (error.response.status === 400 ||
        error.response.status === 401 ||
        error.response.status === 403)
    ) {
      // Not authenticated – treat as anonymous session
      return null;
    }

    throw error;
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

