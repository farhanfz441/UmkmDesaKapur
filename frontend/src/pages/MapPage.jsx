import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Navigation, ExternalLink } from 'lucide-react';
import { useUmkm } from '../hooks/useUmkm';
import { getIconComponent } from '../utils/icons';
import { getMapTileUrl } from '../utils/mapTile';
import MapView from '../components/MapView';
import LandingHeader from '../components/landing/LandingHeader';
import Footer from '../components/landing/Footer';

const KATEGORI_TABS = [
  { id: '', label: 'Semua' },
  { id: '1', label: 'Kuliner' },
  { id: '2', label: 'Fashion' },
  { id: '3', label: 'Kerajinan' },
  { id: '4', label: 'Minuman' },
  { id: '5', label: 'Jasa' },
  { id: '6', label: 'Lainnya' },
];

export default function MapPage() {
  const { umkmList, filters, setFilters } = useUmkm();
  const [selected, setSelected] = useState(null);

  const filtered = filters.kategori_id
    ? umkmList.filter((u) => String(u.kategori_id) === filters.kategori_id)
    : umkmList;

  function buildGmapsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
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
              <span className="text-white/80">Peta UMKM</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">Peta UMKM Desa Kapur</h1>
            <p className="text-white/60 text-sm mt-1">Klik penanda untuk melihat detail toko</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 py-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {KATEGORI_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setFilters((f) => ({ ...f, kategori_id: tab.id })); setSelected(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  filters.kategori_id === tab.id
                    ? 'bg-navy text-white'
                    : 'bg-white text-secondary border border-border hover:border-navy/30 hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-card-lg overflow-hidden border border-border shadow-soft h-[500px]">
                <MapView umkmList={filtered} selectedId={selected?.id} onSelect={setSelected} />
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">{filtered.length} UMKM</p>
              </div>
              {filtered.map((item) => {
                const Icon = getIconComponent(item.kategori_ikon);
                const active = selected?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      active ? 'bg-navy/5 border-navy/30' : 'bg-white border-border hover:border-navy/20 hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative" style={{ backgroundColor: `${item.kategori_warna}15` }}>
                        <img
                          src={item.foto_url || getMapTileUrl(item.latitude, item.longitude, 15)}
                          alt={item.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{item.kategori_nama}</p>
                        <p className="font-semibold text-sm text-navy-dark truncate">{item.nama}</p>
                        <p className="text-xs text-muted truncate mt-0.5">{item.alamat}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-muted text-sm">Tidak ada UMKM untuk kategori ini.</div>
              )}
            </div>
          </div>

          {selected && (
            <div className="mt-5 card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden relative" style={{ backgroundColor: `${selected.kategori_warna}15` }}>
                  <img
                    src={selected.foto_url || getMapTileUrl(selected.latitude, selected.longitude, 15)}
                    alt={selected.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-navy-dark text-sm truncate">{selected.nama}</p>
                  <p className="text-xs text-muted truncate">{selected.alamat}</p>
                  <Link to={`/umkm/${selected.id}`} className="text-xs font-medium text-navy hover:underline inline-flex items-center gap-1 mt-0.5">
                    Lihat Detail <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
              <a href={buildGmapsUrl(selected.latitude, selected.longitude)} target="_blank" rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 text-xs">
                <Navigation size={14} /> Buka Maps <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
