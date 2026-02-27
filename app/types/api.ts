import type { Note } from "./note";

export interface FetchNotesResponse {
  items: Note[];       // ✅ обов'язково items
  totalPages: number;
}