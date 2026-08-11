import React, { useEffect, useState } from 'react';
import { Store, Tag, Package, Users } from 'lucide-react';
import { umkmService, kategoriService } from '../../services/umkmService';

export default function ProgramSection() {
  const [counts, setCounts] = useState({ umkm: null, kategori: null });

  useEffect(() => {
    Promise.all([
      umkmService.getAll().catch(() => ({ count: 0 })),
      kategoriService.getAll().catch(() => ({ count: 0 })),
    ]).then(([u, k]) => setCounts({ umkm: u.count || 0, kategori: k.count || 0 }));
  }, []);

  const stats = [
    { icon: Store, value: `${counts.umkm ?? '—'}+`, label: 'UMKM Terdaftar' },
    { icon: Tag, value: `${counts.kategori ?? '—'}`, label: 'Kategori Usaha' },
    { icon: Package, value: '500+', label: 'Produk Tersedia' },
    { icon: Users, value: '2.450+', label: 'Pengunjung' },
  ];

  return (
    <section className="py-16 md:py-20 bg-navy-dark">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-light mb-3">Tentang Program</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight mb-4">
              Dorong Ekonomi Lokal Bersama UMKM Desa Kapur
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Platform digital ini hadir untuk mempromosikan dan memetakan usaha mikro, kecil, dan menengah
              di Desa Kapur. Temukan produk lokal berkualitas dan dukung pertumbuhan ekonomi warga.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-card-lg p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={20} className="text-blue-light" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
