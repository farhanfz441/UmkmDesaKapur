import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, MapPin as MapIcon } from 'lucide-react';
import { umkmService } from '../../services/umkmService';
import { getIconComponent } from '../../utils/icons';
import { getMapTileUrl } from '../../utils/mapTile';

export default function UmkmTerbaru() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    umkmService.getAll().then((res) => setItems(res.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-navy mb-2">UMKM Terbaru</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark font-display tracking-tight">
              Jelajahi UMKM Lokal
            </h2>
          </div>
          <Link to="/umkm" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-navy-light transition-colors">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const Icon = getIconComponent(item.kategori_ikon);
            return (
              <Link key={item.id} to={`/umkm/${item.id}`} className="card-hover overflow-hidden group">
                <div className="h-40 relative bg-surface-hover">
                  <img
                    src={item.foto_url || getMapTileUrl(item.latitude, item.longitude, 15)}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-navy/80 backdrop-blur-sm border-2 border-white shadow-card flex items-center justify-center">
                      <MapIcon size={12} className="text-white" />
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 badge-green">{item.status === 'aktif' ? 'Buka' : 'Tutup'}</span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{item.kategori_nama}</span>
                  <h3 className="font-semibold text-navy-dark mt-0.5 mb-1.5 truncate">{item.nama}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted mb-3">
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="truncate">{item.alamat}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-navy group-hover:gap-2 transition-all">
                    Lihat Detail <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link to="/umkm" className="btn-primary">
            Lihat Semua UMKM <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
