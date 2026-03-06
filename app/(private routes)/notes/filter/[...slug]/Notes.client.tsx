"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

interface Props {
  initialTag?: string;
}

export default function NotesClient({ initialTag }: Props) {
  const params = useParams();
  const slug = params?.slug;
  const tagFromRoute = Array.isArray(slug) ? slug[0] : undefined;
  const tag = initialTag ?? tagFromRoute ?? "";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (page !== 1) setPage(1);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag || ""],
    queryFn: () => fetchNotes(page, debouncedSearch, tag || undefined),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link href="/notes/action/create">Create note +</Link>
      </div>
      <SearchBox value={search} onChange={handleSearchChange} />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>
          Error: {error instanceof Error ? error.message : "Failed to load notes"}
        </p>
      ) : data && data.items.length > 0 ? (
        <>
          <NoteList notes={data.items} />
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}

