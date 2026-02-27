// app/notes/filter/@sidebar/default.tsx
import React from 'react';
import Link from 'next/link';
import css from './Sidebar.module.css';

const TAGS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const SidebarNotes = () => (
  <ul className={css.menuList}>
    <li className={css.menuItem}>
      <Link href="/notes/filter/all" className={css.menuLink}>All notes</Link>
    </li>
    {TAGS.map(tag => (
      <li key={tag} className={css.menuItem}>
        <Link href={`/notes/filter/${tag}`} className={css.menuLink}>{tag}</Link>
      </li>
    ))}
  </ul>
);

export default SidebarNotes;
