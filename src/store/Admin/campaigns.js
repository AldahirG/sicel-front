import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useCampaignsStore = defineStore('campaigns', {
    state: () => ({
        campaigns: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/campaigns');
                this.campaigns = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todas los campañas:', error);
            }
        },
    },
})