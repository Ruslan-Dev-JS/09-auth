"use client";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      placeholder="Search notes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}