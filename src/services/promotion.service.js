import api from "../lib/axios";

export default {
    getAll(page = 1) {
        try {
            return api.get('/promotions', { 
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
        return api.get(`/promotions/${id}`)
    },
    create(data) {
        return api.post('/promotions', data)
    },
    getById(id) {
        return api.get(`/promotions/${id}`)
    },
    update(id, data) {
        return api.patch(`/promotions/${id}`, data)
    },
    delete(id) {
        try {
            return api.delete(`/promotions/${id}`);
        } catch (error) {
            console.log(error);
        }
    },
    getList() {
        try {
            return api.get('/promotions');
        } catch (error) {
            console.log(error);
        }
    }
}