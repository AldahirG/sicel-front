import api from "../lib/axios";

export default {
    getAll() {
        return api.get('/aset-name')
    },
    getById(id) {
        return api.get(`/aset-name/${id}`)
    },
    create(data) {
        return api.post('/aset-name', data)
    },
    update(id, data) {
        return api.patch(`/aset-name/${id}`, data)
    }
}