import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useCountriesStore = defineStore('countries', {
    state: () => ({
        countries: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/countries');
                this.countries = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los países:', error);
            }
        },
    },
})