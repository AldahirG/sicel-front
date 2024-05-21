import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useGradesStore = defineStore('grades', {
    state: () => ({
        grades: [],
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/grades');
                this.grades = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los grados:', error);
            }
        },
    },
})