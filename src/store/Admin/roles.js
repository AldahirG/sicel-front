import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useRolesStore = defineStore('roles', {
    state: () => ({
        roles: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/roles');
                this.roles = response.data.data;
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        },
    },
})