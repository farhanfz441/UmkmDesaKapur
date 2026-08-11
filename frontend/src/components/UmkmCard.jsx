import React from 'react';
import { getIconComponent } from '../utils/icons';
import { MapPin, Clock, Phone } from 'lucide-react';

export default function UmkmCard({ item, active, onClick }) {
  const Icon = getIconComponent(item.kategori_ikon);
  return (
    <button onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        active ? 'bg-navy/5 border-navy/30' : 'bg-white border-border hover:border-navy/20 hover:bg-surface-hover'
      }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.kategori_warna}15`, color: item.kategori_warna }}>
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-0.5">
            {item.kategori_nama}
            {typeof item.jarak_km === 'number' && <span className="text-navy"> · {item.jarak_km} km</span>}
          </div>
          <div className="font-semibold text-sm text-navy-dark truncate">{item.nama}</div>
          <div className="flex items-start gap-1 text-xs text-muted mt-1">
            <MapPin size={11} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{item.alamat}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
            {item.jam_buka && <span className="flex items-center gap-1"><Clock size={11} /> {item.jam_buka}–{item.jam_tutup}</span>}
            {item.kontak && <span className="flex items-center gap-1"><Phone size={11} /> {item.kontak}</span>}
          </div>
        </div>
      </div>
    </button>
  );
}
