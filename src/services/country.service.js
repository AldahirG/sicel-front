import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`countries/${id}`)
    },
    create(data) {
        return api.post('/countries', data)
    },
    update(id, data) {
        return api.patch(`/countries/${id}`, data)
    }
}