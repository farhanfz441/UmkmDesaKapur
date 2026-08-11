import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function MapSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-navy mb-2">Peta Persebaran</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark font-display tracking-tight">
              Lokasi UMKM Desa Kapur
            </h2>
          </div>
        </div>

        <div className="relative rounded-card-lg overflow-hidden border border-border shadow-soft">
          <div className="w-full h-[400px] bg-surface-hover flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15967.123456789!2d109.3855!3d-0.0745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMDQnMjguMiJTIDEwOcKwMjMnMDcuOCJF!5e0!3m2!1sid!2sid!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta UMKM Desa Kapur"
            />
          </div>
          <Link
            to="/peta"
            className="absolute bottom-4 right-4 bg-white hover:bg-surface-hover text-navy font-medium rounded-lg px-4 py-2.5 text-sm shadow-card border border-border transition-all flex items-center gap-2"
          >
            Lihat Peta Lengkap <ExternalLink size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
