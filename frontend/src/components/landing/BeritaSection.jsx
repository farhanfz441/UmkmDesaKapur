import React, { useState } from 'react';
import { Calendar, ArrowRight, Clock, User, X } from 'lucide-react';

const DEFAULT_BERITA = [
  {
    judul: 'Pembukaan Pasar UMKM Desa Kapur',
    gambar: '/berita-pasar.jfif',
    isi: 'Pemerintah Desa Kapur meresmikan pasar UMKM mingguan setiap hari Sabtu di halaman balai desa. Pasar ini menjadi wadah bagi puluhan pelaku usaha lokal untuk memasarkan produknya langsung kepada warga. Kegiatan berlangsung mulai pukul 07.00 hingga 16.00 WIB dan diramaikan oleh aneka kuliner, kerajinan tangan, serta busana khas daerah. Warga yang ingin mendaftar sebagai peserta pasar dapat menghubungi kantor desa atau menghubungi kader UMKM setempat.',
    penulis: 'Admin',
    tanggal: '15 Juli 2026',
  },
  {
    judul: 'Pelatihan Digital Marketing untuk UMKM',
    gambar: '/berita-digital-marketing.jfif',
    isi: 'Sebanyak 30 pelaku UMKM mengikuti pelatihan pemasaran digital yang diadakan oleh Dinas Koperasi dan UMKM Kabupaten Kubu Raya. Materi pelatihan meliputi pengenalan media sosial, pembuatan konten produk, hingga strategi menjual di platform e-commerce. Para peserta sangat antusias dan berharap pelatihan serupa dapat diadakan rutin setiap bulan. Kegiatan ini merupakan bagian dari program penguatan ekonomi desa yang didukung penuh oleh Pemerintah Desa Kapur.',
    penulis: 'Admin',
    tanggal: '28 Juni 2026',
  },
  {
    judul: 'UMKM Desa Kapur Tembus Pasar Online',
    gambar: '/berita-pasar-online.jfif',
    isi: 'Platform digital UMKM Desa Kapur resmi diluncurkan untuk memudahkan warga berbelanja produk lokal. Melalui situs ini, pengunjung dapat melihat daftar UMKM, lokasi toko pada peta, hingga informasi kontak masing-masing pelaku usaha. Diharapkan dengan hadirnya platform ini, produk khas Desa Kapur semakin dikenal luas dan dapat meningkatkan perekonomian warga.',
    penulis: 'Admin',
    tanggal: '10 Juni 2026',
  },
];

function loadBerita() {
  try {
    const saved = JSON.parse(localStorage.getItem('admin_berita') || '[]');
    return saved.length > 0 ? saved : DEFAULT_BERITA;
  } catch {
    return DEFAULT_BERITA;
  }
}

export default function BeritaSection() {
  const [berita] = useState(loadBerita);
  const [open, setOpen] = useState(null);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-navy mb-2">Berita Terbaru</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark font-display tracking-tight">
              Informasi & Kegiatan Desa
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {berita.map((item) => (
            <div key={item.judul} className="card-hover overflow-hidden group">
              <div className="h-44 rounded-t-card overflow-hidden bg-surface-hover relative">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="p-5">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted mb-2">
                  <Calendar size={12} /> {item.tanggal}
                </span>
                <h3 className="font-semibold text-navy-dark mb-1.5 leading-snug">{item.judul}</h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{item.isi}</p>
                <button
                  onClick={() => setOpen(item)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-navy mt-3 group-hover:gap-2 transition-all cursor-pointer"
                >
                  Baca Selengkapnya <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-border rounded-2xl shadow-modal max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-navy-dark font-display leading-snug">{open.judul}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} /> {open.tanggal}</span>
                  <span className="inline-flex items-center gap-1"><User size={12} /> {open.penulis || 'Admin'}</span>
                </div>
              </div>
              <button onClick={() => setOpen(null)} className="p-1.5 text-muted hover:text-navy rounded-lg hover:bg-surface-hover cursor-pointer" aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {open.gambar && (
                <div className="h-52 rounded-card-lg overflow-hidden mb-4 bg-surface-hover">
                  <img src={open.gambar} alt={open.judul} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">{open.isi}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
