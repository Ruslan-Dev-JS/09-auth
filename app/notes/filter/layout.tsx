import React from 'react';

export default function FilterLayout({ children, sidebar }: { children: React.ReactNode; sidebar: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <aside style={{ width: 240 }}>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
