import api from "../lib/axios";

export default {
    getAll() {
        return api.get('/follow-up')
    },
    getById(id) {
        return api.get(`/follow-up/${id}`)
    },
    create(data) {
        return api.post('/follow-up', data)
    },
    update(id, data) {
        return api.patch(`/follow-up/${id}`, data)
    }
}