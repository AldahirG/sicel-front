import api from "../lib/axios";

export default {
  getAll(page = 1) {
    return api.get('/cities', {
      params: {
        paginated: true,
        'per-page': 100,
        page: page,
      },
    });
  },

  getList() {
    return api.get('/cities');
  },

  getById(id) {
    return api.get(`/cities/${id}`);
  },

  getByState(stateId) {
    return api.get(`/cities/by-state/${stateId}`);
  },

  create(data) {
    return api.post('/cities', data);
  },

  update(id, data) {
    return api.patch(`/cities/${id}`, data);
  },

  delete(id) {
    return api.delete(`/cities/${id}`);
  },
};
