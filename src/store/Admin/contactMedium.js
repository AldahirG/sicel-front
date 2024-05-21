import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useContactMediumsStore = defineStore('contactMediums', {
    state: () => ({
        contactMediums: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/contact-types');
                this.contactMediums = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los medios de contacto:', error);
            }
        },
    },
})