import api from "../lib/axios";

export default {
    getAll(page = 1) {
        try {
            return api.get('/cities', { 
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
        return api.get(`/cities/${id}`)
    },
    create(data) {
        return api.post('/cities', data)
    },
    update(id, data) {
        return api.patch(`/cities/${id}`, data)
    },
    delete(id) {
        try {
            return api.delete(`/cities/${id}`);
        } catch (error) {
            console.log(error);
        }
    },
    getList() {
        try {
            return api.get('/cities');
        } catch (error) {
            console.log(error);
        }
    }
}