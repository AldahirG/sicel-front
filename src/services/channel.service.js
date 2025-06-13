// src/services/channel.service.js
import api from "../lib/axios";

export default {
  getAll(page = 1) {
    try {
      return api.get("/channels", {
        params: {
          paginated: true,
          'per-page': 100,
          page: page,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  getById(id) {
    return api.get(`/channels/${id}`);
  },

  create(data) {
    return api.post("/channels", data);
  },

  update(id, data) {
    return api.patch(`/channels/${id}`, data);
  },

  delete(id) {
    try {
      return api.delete(`/channels/${id}`);
    } catch (error) {
      console.log(error);
    }
  },

  getList() {
    try {
      return api.get("/channels");
    } catch (error) {
      console.log(error);
    }
  }
};
