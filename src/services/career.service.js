import api from "../lib/axios";

export default {
  getAll(page = 1) {
    return api.get('/careers', {
      params: {
        paginated: true,
        'per-page': 100,
        page: page,
      },
    });
  },

  getById(id) {
    return api.get(`/careers/${id}`);
  },

  create(data) {
    return api.post('/careers', data);
  },

  update(id, data) {
    return api.patch(`/careers/${id}`, data);
  },

  delete(id) {
    return api.delete(`/careers/${id}`);
  }
};
