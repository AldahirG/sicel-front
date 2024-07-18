import api from "../lib/axios";

export default {
    getAll(page = 1) {
        return api.get('/countries', { 
            params: {
                paginated: true,
                'per-page': 10,
                page: page,
            }
        });
    },
    getById(id) {
        return api.get(`countries/${id}`)
    },
    create(data) {
        return api.post('/countries', data)
    },
    update(id, data) {
        return api.patch(`/countries/${id}`, data)
    },
    delete(id) {
        try {
            return api.delete(`/countries/${id}`);
        } catch (error) {
            console.log(error);
        }
    },
    getList() {
        try {
            return api.get('/countries');
        } catch (error) {
            console.log(error);
        }
    }
}