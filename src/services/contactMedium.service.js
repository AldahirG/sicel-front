import api from "../lib/axios";

export default {
    getById(id) {
        return api.get(`contact-types/${id}`)
    },
    create(data) {
        return api.post('/contact-types', data)
    },
    update(id, data) {
        return api.patch(`/contact-types/${id}`, data)
    }
}