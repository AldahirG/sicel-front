<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useLeadsStore } from "../../../store/Admin/leads";

import CreateButton from "../../../components/CreateButton.vue";
import Checkbox from "../../../components/Checkbox.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useLeadsStore();
const leads = ref([]);

const selectedLeadIds = store.selectedLeadIds;
const selectAllChecked = ref(false);

const selectAllLeads = () => {
    selectAllChecked.value = !selectAllChecked.value;
    store.selectAllLeads(selectAllChecked.value);
};

const updateSelectAll = () => {
    selectAllChecked.value = store.allLeadsSelected;
};

const updateSelectedLeadIds = () => {
    store.updateSelectedLeadIds();
};

onMounted(async () => {
    await store.getAll();
    leads.value = store.leads;
});

watch(() => store.allLeadsSelected, () => {
    selectAllChecked.value = store.allLeadsSelected;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">

        <CreateButton 
            name="createLead" 
            label="lead"
            width="w-32"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>
                        
                    </TableHeaderCell>
                    <TableHeaderCell>Estatus asignación</TableHeaderCell>
                    <TableHeaderCell>Promotor</TableHeaderCell>
                    <TableHeaderCell>Nombre Completo</TableHeaderCell>
                    <TableHeaderCell>Seguimiento</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Teléfono</TableHeaderCell>
                    <TableHeaderCell>Teléfono Secundario</TableHeaderCell>
                    <TableHeaderCell>Correo Electrónico</TableHeaderCell>
                    <TableHeaderCell>Correo Electrónico Secundario</TableHeaderCell>
                    <TableHeaderCell>Carrera de interés</TableHeaderCell>
                    <TableHeaderCell>Grado escolar</TableHeaderCell>
                    <TableHeaderCell>Escuela de procedencia</TableHeaderCell>
                    <TableHeaderCell>Tipo de escuela</TableHeaderCell>
                    <TableHeaderCell>Medio de contacto</TableHeaderCell>
                    <TableHeaderCell>Aset Name</TableHeaderCell>
                    <TableHeaderCell>Campaña</TableHeaderCell>
                    <TableHeaderCell>País</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell>Ciudad</TableHeaderCell>
                    <TableHeaderCell>Ciclo</TableHeaderCell>
                    <TableHeaderCell>Tipo de referido</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="lead in leads" :key="lead.id">
                    <TableDataCell>
                        <Checkbox 
                            v-model="lead.selected" 
                            @change="updateSelectedLeadIds" 
                        />
                    </TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.information.name }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.phones[0] }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.emails[0] }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.grade }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>

                        <router-link 
                            :to="{ path: '/admin/campaigns/' + lead.id + '/edit/' }"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>