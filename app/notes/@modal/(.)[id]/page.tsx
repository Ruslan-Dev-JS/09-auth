import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreview from "../../[id]/NotePreview.client";

export const dynamic = "force-dynamic";

export default async function NoteModalPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview />
    </HydrationBoundary>
  );
}

