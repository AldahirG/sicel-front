import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useCitiesStore = defineStore('cities', {
    state: () => ({
        cities: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/cities');
                this.cities = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todas las ciudades:', error);
            }
        },
    },
})