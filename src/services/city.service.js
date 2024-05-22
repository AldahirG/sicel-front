import api from "../lib/axios";

export default {
    getAll() {
        return api.get('/cities')
    },
    getById(id) {
        return api.get(`/cities/${id}`)
    },
    create(data) {
        return api.post('/cities', data)
    },
    update(id, data) {
        return api.patch(`/cities/${id}`, data)
    }
}