import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`aset-name/${id}`)
    },
    create(data) {
        return api.post('/aset-name', data)
    },
    update(id, data) {
        return api.patch(`/aset-name/${id}`, data)
    }
}