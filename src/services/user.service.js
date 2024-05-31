import api from "../lib/axios";

export default {
    getAll(params) {
        return api.get('/users', { params });
    },
    getById(id) {
        return api.get(`users/${id}`)
    },
    create(data) {
        return api.post('/users', data)
    },
    update(id, data) {
        return api.patch(`/users/${id}`, data)
    },
}