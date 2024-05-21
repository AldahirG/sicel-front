import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/users');
                this.users = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los usuarios:', error);
            }
        },
    },
})