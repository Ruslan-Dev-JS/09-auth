import type { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "../../../../notes/filter/[...slug]/Notes.client";

export const dynamic = "force-dynamic";

const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = slug ?? [];
  const tag = slugs[0];
  const filterLabel = tag ? `Filter: ${tag}` : "All notes";
  const description = tag
    ? `Notes filtered by tag "${tag}". View and manage your ${tag} notes in NoteHub.`
    : "Browse all your notes in NoteHub.";
  const path = tag ? `/notes/filter/${tag}` : "/notes";
  return {
    title: `${filterLabel} | NoteHub`,
    description,
    openGraph: {
      title: `${filterLabel} | NoteHub`,
      description,
      url: path,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "NoteHub" }],
    },
  };
}

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params;
  const slugs = slug ?? [];
  const tag = slugs[0];

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", 1, "", tag || ""],
      queryFn: () => fetchNotes(1, "", tag),
    });
  } catch (err) {
    console.error("Prefetch error", err);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? "all"} initialTag={tag} />
    </HydrationBoundary>
  );
}

