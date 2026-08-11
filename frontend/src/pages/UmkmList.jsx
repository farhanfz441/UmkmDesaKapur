import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, MapPin, Clock, Star, ArrowRight, ChevronLeft, Store } from 'lucide-react';
import { useUmkm } from '../hooks/useUmkm';
import { getIconComponent } from '../utils/icons';
import { getMapTileUrl } from '../utils/mapTile';
import LandingHeader from '../components/landing/LandingHeader';
import Footer from '../components/landing/Footer';

const PAGE_SIZE = 8;

export default function UmkmList() {
  const { umkmList, kategoriList, loading, filters, setFilters } = useUmkm();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const kid = searchParams.get('kategori_id') || '';
    setSearchInput(q);
    setFilters({ search: q, kategori_id: kid });
  }, [searchParams]);

  const filtered = umkmList.filter((item) => {
    const matchSearch = !filters.search || item.nama.toLowerCase().includes(filters.search.toLowerCase()) || item.alamat.toLowerCase().includes(filters.search.toLowerCase());
    const matchKategori = !filters.kategori_id || String(item.kategori_id) === filters.kategori_id;
    return matchSearch && matchKategori;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e) {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput }));
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <div className="pt-20">
        <div className="bg-navy-dark text-white">
          <div className="max-w-6xl mx-auto px-5 py-8">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <span className="text-white/80">Daftar UMKM</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">Daftar UMKM Desa Kapur</h1>
            <p className="text-white/60 text-sm mt-1">Temukan dan jelajahi UMKM lokal</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 py-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-lg px-3">
              <Search size={18} className="text-muted flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari UMKM..."
                className="w-full py-2.5 text-sm text-navy-dark placeholder:text-muted focus:outline-none bg-transparent"
              />
            </div>
            <select
              value={filters.kategori_id}
              onChange={(e) => { setFilters((f) => ({ ...f, kategori_id: e.target.value })); setPage(1); }}
              className="bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-navy-light/20 cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            <button type="submit" className="btn-primary">Cari</button>
          </form>

          {loading && <div className="text-center text-muted py-12 text-sm">Memuat data...</div>}

          {!loading && paged.length === 0 && (
            <div className="text-center py-12">
              <Store size={40} className="mx-auto text-muted mb-3" />
              <p className="text-muted text-sm">Tidak ada UMKM ditemukan.</p>
            </div>
          )}

          <div className="space-y-3">
            {paged.map((item) => {
              const Icon = getIconComponent(item.kategori_ikon);
              return (
                <Link key={item.id} to={`/umkm/${item.id}`} className="card-hover p-4 flex items-start gap-4 group">
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-surface-hover relative">
                    <img
                      src={item.foto_url || getMapTileUrl(item.latitude, item.longitude, 15)}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-4 h-4 rounded-full bg-navy/80 border-2 border-white shadow-soft flex items-center justify-center">
                        <MapPin size={8} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{item.kategori_nama}</span>
                      {item.status === 'aktif' && <span className="badge-green text-[10px]">Buka</span>}
                    </div>
                    <h3 className="font-semibold text-navy-dark truncate">{item.nama}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {item.alamat}</span>
                      {item.jam_buka && <span className="flex items-center gap-1"><Clock size={11} /> {item.jam_buka}–{item.jam_tutup}</span>}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <span className="btn-primary text-xs">Lihat Detail <ArrowRight size={12} /></span>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-2 text-xs disabled:opacity-50 cursor-pointer">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === page ? 'bg-navy text-white' : 'bg-white text-secondary border border-border hover:bg-surface-hover'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-3 py-2 text-xs disabled:opacity-50 cursor-pointer">
                <ChevronLeft size={14} className="rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
