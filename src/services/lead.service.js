import api from "../lib/axios";

export default {
    getAll(params) {
        return api.get('/leads', { params });
    },
    getById(id, params) {
        return api.get(`/leads/${id}`, { params })
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
    },
    assignment(leadId, userId) {
        return api.patch(`/leads/${leadId}/assignment/${userId}`);
    },
    reassignment(leadId, userId) {
        return api.patch(`/leads/${leadId}/reassignment/${userId}`);
    },
}