import api from "../lib/axios";

export default {
    getAll(page = 1) {
        try {
            return api.get('/states', { 
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
    create(data) {
        try {
            return api.post('/states', data)
        } catch (error) {
            console.log(error);
        }
    },
    getById(id) {
        return api.get(`/states/${id}`)
    },
    update(id, data) {
        try {
            return api.patch(`/states/${id}`, data)
        } catch (error) {
            console.log(error);
        }
    },
    delete(id) {
        try {
            return api.delete(`/states/${id}`);
        } catch (error) {
            console.log(error);
        }
    },
    getList() {
        try {
            return api.get('/states');
        } catch (error) {
            console.log(error);
        }
    }
}