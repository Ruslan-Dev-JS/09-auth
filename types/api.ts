import type { Note } from "@/types/note";

export interface FetchNotesResponse {
  items: Note[];
  totalPages: number;
}

/** Сира відповідь бекенду GET /notes (notes або items) */
export interface NotesApiResponse {
  notes?: Note[];
  items?: Note[];
  totalPages: number;
}
