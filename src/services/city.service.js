import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`cities/${id}`)
    },
    create(data) {
        return api.post('/cities', data)
    },
    update(id, data) {
        return api.patch(`/cities/${id}`, data)
    }
}