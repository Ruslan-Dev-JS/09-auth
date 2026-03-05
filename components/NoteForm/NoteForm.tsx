"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteStore, initialDraft, type DraftTag } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

const TAGS: DraftTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const formDraft = draft.title || draft.content ? draft : initialDraft;

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim() ?? "";
    const content = (formData.get("content") as string)?.trim() ?? "";
    const tag = (formData.get("tag") as DraftTag) ?? "Todo";
    if (title.length < 3 || title.length > 50) return;
    mutation.mutate({ title, content, tag });
  };

  return (
    <form
      className={css.form}
      onSubmit={handleSubmit}
      onChange={(e) => {
        const target = e.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          const name = target.name as keyof typeof formDraft;
          if (name === "title" || name === "content" || name === "tag") {
            setDraft({ [name]: target.value });
          }
        }
      }}
    >
      <div className={css.formGroup}>
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          name="title"
          type="text"
          className={css.input}
          defaultValue={formDraft.title}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={formDraft.content}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="note-tag">Tag</label>
        <select
          id="note-tag"
          name="tag"
          className={css.select}
          defaultValue={formDraft.tag}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
