import api from "../lib/axios";

export default {
    getAll(page = 1) {
        return api.get('/leads', { 
            params: {
                paginated: true,
                'per-page': 10,
                page: page,
            }
        });
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
    multi_select(data){
        try {
            return api.patch('/leads/muti-select/update-promotor', data)
        } catch (error) {
            console.log(error);
        }
    },
    // Leads que le fueron asignados a un promotor
    leads_promoter(id, page = 1) {
        return api.get(`/leads/get-by-user/${id}`, { 
            params: {
                paginated: true,
                'per-page': 10,
                page: page,
            }
        });
    },
}