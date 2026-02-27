import Link from "next/link";
import type { Note } from "@/types/note";

interface NoteItemProps {
  note: Note;
}

function NoteItem({ note }: NoteItemProps) {  
  return (
    <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
      <Link href={`/notes/${note.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{note.title}</h3>
        <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
          {note.content?.substring(0, 100)}...
        </p>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ 
            padding: "4px 8px", 
            backgroundColor: "#e7f1ff", 
            borderRadius: "4px",
            fontSize: "12px"
          }}>
            {note.tag}
          </span>
          <span style={{ fontSize: "12px", color: "#999" }}>
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default NoteItem;