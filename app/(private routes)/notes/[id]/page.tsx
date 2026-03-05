import type { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "../../../notes/[id]/NoteDetails.client";

export const dynamic = "force-dynamic";

const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let note: Awaited<ReturnType<typeof fetchNoteById>>;
  try {
    note = await fetchNoteById(id);
  } catch {
    return { title: "Note | NoteHub" };
  }
  const description =
    note.content?.slice(0, 160) || `Note: ${note.title}`;
  return {
    title: `${note.title} | NoteHub`,
    description,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description,
      url: `/notes/${id}`,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "NoteHub" }],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

