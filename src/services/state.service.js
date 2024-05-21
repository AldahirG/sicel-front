import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`states/${id}`)
    },
    create(data) {
        return api.post('/states', data)
    },
    update(id, data) {
        return api.patch(`/states/${id}`, data)
    }
}