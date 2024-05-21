import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useCareersStore = defineStore('careers', {
    state: () => ({
        careers: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/careers');
                this.careers = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todas las carreras:', error);
            }
        },
    },
})