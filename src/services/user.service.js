import api from "../lib/axios";

export default {
    getAll(page = 1) {
        try {
            return api.get('/users', { 
                params: {
                    paginated: true,
                    'per-page': 10,
                    page: page,
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
    getById(id) {
        return api.get(`users/${id}`)
    },
    create(data) {
        return api.post('/users', data)
    },
    update(id, data) {
        return api.patch(`/users/${id}`, data)
    },
}