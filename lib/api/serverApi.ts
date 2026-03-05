import type { Note } from "@/types/note";
import type { FetchNotesResponse } from "@/types/api";
import type { User } from "@/types/user";
import { api } from "./api";
import type { AxiosResponse } from "axios";

type AuthPayload = {
  email: string;
  password: string;
};

function withCookies(cookies: string | undefined) {
  return cookies ? { headers: { Cookie: cookies } } : {};
}

export async function fetchNotes(
  cookiesHeader: string | undefined,
  page: number = 1,
  search: string = "",
  tag?: string,
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    ...withCookies(cookiesHeader),
  });
  return data;
}

export async function fetchNoteById(
  cookiesHeader: string | undefined,
  id: string,
): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, withCookies(cookiesHeader));
  return data;
}

export async function getMe(
  cookiesHeader: string | undefined,
): Promise<User> {
  const { data } = await api.get<User>("/users/me", withCookies(cookiesHeader));
  return data;
}

export async function checkSession(
  cookiesHeader: string | undefined,
): Promise<AxiosResponse<User | null>> {
  const res = await api.get<User | null>(
    "/auth/session",
    withCookies(cookiesHeader),
  );
  return res;
}

