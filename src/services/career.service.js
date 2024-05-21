import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`careers/${id}`)
    },
    create(data) {
        return api.post('/careers', data)
    },
    update(id, data) {
        return api.patch(`/careers/${id}`, data)
    }
}