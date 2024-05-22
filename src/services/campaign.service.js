import api from "../lib/axios";

export default {
    getAll() {
        return api.get('/campaigns')
    },
    getById(id) {
        return api.get(`/campaigns/${id}`)
    },
    create(data) {
        return api.post('/campaigns', data)
    },
    update(id, data) {
        return api.patch(`/campaigns/${id}`, data)
    }
}