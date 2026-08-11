import React from 'react';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import UmkmCard from './UmkmCard';
import { Store } from 'lucide-react';

export default function Sidebar({ umkmList, kategoriList, filters, setFilters, selected, onSelect, loading, error }) {
  return (
    <aside className="w-full md:w-[380px] flex-shrink-0 h-full flex flex-col border-r border-border bg-white">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-navy-dark">Peta UMKM Desa Kapur</h1>
            <p className="text-[11px] text-muted">Kec. Sungai Raya · Kab. Kubu Raya</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3 border-b border-border">
        <SearchBar value={filters.search} onChange={(v) => setFilters((f) => ({ ...f, search: v }))} />
        <FilterBar kategoriList={kategoriList} activeKategori={filters.kategori_id} onSelect={(id) => setFilters((f) => ({ ...f, kategori_id: id }))} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {loading && <div className="text-center text-muted text-sm py-8">Memuat data...</div>}
        {error && <div className="text-center text-red-500 text-sm py-8 px-2">{error}</div>}
        {!loading && !error && umkmList.length === 0 && <div className="text-center text-muted text-sm py-8">Tidak ada UMKM yang cocok.</div>}
        {!loading && umkmList.map((item) => (
          <UmkmCard key={item.id} item={item} active={selected?.id === item.id} onClick={() => onSelect(item)} />
        ))}
      </div>
      <div className="px-5 py-3 border-t border-border text-center">
        <span className="text-[11px] font-medium text-muted">{umkmList.length} UMKM terdaftar</span>
      </div>
    </aside>
  );
}
