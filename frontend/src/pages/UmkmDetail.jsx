import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Clock, Phone, Star, MessageCircle, Navigation, Share2, Store, ArrowLeft } from 'lucide-react';
import { umkmService } from '../services/umkmService';
import { getIconComponent } from '../utils/icons';
import { getMapTileUrl } from '../utils/mapTile';
import LandingHeader from '../components/landing/LandingHeader';
import Footer from '../components/landing/Footer';

export default function UmkmDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    umkmService.getById(id).then((res) => setItem(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="pt-20 flex items-center justify-center h-64">
          <p className="text-muted text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="pt-20 flex flex-col items-center justify-center h-64 gap-3">
          <Store size={40} className="text-muted" />
          <p className="text-muted text-sm">UMKM tidak ditemukan.</p>
          <Link to="/umkm" className="btn-primary text-sm">Kembali ke Daftar</Link>
        </div>
      </div>
    );
  }

  const Icon = getIconComponent(item.kategori_ikon);
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;
  const waUrl = item.kontak ? `https://wa.me/${item.kontak.replace(/[^0-9]/g, '')}` : '#';

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <div className="pt-20">
        <div className="bg-white border-b border-border">
          <div className="max-w-6xl mx-auto px-5 py-4">
            <div className="flex items-center gap-2 text-xs text-muted mb-1">
              <Link to="/" className="hover:text-navy transition-colors">Beranda</Link>
              <ChevronRight size={12} />
              <Link to="/umkm" className="hover:text-navy transition-colors">Daftar UMKM</Link>
              <ChevronRight size={12} />
              <span className="text-secondary font-medium">{item.nama}</span>
            </div>
            <Link to="/umkm" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-navy transition-colors">
              <ArrowLeft size={14} /> Kembali
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card overflow-hidden relative">
                <img
                  src={item.foto_url || getMapTileUrl(item.latitude, item.longitude, 15)}
                  alt={item.nama}
                  className="w-full h-72 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-navy/80 backdrop-blur-sm border-2 border-white shadow-card flex items-center justify-center">
                    <MapPin size={18} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-navy-dark mb-3">Tentang Usaha</h3>
                <p className="text-sm text-secondary leading-relaxed">{item.deskripsi || 'Belum ada deskripsi untuk usaha ini.'}</p>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-navy-dark mb-3">Lokasi</h3>
                <div className="rounded-xl overflow-hidden border border-border h-48 bg-surface-hover">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15967!2d${item.longitude}!3d${item.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sid!2sid!4v1`}
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Lokasi UMKM"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.kategori_warna}15` }}>
                    <Icon size={22} style={{ color: item.kategori_warna }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{item.kategori_nama}</p>
                    <h2 className="font-bold text-lg text-navy-dark font-display">{item.nama}</h2>
                  </div>
                </div>

                {item.status === 'aktif' && <span className="badge-green mb-4 inline-flex">Buka</span>}

                <div className="space-y-3 text-sm mt-4">
                  {item.jam_buka && (
                    <div className="flex items-center gap-3 text-secondary">
                      <Clock size={16} className="text-muted flex-shrink-0" />
                      <span>{item.jam_buka} – {item.jam_tutup}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-secondary">
                    <MapPin size={16} className="text-muted mt-0.5 flex-shrink-0" />
                    <span>{item.alamat}</span>
                  </div>
                  {item.kontak && (
                    <div className="flex items-center gap-3 text-secondary">
                      <Phone size={16} className="text-muted flex-shrink-0" />
                      <span>{item.kontak}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green hover:bg-green-dark text-white font-medium rounded-lg px-5 py-3 text-sm transition-all cursor-pointer">
                    <MessageCircle size={18} /> Chat WhatsApp
                  </a>
                  <a href={gmapsUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-outline justify-center py-3">
                    <Navigation size={16} /> Lihat Lokasi di Maps
                  </a>
                  <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
                    className="btn-secondary justify-center py-3 cursor-pointer">
                    <Share2 size={16} /> Bagikan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
