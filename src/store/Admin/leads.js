import { defineStore } from "pinia";
import api from "../../lib/axios";

export const useLeadsStore = defineStore('leads', {
    state: () => ({
        leads: [],
        selectedLeadIds: [],
        allLeadsSelected: false,
    }),
    getters: {},
    actions: {
        async getAll() {
            try {
                const response = await api.get('/leads');
                this.leads = response.data.data;
            } catch (error) {
                console.error('Hubo un error al obtener los datos de todos los leads:', error);
            }
        },
        selectAllLeads(selectAll) {
            this.leads.forEach((lead) => {
                lead.selected = selectAll;
            });
            this.allLeadsSelected = selectAll;
            this.updateSelectedLeadIds();
        },
        updateSelectedLeadIds() {
            this.selectedLeadIds = this.leads
                .filter((lead) => lead.selected)
                .map((lead) => lead.id);

            console.log(this.selectedLeadIds);
        },
    },
})