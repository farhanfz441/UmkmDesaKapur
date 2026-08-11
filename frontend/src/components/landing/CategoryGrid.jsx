import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Shirt, Palette, Coffee, Wrench, Store } from 'lucide-react';

const CATEGORIES = [
  { label: 'Kuliner', icon: UtensilsCrossed, color: '#F59E0B', bg: 'bg-orange/10', path: '/umkm?kategori_id=1' },
  { label: 'Fashion', icon: Shirt, color: '#8B5CF6', bg: 'bg-purple/10', path: '/umkm?kategori_id=2' },
  { label: 'Kerajinan', icon: Palette, color: '#EC4899', bg: 'bg-pink/10', path: '/umkm?kategori_id=3' },
  { label: 'Minuman', icon: Coffee, color: '#10B981', bg: 'bg-green/10', path: '/umkm?kategori_id=4' },
  { label: 'Jasa', icon: Wrench, color: '#0EA5E9', bg: 'bg-blue-light/10', path: '/umkm?kategori_id=5' },
  { label: 'Lainnya', icon: Store, color: '#059669', bg: 'bg-green-dark/10', path: '/umkm?kategori_id=6' },
];

export default function CategoryGrid() {
  return (
    <section className="relative -mt-14 z-10">
      <div className="max-w-6xl mx-auto px-5">
        <div className="bg-white border border-border rounded-card-lg shadow-elevated p-6 md:p-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} to={cat.path} className="flex flex-col items-center gap-2.5 group">
                <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}>
                  <cat.icon size={24} style={{ color: cat.color }} />
                </div>
                <span className="text-xs font-medium text-secondary group-hover:text-navy transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
