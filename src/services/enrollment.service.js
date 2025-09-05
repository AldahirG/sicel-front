import api from "../lib/axios";

export default {
  // Admin Endpoints
  getAll(page = 1) {
    return api.get('/enrollments', {
      params: {
        paginated: true,
        'per-page': 5000,
        page,
      },
    });
  },

  getById(id) {
    return api.get(`/enrollments/${id}`);
  },

  create(data) {
    return api.post('/enrollments', data);
  },

  update(id, data) {
    return api.patch(`/enrollments/${id}`, data);
  },

  delete(id) {
    return api.delete(`/enrollments/${id}`);
  },

  getByLeadId(leadId) {
    return api.get(`/enrollments`, {
      params: { leadId }
    });
  },

  // User (Promotor) Endpoints
  getByUser(page = 1) {
    return api.get('/enrollments/user/list', {
      params: {
        paginated: true,
        'per-page': 5000,
        page,
      },
    });
  },

  getOneByUser(id) {
    return api.get(`/enrollments/user/${id}`);
  },

  downloadExcelByList(listId) {
  return api.get(`/enrollments/export-excel/list/${listId}`, { responseType: 'blob' });
}

};