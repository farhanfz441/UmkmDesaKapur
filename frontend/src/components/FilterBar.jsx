import React from 'react';
import { getIconComponent } from '../utils/icons';

export default function FilterBar({ kategoriList, activeKategori, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onSelect('')}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
          activeKategori === '' ? 'bg-navy text-white border-navy' : 'bg-white text-muted border-border hover:border-navy/30 hover:text-secondary'
        }`}>Semua</button>
      {kategoriList.map((k) => {
        const Icon = getIconComponent(k.ikon);
        const active = String(activeKategori) === String(k.id);
        return (
          <button key={k.id} onClick={() => onSelect(active ? '' : k.id)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
              active ? 'text-white border-transparent' : 'bg-white text-muted border-border hover:border-navy/30 hover:text-secondary'
            }`} style={active ? { backgroundColor: k.warna } : {}}>
            <Icon size={12} /> {k.nama}
          </button>
        );
      })}
    </div>
  );
}
