"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

interface Props {
  initialTag?: string;
}

export default function NotesFilterClient({ initialTag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => setPage(1), [debouncedSearch, initialTag]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch, initialTag || ""],
    queryFn: () => fetchNotes(page, debouncedSearch, initialTag),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div>
      <SearchBox value={search} onChange={setSearch} />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error instanceof Error ? error.message : 'Failed to load notes'}</p>
      ) : (
        <NoteList notes={data?.items || []} />
      )}
      <Pagination pageCount={data?.totalPages || 0} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
