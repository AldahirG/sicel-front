import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`cycles/${id}`)
    },
    create(data) {
        return api.post('/cycles', data)
    },
    update(id, data) {
        return api.patch(`/cycles/${id}`, data)
    }
}