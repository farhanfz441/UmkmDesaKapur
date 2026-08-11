import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

export default function Hero() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/umkm?search=${encodeURIComponent(search)}`);
  }

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/hero-image.jpg" alt="Desa Kapur" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/70 via-navy/50 to-navy-light/35" />
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-28 pb-20 md:pt-36 md:pb-28 relative w-full text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/10">
          <MapPin size={12} /> Kec. Sungai Raya · Kab. Kubu Raya · Kalbar
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold tracking-tight text-white mb-3 font-display" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}>
          UMKM DIGITAL <span className="text-blue-light">DESA KAPUR</span>
        </h1>
        <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto mb-8" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
          Belanja Produk Lokal, Dukung Ekonomi Warga
        </p>
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-lg mx-auto bg-white rounded-xl p-1.5 shadow-lg">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search size={18} className="text-muted flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari UMKM atau produk..."
              className="w-full py-2 text-sm text-navy-dark placeholder:text-muted focus:outline-none bg-transparent"
            />
          </div>
          <button type="submit" className="bg-navy hover:bg-navy-light text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors cursor-pointer">
            Cari
          </button>
        </form>
      </div>
    </section>
  );
}
