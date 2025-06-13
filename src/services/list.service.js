import api from "../lib/axios";

export default {
    getAll(page = 1) {
        try {
            return api.get('/lists', {
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
        return api.get(`/lists/${id}`);
    },

    create(data) {
        return api.post('/lists', data);
    },

    update(id, data) {
        return api.patch(`/lists/${id}`, data);
    },

    delete(id) {
        try {
            return api.delete(`/lists/${id}`);
        } catch (error) {
            console.log(error);
        }
    },

    getList() {
        try {
            return api.get('/lists');
        } catch (error) {
            console.log(error);
        }
    }
};
