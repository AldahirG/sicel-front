import api from "../lib/axios";

export default {
  create(data) {
    return api.post("/payments", data);
  },

  getAll(page = 1) {
    return api.get("/payments", {
      params: {
        paginated: true,
        "per-page": 10000,
        page,
      },
    });
  },

  getById(id) {
    return api.get(`/payments/${id}`);
  },

  update(id, data) {
    return api.patch(`/payments/${id}`, data);
  },

  delete(id) {
    return api.delete(`/payments/${id}`);
  },


  getByEnrollmentId(enrollmentId) {
    return api.get("/payments", {
      params: {
        paginated: false,
        enrollmentId
      }
    });
  },


  getDetailsByEnrollmentId(enrollmentId) {
    return api.get(`/payments/${enrollmentId}/details`);
  }

  
};
