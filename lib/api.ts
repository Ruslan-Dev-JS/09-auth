import axios from "axios";
import type { Note } from "@/types/note";
import type { FetchNotesResponse, NotesApiResponse } from "@/types/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
	baseURL: "https://notehub-public.goit.study/api",
	headers: { Authorization: `Bearer ${token || ""}` },
});

export const fetchNotes = async (
	page: number = 1,
	search: string = "",
	tag?: string
): Promise<FetchNotesResponse> => {
	const params: Record<string, string | number> = { page };
	if (search) params.search = search;
	if (tag && tag !== "all") params.tag = tag;
	const { data } = await instance.get<NotesApiResponse>("/notes", { params });
	const items = data.notes ?? data.items ?? [];
	const totalPages = data.totalPages ?? 1;
	return {
		items,
		totalPages,
	};
};

export const fetchNoteById = async (id: string): Promise<Note> => {
	const { data } = await instance.get<Note>(`/notes/${id}`);
	return data;
};

export const createNote = async (
	payload: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
	const { data } = await instance.post<Note>("/notes", payload);
	return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
	const { data } = await instance.delete<Note>(`/notes/${id}`);
	return data;
};

