import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUmkm } from '../hooks/useUmkm';
import { umkmService, kategoriService } from '../services/umkmService';
import { getIconComponent } from '../utils/icons';
import UmkmFormModal from '../components/UmkmFormModal';
import {
  LayoutDashboard, Store, Package, Tag, FileText, Image, BarChart3, Settings, Shield, LogOut,
  Plus, Pencil, Trash2, ChevronRight, X, Menu, TrendingUp, Search, Save, AlertCircle, ExternalLink,
  Globe, Home, Clock, MapPin, Eye, RefreshCw, Camera, Newspaper
} from 'lucide-react';

const MENU_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'umkm', icon: Store, label: 'Kelola UMKM' },
  { key: 'produk', icon: Package, label: 'Kelola Produk' },
  { key: 'kategori', icon: Tag, label: 'Kelola Kategori' },
  { key: 'berita', icon: FileText, label: 'Kelola Berita' },
  { key: 'galeri', icon: Image, label: 'Kelola Galeri' },
  { key: 'laporan', icon: BarChart3, label: 'Laporan' },
  { key: 'pengaturan', icon: Settings, label: 'Pengaturan' },
  { key: 'admin', icon: Shield, label: 'Admin' },
];

// ---- Dashboard Page ----
function DashboardPage({ umkmList, kategoriList, openCreate }) {
  const aktif = umkmList.filter((u) => u.status === 'aktif').length;
  const tutup = umkmList.length - aktif;
  const perKategori = {};
  umkmList.forEach((u) => { perKategori[u.kategori_nama] = (perKategori[u.kategori_nama] || 0) + 1; });
  const latest = [...umkmList].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Store, label: 'Total UMKM', value: umkmList.length, color: 'text-navy', bg: 'bg-navy/10', desc: 'Terdaftar di sistem' },
          { icon: TrendingUp, label: 'UMKM Aktif', value: aktif, color: 'text-green', bg: 'bg-green/10', desc: 'Sedang beroperasi' },
          { icon: Tag, label: 'Kategori', value: kategoriList.length, color: 'text-purple', bg: 'bg-purple/10', desc: 'Jenis usaha' },
          { icon: BarChart3, label: 'Tidak Aktif', value: tutup, color: 'text-orange', bg: 'bg-orange/10', desc: 'Tutup sementara/permanen' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={20} className={s.color} />
              </div>
              <span className="text-[10px] text-muted">{s.desc}</span>
            </div>
            <p className="text-2xl font-bold text-navy-dark">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy-dark text-sm">UMKM Terbaru</h2>
              <span className="text-[10px] text-muted bg-surface-hover px-2 py-1 rounded-full">{umkmList.length} total</span>
            </div>
            {latest.length === 0 && <p className="text-xs text-muted py-6 text-center">Belum ada UMKM. Tambahkan sekarang!</p>}
            {latest.length > 0 && (
              <div className="space-y-2">
                {latest.map((item) => {
                  const Icon = getIconComponent(item.kategori_ikon);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors">
                      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: `${item.kategori_warna}15` }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon size={14} style={{ color: item.kategori_warna }} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-dark truncate">{item.nama}</p>
                        <p className="text-[10px] text-muted truncate">{item.alamat}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${item.status === 'aktif' ? 'text-green bg-green/10' : 'text-orange bg-orange/10'}`}>
                        {item.status === 'aktif' ? 'Aktif' : 'Tutup'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-navy-dark text-sm mb-4">Sebaran Status UMKM</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-3 bg-surface-hover rounded-full overflow-hidden flex">
                <div className="h-full bg-green transition-all" style={{ width: umkmList.length ? `${(aktif / umkmList.length) * 100}%` : '0%' }} />
                <div className="h-full bg-orange transition-all" style={{ width: umkmList.length ? `${(tutup / umkmList.length) * 100}%` : '0%' }} />
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green" />Aktif {aktif}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange" />Tutup {tutup}</span>
              </div>
            </div>
            <h3 className="text-xs font-medium text-secondary mb-3">Per Kategori</h3>
            <div className="space-y-2">
              {Object.entries(perKategori).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-xs text-secondary w-24">{k}</span>
                  <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-navy/40 transition-all" style={{ width: `${(v / umkmList.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-navy-dark w-6 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold text-navy-dark text-sm mb-4">Aksi Cepat</h2>
            <div className="space-y-2">
              <button onClick={openCreate} className="w-full flex items-center gap-3 p-3 rounded-lg bg-navy/5 hover:bg-navy/10 text-navy text-sm font-medium transition-colors cursor-pointer">
                <Plus size={18} className="text-navy" /> Tambah UMKM Baru
              </button>
              <button onClick={() => document.querySelector('[data-menu="umkm"]')?.click()} className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple/5 hover:bg-purple/10 text-purple text-sm font-medium transition-colors cursor-pointer">
                <Pencil size={18} /> Kelola UMKM
              </button>
              <button onClick={() => document.querySelector('[data-menu="laporan"]')?.click()} className="w-full flex items-center gap-3 p-3 rounded-lg bg-orange/5 hover:bg-orange/10 text-orange text-sm font-medium transition-colors cursor-pointer">
                <BarChart3 size={18} /> Lihat Laporan
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-navy-dark text-sm mb-4">Info Sistem</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between"><span className="text-muted">Versi Aplikasi</span><span className="font-medium text-navy-dark">1.2.0</span></div>
              <div className="flex items-center justify-between"><span className="text-muted">Dashboard</span><span className="font-medium text-navy-dark">Desa Kapur</span></div>
              <div className="flex items-center justify-between"><span className="text-muted">Total Data</span><span className="font-medium text-navy-dark">{umkmList.length} UMKM</span></div>
              <div className="flex items-center justify-between"><span className="text-muted">Kategori</span><span className="font-medium text-navy-dark">{kategoriList.length} jenis</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- UMKM Page ----
const UMKM_PAGE_SIZE = 10;
function UmkmPage({ umkmList, kategoriList, loading, error, refetch, openCreate, openEdit, setDeleteConfirm }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(umkmList.length / UMKM_PAGE_SIZE);
  const paged = umkmList.slice((page - 1) * UMKM_PAGE_SIZE, page * UMKM_PAGE_SIZE);
  if (page > totalPages && totalPages > 0) setPage(totalPages);

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <p className="text-sm font-medium text-navy-dark">{umkmList.length} data UMKM</p>
        <button onClick={openCreate} className="btn-primary text-xs"><Plus size={14} /> Tambah UMKM</button>
      </div>
      {loading && <div className="text-center text-muted py-12 text-sm">Memuat data...</div>}
      {error && <div className="text-center text-red-500 py-12 text-sm">{error}</div>}
      {!loading && !error && umkmList.length === 0 && <div className="text-center text-muted py-12 text-sm">Belum ada data UMKM.</div>}
      {!loading && !error && umkmList.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-hover text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Nama</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Kategori</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => {
                  const Icon = getIconComponent(item.kategori_ikon);
                  return (
                    <tr key={item.id} className="border-t border-border hover:bg-surface-hover/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-navy-dark">{item.nama}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="badge text-[10px]" style={{ backgroundColor: `${item.kategori_warna}15`, color: item.kategori_warna }}>
                          <Icon size={10} /> {item.kategori_nama}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-muted hover:text-navy rounded-lg hover:bg-surface-hover cursor-pointer" title="Edit"><Pencil size={14} /></button>
                          <button onClick={() => setDeleteConfirm(item)} className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer" title="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <span className="text-[10px] text-muted">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border text-secondary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${p === page ? 'bg-navy text-white' : 'text-secondary hover:bg-surface-hover'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border text-secondary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---- Produk Page ----
function ProdukPage({ umkmList }) {
  const [local, setLocal] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_produk') || '{}'); } catch { return {}; }
  });
  const [selectedUmkm, setSelectedUmkm] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaProduk, setHargaProduk] = useState('');
  const [editingKey, setEditingKey] = useState(null);

  function saveLocal(next) { setLocal(next); localStorage.setItem('admin_produk', JSON.stringify(next)); }

  function tambahProduk() {
    if (!selectedUmkm || !namaProduk.trim()) return;
    const next = { ...local };
    if (!next[selectedUmkm]) next[selectedUmkm] = [];
    if (editingKey !== null) { next[selectedUmkm][editingKey] = { nama: namaProduk.trim(), harga: hargaProduk || '-' }; }
    else { next[selectedUmkm].push({ nama: namaProduk.trim(), harga: hargaProduk || '-' }); }
    saveLocal(next); setNamaProduk(''); setHargaProduk(''); setEditingKey(null);
  }

  function editProduk(umkmId, idx) {
    const p = (local[umkmId] || [])[idx];
    setSelectedUmkm(umkmId); setNamaProduk(p.nama); setHargaProduk(p.harga); setEditingKey(idx);
  }

  function hapusProduk(umkmId, idx) {
    const next = { ...local };
    next[umkmId] = next[umkmId].filter((_, i) => i !== idx);
    if (next[umkmId].length === 0) delete next[umkmId];
    saveLocal(next);
  }

  const umkmWithProduk = umkmList.filter((u) => local[u.id] && local[u.id].length > 0);

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <h2 className="font-semibold text-navy-dark text-sm mb-4">Tambah / Edit Produk</h2>
        <div className="grid sm:grid-cols-4 gap-3 mb-3">
          <select value={selectedUmkm} onChange={(e) => setSelectedUmkm(e.target.value)} className="input text-sm">
            <option value="">Pilih UMKM</option>
            {umkmList.map((u) => <option key={u.id} value={u.id}>{u.nama}</option>)}
          </select>
          <input value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} className="input text-sm" placeholder="Nama produk" />
          <input value={hargaProduk} onChange={(e) => setHargaProduk(e.target.value)} className="input text-sm" placeholder="Harga (opsional)" />
          <div className="flex gap-2">
            {editingKey !== null && <button onClick={() => { setEditingKey(null); setNamaProduk(''); setHargaProduk(''); }} className="btn-secondary flex-1 text-xs">Batal</button>}
            <button onClick={tambahProduk} disabled={!selectedUmkm || !namaProduk.trim()} className="btn-primary flex-1 text-xs" style={editingKey !== null ? { backgroundColor: '#F59E0B' } : {}}>
              <Save size={14} /> {editingKey !== null ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
        {!selectedUmkm && <p className="text-[10px] text-muted">Pilih UMKM untuk mulai menambahkan produk.</p>}
      </div>

      {umkmWithProduk.length === 0 && !selectedUmkm && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package size={36} className="text-muted mb-3" />
          <p className="text-sm text-muted">Belum ada produk. Pilih UMKM dan tambahkan produk di atas.</p>
        </div>
      )}

      {umkmWithProduk.map((u) => {
        const produkList = local[u.id] || [];
        return (
          <div key={u.id} className="card p-5">
            <h3 className="font-semibold text-navy-dark text-sm mb-3 flex items-center gap-2">
              <Store size={14} className="text-muted" /> {u.nama}
              <span className="text-[10px] text-muted font-normal">({produkList.length} produk)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[10px] text-muted uppercase tracking-wider"><th className="py-2 pr-4">Produk</th><th className="py-2 pr-4">Harga</th><th className="py-2 text-right">Aksi</th></tr></thead>
                <tbody>
                  {produkList.map((p, idx) => (
                    <tr key={idx} className="border-t border-border text-xs">
                      <td className="py-2 pr-4 font-medium text-navy-dark">{p.nama}</td>
                      <td className="py-2 pr-4 text-secondary">{p.harga && p.harga !== '-' ? `Rp ${Number(p.harga).toLocaleString()}` : '-'}</td>
                      <td className="py-2 text-right">
                        <button onClick={() => editProduk(u.id, idx)} className="p-1 text-muted hover:text-navy cursor-pointer"><Pencil size={12} /></button>
                        <button onClick={() => hapusProduk(u.id, idx)} className="p-1 text-muted hover:text-red-500 cursor-pointer"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Kategori Page ----
function KategoriPage({ kategoriList, refetch }) {
  const [showForm, setShowForm] = useState(false);
  const [editKat, setEditKat] = useState(null);
  const [nama, setNama] = useState('');
  const [ikon, setIkon] = useState('store');
  const [warna, setWarna] = useState('#7c6dff');
  const [error, setError] = useState('');

  function resetForm() { setNama(''); setIkon('store'); setWarna('#7c6dff'); setError(''); setEditKat(null); }
  function openEdit(k) { setEditKat(k); setNama(k.nama); setIkon(k.ikon); setWarna(k.warna); setShowForm(true); }

  async function handleSubmit(e) {
    e.preventDefault(); setError('');
    if (!nama.trim()) { setError('Nama kategori wajib diisi.'); return; }
    try {
      if (editKat) await kategoriService.update(editKat.id, { nama, ikon, warna });
      else await kategoriService.create({ nama, ikon, warna });
      setShowForm(false); resetForm(); await refetch();
    } catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan.'); }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus kategori ini?')) return;
    try { await kategoriService.remove(id); await refetch(); }
    catch (err) { alert(err.response?.data?.message || 'Gagal menghapus.'); }
  }

  const IKON_OPTIONS = [
    { value: 'utensils', label: 'Makanan' }, { value: 'shirt', label: 'Fashion' },
    { value: 'scissors', label: 'Kerajinan' }, { value: 'coffee', label: 'Minuman' },
    { value: 'wrench', label: 'Jasa' }, { value: 'store', label: 'Lainnya' },
    { value: 'printer', label: 'Percetakan' }, { value: 'shopping-basket', label: 'Belanja' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-navy-dark">{kategoriList.length} kategori</p>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs"><Plus size={14} /> Tambah Kategori</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {kategoriList.map((k) => {
          const Icon = getIconComponent(k.ikon);
          return (
            <div key={k.id} className="card-hover p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.warna}15` }}>
                <Icon size={18} style={{ color: k.warna }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy-dark text-sm">{k.nama}</p>
                <p className="text-[10px] text-muted font-mono uppercase">{k.ikon}</p>
              </div>
              <button onClick={() => openEdit(k)} className="p-1.5 text-muted hover:text-navy rounded-lg hover:bg-surface-hover cursor-pointer"><Pencil size={13} /></button>
              <button onClick={() => handleDelete(k.id)} className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"><Trash2 size={13} /></button>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-modal p-6">
            <h3 className="font-bold text-navy-dark mb-4">{editKat ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Nama Kategori</label>
                <input value={nama} onChange={(e) => setNama(e.target.value)} className="input" placeholder="Contoh: Kuliner" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Ikon</label>
                <select value={ikon} onChange={(e) => setIkon(e.target.value)} className="input cursor-pointer">
                  {IKON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Warna</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={warna} onChange={(e) => setWarna(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                  <input value={warna} onChange={(e) => setWarna(e.target.value)} className="input font-mono flex-1" />
                </div>
              </div>
              {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary flex-1 text-sm">Batal</button>
                <button type="submit" className="btn-primary flex-1 text-sm"><Save size={14} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Berita Page ----
function BeritaPage() {
  const [berita, setBerita] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_berita') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [penulis, setPenulis] = useState('Admin');

  function saveLocal(next) { setBerita(next); localStorage.setItem('admin_berita', JSON.stringify(next)); }

  function resetFormBerita() { setJudul(''); setIsi(''); setPenulis('Admin'); setEditIdx(null); }

  function handleSubmitBerita(e) {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;
    const next = [...berita];
    const item = { judul: judul.trim(), isi: isi.trim(), penulis, tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) };
    if (editIdx !== null) next[editIdx] = item; else next.unshift(item);
    saveLocal(next); setShowForm(false); resetFormBerita();
  }

  function editBerita(idx) {
    const b = berita[idx];
    setJudul(b.judul); setIsi(b.isi); setPenulis(b.penulis); setEditIdx(idx); setShowForm(true);
  }

  function hapusBerita(idx) {
    if (!confirm('Hapus berita ini?')) return;
    saveLocal(berita.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-navy-dark">{berita.length} berita</p>
        <button onClick={() => { resetFormBerita(); setShowForm(true); }} className="btn-primary text-xs"><Plus size={14} /> Tambah Berita</button>
      </div>
      {berita.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Newspaper size={36} className="text-muted mb-3" />
          <p className="text-sm text-muted">Belum ada berita. Tambahkan berita atau pengumuman desa.</p>
        </div>
      )}
      <div className="space-y-3">
        {berita.map((b, idx) => (
          <div key={idx} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-navy-dark text-sm">{b.judul}</h3>
                <p className="text-[10px] text-muted mt-0.5">
                  <Clock size={10} className="inline mr-1" />{b.tanggal} &middot; {b.penulis}
                </p>
                <p className="text-xs text-secondary mt-2 line-clamp-2">{b.isi}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => editBerita(idx)} className="p-1.5 text-muted hover:text-navy rounded-lg hover:bg-surface-hover cursor-pointer"><Pencil size={13} /></button>
                <button onClick={() => hapusBerita(idx)} className="p-1.5 text-muted hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-border rounded-2xl shadow-modal p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-navy-dark mb-4">{editIdx !== null ? 'Edit Berita' : 'Tambah Berita'}</h3>
            <form onSubmit={handleSubmitBerita} className="space-y-4">
              <div><label className="block text-xs font-medium text-secondary mb-1">Judul</label><input value={judul} onChange={(e) => setJudul(e.target.value)} className="input" placeholder="Judul berita" /></div>
              <div><label className="block text-xs font-medium text-secondary mb-1">Isi Berita</label><textarea value={isi} onChange={(e) => setIsi(e.target.value)} className="input min-h-[120px] resize-none" placeholder="Tulis berita/pengumuman..." /></div>
              <div><label className="block text-xs font-medium text-secondary mb-1">Penulis</label><input value={penulis} onChange={(e) => setPenulis(e.target.value)} className="input" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); resetFormBerita(); }} className="btn-secondary flex-1 text-sm">Batal</button>
                <button type="submit" className="btn-primary flex-1 text-sm"><Save size={14} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Galeri Page ----
function GaleriPage() {
  const [galeri, setGaleri] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_galeri') || '[]'); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState('');
  const [url, setUrl] = useState('');

  function saveLocal(next) { setGaleri(next); localStorage.setItem('admin_galeri', JSON.stringify(next)); }

  function tambahGambar(e) {
    e.preventDefault();
    if (!url.trim() || !judul.trim()) return;
    saveLocal([{ judul: judul.trim(), url: url.trim(), tanggal: new Date().toLocaleDateString('id-ID') }, ...galeri]);
    setShowForm(false); setJudul(''); setUrl('');
  }

  function hapusGambar(idx) {
    if (!confirm('Hapus gambar ini?')) return;
    saveLocal(galeri.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-navy-dark">{galeri.length} gambar</p>
        <button onClick={() => setShowForm(true)} className="btn-primary text-xs"><Plus size={14} /> Tambah Gambar</button>
      </div>
      {galeri.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Camera size={36} className="text-muted mb-3" />
          <p className="text-sm text-muted">Belum ada galeri. Tambahkan URL gambar dari Google Maps atau sumber lain.</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {galeri.map((g, idx) => (
          <div key={idx} className="card overflow-hidden group relative">
            <div className="aspect-square bg-surface-hover">
              <img src={g.url} alt={g.judul} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium text-navy-dark truncate">{g.judul}</p>
              <p className="text-[10px] text-muted">{g.tanggal}</p>
            </div>
            <button onClick={() => hapusGambar(idx)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X size={14} /></button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-modal p-6">
            <h3 className="font-bold text-navy-dark mb-4">Tambah Gambar</h3>
            <form onSubmit={tambahGambar} className="space-y-4">
              <div><label className="block text-xs font-medium text-secondary mb-1">URL Gambar</label><input value={url} onChange={(e) => setUrl(e.target.value)} className="input" placeholder="https://..." /></div>
              <div><label className="block text-xs font-medium text-secondary mb-1">Judul</label><input value={judul} onChange={(e) => setJudul(e.target.value)} className="input" placeholder="Nama gambar" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setJudul(''); setUrl(''); }} className="btn-secondary flex-1 text-sm">Batal</button>
                <button type="submit" className="btn-primary flex-1 text-sm"><Save size={14} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Laporan Page ----
function LaporanPage({ umkmList, kategoriList }) {
  const aktif = umkmList.filter((u) => u.status === 'aktif').length;
  const tutup = umkmList.length - aktif;
  const perKategori = {};
  umkmList.forEach((u) => { perKategori[u.kategori_nama] = (perKategori[u.kategori_nama] || 0) + 1; });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total UMKM', value: umkmList.length, icon: Store },
          { label: 'UMKM Aktif', value: aktif, icon: TrendingUp },
          { label: 'Kategori', value: kategoriList.length, icon: Tag },
          { label: 'Tidak Aktif', value: tutup, icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <s.icon size={18} className="mx-auto text-muted mb-1" />
            <p className="text-2xl font-bold text-navy-dark">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-navy-dark text-sm mb-4">UMKM per Kategori</h2>
          {Object.entries(perKategori).length === 0 && <p className="text-xs text-muted text-center py-4">Belum ada data.</p>}
          {Object.entries(perKategori).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3 mb-2.5">
              <span className="text-xs text-secondary w-28">{k}</span>
              <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-navy/40 transition-all" style={{ width: `${(v / umkmList.length) * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-navy-dark w-8 text-right">{v}</span>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-navy-dark text-sm mb-4">Status UMKM</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-4 bg-surface-hover rounded-full overflow-hidden flex">
              <div className="h-full bg-green transition-all" style={{ width: umkmList.length ? `${(aktif / umkmList.length) * 100}%` : '0%' }} />
              <div className="h-full bg-orange transition-all" style={{ width: umkmList.length ? `${(tutup / umkmList.length) * 100}%` : '0%' }} />
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green" /><span className="text-secondary">Aktif: <strong className="text-navy-dark">{aktif}</strong></span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange" /><span className="text-secondary">Tutup: <strong className="text-navy-dark">{tutup}</strong></span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Pengaturan Page ----
function PengaturanPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_pengaturan') || '{"namaDesa":"Desa Kapur","kecamatan":"Sungai Raya","kabupaten":"Kubu Raya","provinsi":"Kalimantan Barat"}'); }
    catch { return { namaDesa: 'Desa Kapur', kecamatan: 'Sungai Raya', kabupaten: 'Kubu Raya', provinsi: 'Kalimantan Barat' }; }
  });

  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem('admin_pengaturan', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="card p-6">
        <h2 className="font-semibold text-navy-dark text-sm mb-4">Informasi Desa</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-secondary mb-1">Nama Desa</label><input className="input" value={form.namaDesa} onChange={(e) => setForm({...form, namaDesa: e.target.value})} /></div>
            <div><label className="block text-xs font-medium text-secondary mb-1">Kecamatan</label><input className="input" value={form.kecamatan} onChange={(e) => setForm({...form, kecamatan: e.target.value})} /></div>
            <div><label className="block text-xs font-medium text-secondary mb-1">Kabupaten</label><input className="input" value={form.kabupaten} onChange={(e) => setForm({...form, kabupaten: e.target.value})} /></div>
            <div><label className="block text-xs font-medium text-secondary mb-1">Provinsi</label><input className="input" value={form.provinsi} onChange={(e) => setForm({...form, provinsi: e.target.value})} /></div>
          </div>
          <div><label className="block text-xs font-medium text-secondary mb-1">API URL</label><input className="input font-mono text-xs" defaultValue={import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'} readOnly /></div>
          {saved && <div className="text-xs text-green bg-green/10 border border-green/20 rounded-lg px-3 py-2">Pengaturan berhasil disimpan.</div>}
          <button type="submit" className="btn-primary"><Save size={14} /> Simpan Pengaturan</button>
        </form>
      </div>
    </div>
  );
}

// ---- Admin Page ----
function AdminPage({ username, logout }) {
  return (
    <div className="card p-6 max-w-lg">
      <h2 className="font-semibold text-navy-dark text-sm mb-4">Data Admin</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg">
          <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold">{username?.charAt(0).toUpperCase()}</div>
          <div><p className="font-medium text-navy-dark">{username}</p><p className="text-xs text-muted">Super Admin</p></div>
        </div>
        <div className="text-xs text-muted bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <span>Fitur manajemen multi-admin akan tersedia di versi berikutnya.</span>
        </div>
        <Link to="/" className="flex items-center gap-2 text-xs text-navy hover:text-navy-light transition-colors p-2 rounded-lg hover:bg-surface-hover">
          <Home size={14} /> Kembali ke Beranda
        </Link>
        <button onClick={logout} className="btn-secondary text-sm w-full justify-center"><LogOut size={14} /> Keluar</button>
      </div>
    </div>
  );
}

// ---- Main Dashboard ----
export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const { umkmList, kategoriList, loading, error, refetch } = useUmkm();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function openCreate() { setEditItem(null); setModalOpen(true); }
  function openEdit(item) { setEditItem(item); setModalOpen(true); }

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      if (editItem) await umkmService.update(editItem.id, payload);
      else await umkmService.create(payload);
      setModalOpen(false); await refetch();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menyimpan data.' };
    } finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    try { await umkmService.remove(id); setDeleteConfirm(null); await refetch(); }
    catch (err) { console.error(err); }
  }

  function renderContent() {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage umkmList={umkmList} kategoriList={kategoriList} openCreate={openCreate} />;
      case 'umkm':
        return <UmkmPage umkmList={umkmList} kategoriList={kategoriList} loading={loading} error={error} refetch={refetch} openCreate={openCreate} openEdit={openEdit} setDeleteConfirm={setDeleteConfirm} />;
      case 'produk':
        return <ProdukPage umkmList={umkmList} />;
      case 'kategori':
        return <KategoriPage kategoriList={kategoriList} refetch={refetch} />;
      case 'berita':
        return <BeritaPage />;
      case 'galeri':
        return <GaleriPage />;
      case 'laporan':
        return <LaporanPage umkmList={umkmList} kategoriList={kategoriList} />;
      case 'pengaturan':
        return <PengaturanPage />;
      case 'admin':
        return <AdminPage username={username} logout={logout} />;
      default:
        return <DashboardPage umkmList={umkmList} kategoriList={kategoriList} openCreate={openCreate} />;
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`relative ${sidebarOpen ? 'w-60' : 'w-0 md:w-16'} bg-navy-dark text-white/70 transition-all duration-300 flex-shrink-0 overflow-hidden md:overflow-visible flex flex-col`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {username?.charAt(0).toUpperCase() || 'A'}
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-white truncate">Admin Desa Kapur</p>
              <p className="text-[10px] text-white/40 truncate">{username}</p>
            </div>
          )}
        </div>
        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
          <button onClick={() => setSidebarOpen((v) => !v)}
            className="w-6 h-6 rounded-full bg-white border border-border shadow-soft flex items-center justify-center hover:bg-surface-hover transition-all cursor-pointer text-muted hover:text-navy"
            title={sidebarOpen ? 'Ciutkan' : 'Perluas'}>
            <ChevronRight size={12} className={`transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button key={item.key} data-menu={item.key} onClick={() => { setActiveMenu(item.key); window.innerWidth < 768 && setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${activeMenu === item.key ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Home size={18} />
            {sidebarOpen && <span>Beranda</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen((v) => !v)} className="p-1.5 text-muted hover:text-navy rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
                <Menu size={20} />
              </button>
              <h1 className="font-bold text-navy-dark text-sm">{MENU_ITEMS.find((m) => m.key === activeMenu)?.label || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="hidden sm:flex items-center gap-1.5 text-xs text-muted hover:text-navy transition-colors">
                <Home size={14} /> Kembali ke Beranda
              </Link>
              <span className="text-muted text-xs hidden sm:inline">Halo, {username}</span>
              <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">{username?.charAt(0).toUpperCase() || 'A'}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <UmkmFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} kategoriList={kategoriList} initialData={editItem} submitting={submitting} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-border rounded-2xl shadow-modal p-6">
            <h3 className="font-bold text-navy-dark text-lg mb-2">Hapus UMKM?</h3>
            <p className="text-sm text-muted mb-6">Data <span className="font-medium text-navy-dark">{deleteConfirm.nama}</span> akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 text-sm">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    aktif: { label: 'Aktif', className: 'text-green bg-green/10' },
    tutup_sementara: { label: 'Tutup Sementara', className: 'text-orange bg-orange/10' },
    tutup_permanen: { label: 'Tutup Permanen', className: 'text-red-500 bg-red-50' },
  };
  const cfg = map[status] || map.aktif;
  return <span className={`badge ${cfg.className}`}>{cfg.label}</span>;
}
