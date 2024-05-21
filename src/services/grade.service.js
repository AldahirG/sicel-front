import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`grades/${id}`)
    },
    create(data) {
        return api.post('/grades', data)
    },
    update(id, data) {
        return api.patch(`/grades/${id}`, data)
    }
}