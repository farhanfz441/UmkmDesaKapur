import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { isAuthenticated, username } = useAuth();
  return (
    <footer className="bg-navy-dark text-white/60 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2.5 text-white mb-4">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-display font-bold">UMKM Digital Desa Kapur</span>
          </div>
          <p className="text-white/40 leading-relaxed text-xs">
            Platform direktori & katalog UMKM Desa Kapur, Kecamatan Sungai Raya, Kabupaten Kubu Raya, Kalimantan Barat.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold mb-4 text-sm">Menu</p>
          <ul className="space-y-2.5">
            <li><Link to="/" className="hover:text-white transition-colors text-xs">Beranda</Link></li>
            <li><Link to="/umkm" className="hover:text-white transition-colors text-xs">Daftar UMKM</Link></li>
            <li><Link to="/peta" className="hover:text-white transition-colors text-xs">Peta UMKM</Link></li>
            <li><a href="#berita" className="hover:text-white transition-colors text-xs">Berita</a></li>
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold mb-4 text-sm">Informasi</p>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Program</a></li>
            <li><a href="#syarat" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
            <li><a href="#privasi" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            <li>{isAuthenticated ? (
              <Link to="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-navy text-white flex items-center justify-center text-[7px] font-bold">{username?.charAt(0).toUpperCase() || 'A'}</div>
                Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" className="hover:text-white transition-colors">Login Admin</Link>
            )}</li>
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold mb-4 text-sm">Kontak Kami</p>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2"><MapPin size={13} className="mt-0.5 flex-shrink-0" /> Desa Kapur, Kec. Sungai Raya, Kubu Raya, Kalbar</li>
            <li className="flex items-center gap-2"><Phone size={13} /> (0561) 000-0000</li>
            <li className="flex items-center gap-2"><Mail size={13} /> desakapur@kuburayakab.go.id</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} UMKM Digital Desa Kapur. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
