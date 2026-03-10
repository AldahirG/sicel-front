import api from "../lib/axios";

export default {
  getAll(page = 1) {
    return api.get('/states', {
      params: {
        paginated: true,
        'per-page': 100,
        page: page,
      },
    });
  },

  getList() {
    return api.get('/states');
  },

  getById(id) {
    return api.get(`/states/${id}`);
  },

  getByCountry(countryId) {
    return api.get(`/states/by-country/${countryId}`);
  },

  create(data) {
    return api.post('/states', data);
  },

  update(id, data) {
    return api.patch(`/states/${id}`, data);
  },

  delete(id) {
    return api.delete(`/states/${id}`);
  },
};
