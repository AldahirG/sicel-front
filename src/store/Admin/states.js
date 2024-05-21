import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useStatesStore = defineStore('states', {
    state: () => ({
        states: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/states');
                this.states = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los estados:', error);
            }
        },
    },
})