import api from './api';

export const umkmService = {
  getAll(params = {}) {
    return api.get('/umkm', { params }).then((res) => res.data);
  },
  getById(id) {
    return api.get(`/umkm/${id}`).then((res) => res.data);
  },
  create(payload) {
    return api.post('/umkm', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/umkm/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return api.delete(`/umkm/${id}`).then((res) => res.data);
  },
};

export const kategoriService = {
  getAll() {
    return api.get('/kategori').then((res) => res.data);
  },
  create(payload) {
    return api.post('/kategori', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/kategori/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return api.delete(`/kategori/${id}`).then((res) => res.data);
  },
};
