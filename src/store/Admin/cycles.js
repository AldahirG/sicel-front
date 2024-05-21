import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useCyclesStore = defineStore('cycles', {
    state: () => ({
        cycles: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/cycles');
                this.cycles = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los ciclos escolares:', error);
            }
        },
    },
})