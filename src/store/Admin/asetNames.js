import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useAsetNamesStore = defineStore('asetNames', {
    state: () => ({
        asetNames: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/aset-name');
                this.asetNames = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los aset names:', error);
            }
        },
    },
})