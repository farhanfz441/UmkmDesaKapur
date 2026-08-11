import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const emptyForm = { nama: '', kategori_id: '', deskripsi: '', alamat: '', latitude: '', longitude: '', kontak: '', jam_buka: '', jam_tutup: '', foto_url: '', status: 'aktif' };

function Field({ label, children }) {
  return <label className="block"><span className="block text-xs font-medium text-secondary mb-1">{label}</span>{children}</label>;
}

export default function UmkmFormModal({ open, onClose, onSubmit, kategoriList, initialData, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  useEffect(() => {
    if (initialData) setForm({
      nama: initialData.nama || '', kategori_id: initialData.kategori_id || '', deskripsi: initialData.deskripsi || '',
      alamat: initialData.alamat || '', latitude: initialData.latitude ?? '', longitude: initialData.longitude ?? '',
      kontak: initialData.kontak || '', jam_buka: initialData.jam_buka || '', jam_tutup: initialData.jam_tutup || '', foto_url: initialData.foto_url || '', status: initialData.status || 'aktif',
    }); else setForm(emptyForm);
    setFormError('');
  }, [initialData, open]);
  if (!open) return null;

  function handleChange(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault(); setFormError('');
    if (!form.nama || !form.kategori_id || !form.alamat || form.latitude === '' || form.longitude === '') { setFormError('Nama, kategori, alamat, latitude, dan longitude wajib diisi.'); return; }
    const result = await onSubmit({ ...form, kategori_id: Number(form.kategori_id), latitude: Number(form.latitude), longitude: Number(form.longitude) });
    if (!result.success) setFormError(result.message || 'Gagal menyimpan data.');
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-border rounded-2xl shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white">
          <h2 className="font-bold text-navy-dark">{initialData ? 'Edit UMKM' : 'Tambah UMKM Baru'}</h2>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-navy rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Nama UMKM *"><input value={form.nama} onChange={(e) => handleChange('nama', e.target.value)} className="input" placeholder="Contoh: Warung Makan Bu Siti" /></Field>
          <Field label="Kategori *"><select value={form.kategori_id} onChange={(e) => handleChange('kategori_id', e.target.value)} className="input"><option value="">Pilih kategori</option>{kategoriList.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}</select></Field>
          <Field label="Deskripsi"><textarea value={form.deskripsi} onChange={(e) => handleChange('deskripsi', e.target.value)} className="input min-h-[70px] resize-none" placeholder="Deskripsi singkat usaha..." /></Field>
          <Field label="Alamat *"><input value={form.alamat} onChange={(e) => handleChange('alamat', e.target.value)} className="input" placeholder="Jl. ..., Desa Kapur, Kec. Sungai Raya, Kubu Raya" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude *"><input type="number" step="any" value={form.latitude} onChange={(e) => handleChange('latitude', e.target.value)} className="input font-mono" placeholder="-0.0745" /></Field>
            <Field label="Longitude *"><input type="number" step="any" value={form.longitude} onChange={(e) => handleChange('longitude', e.target.value)} className="input font-mono" placeholder="109.3855" /></Field>
          </div>
          <p className="text-[11px] text-muted -mt-2 font-mono">Tip: klik kanan lokasi di Google Maps untuk menyalin koordinat.</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jam Buka"><input type="time" value={form.jam_buka} onChange={(e) => handleChange('jam_buka', e.target.value)} className="input font-mono" /></Field>
            <Field label="Jam Tutup"><input type="time" value={form.jam_tutup} onChange={(e) => handleChange('jam_tutup', e.target.value)} className="input font-mono" /></Field>
          </div>
          <Field label="Kontak"><input value={form.kontak} onChange={(e) => handleChange('kontak', e.target.value)} className="input font-mono" placeholder="0812-xxxx-xxxx" /></Field>
          <Field label="URL Gambar"><input value={form.foto_url} onChange={(e) => handleChange('foto_url', e.target.value)} className="input text-xs" placeholder="https://maps.google.com/... atau URL foto lainnya" /></Field>
          <Field label="Status"><select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="input"><option value="aktif">Aktif</option><option value="tutup_sementara">Tutup Sementara</option><option value="tutup_permanen">Tutup Permanen</option></select></Field>
          {formError && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{formError}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">Batal</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
