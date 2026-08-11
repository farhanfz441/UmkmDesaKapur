import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Cari UMKM..."
        className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-navy-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-navy-light/20 focus:border-navy-light transition-all duration-200" />
    </div>
  );
}
