import React from "react";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export default function NotesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <TanStackProvider>
      <div style={{ position: "relative" }}>
        <div>{children}</div>
        <div>{modal}</div>
      </div>
    </TanStackProvider>
  );
}
