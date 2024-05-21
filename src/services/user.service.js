import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`users/${id}`)
    },
    create(data) {
        return api.post('/users', data)
    },
    update(id, data) {
        return api.patch(`/users/${id}`, data)
    }
}