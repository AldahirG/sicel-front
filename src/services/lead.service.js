import api from "../lib/axios";

export default {
    getAll() {
        return api.get('/leads')
    },
    getById(id) {
        return api.get(`/leads/${id}`)
    },
    create(data) {
        return api.post('/leads', data)
    },
    update(id, data) {
        return api.patch(`/leads/${id}`, data)
    }
}