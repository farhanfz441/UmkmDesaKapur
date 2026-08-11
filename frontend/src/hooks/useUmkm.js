import { useState, useEffect, useCallback, useRef } from 'react';
import { umkmService, kategoriService } from '../services/umkmService';

export function useUmkm() {
  const [umkmList, setUmkmList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ kategori_id: '', search: '' });
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchKategori = useCallback(async () => {
    try {
      const res = await kategoriService.getAll();
      setKategoriList(res.data);
    } catch (err) {
      console.error('Gagal memuat kategori:', err);
    }
  }, []);

  const fetchUmkm = useCallback(async (customFilters) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = customFilters || filtersRef.current;
      const cleaned = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v !== '' && v != null)
      );
      const res = await umkmService.getAll(cleaned);
      setUmkmList(res.data);
    } catch (err) {
      setError('Gagal memuat data UMKM. Pastikan server backend aktif.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  useEffect(() => {
    fetchUmkm();
  }, [filters, fetchUmkm]);

  return {
    umkmList,
    kategoriList,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchUmkm,
  };
}
