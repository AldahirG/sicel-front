import api from "../lib/axios";

export default {
    getAll(params) {
        return api.get('/leads', { params });
    },
    getById(id) {
        return api.get(`/leads/${id}`)
    },
    create(data) {
        return api.post('/leads', data)
    },
    update(id, data) {
        return api.patch(`/leads/${id}`, data)
    },
    upload(data) {
        return api.post('/leads/file-share', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}