import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useFollowUpsStore = defineStore('followUps', {
    state: () => ({
        followUps: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/follow-up');
                this.followUps = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los seguimientos:', error);
            }
        },
    },
})