<script>
import { defineAsyncComponent, onMounted, ref } from "vue";
import lead from '../../../services/lead.service'

import Button from "../../../components/Button.vue";
import Checkbox from "../../../components/Checkbox.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

export default {
    setup() {
        const leads = ref([]);
        const currentPage = ref(1);
        const perPage = ref(10);
        const totalPages = ref(0);

        const goToPage = async (page) => {
            if (page < 1) {
                page = 1;
            }
            await fetchLeads(page);
        }

        const fetchLeads = async (page = 1) => {
            try {
                const params = {
                    paginated: true,
                    page: page,
                    'per-page': perPage.value
                };

                const response = await lead.getAll(params);
                leads.value = response.data.data;
                currentPage.value = response.data.meta.currentPage;
                totalPages.value = response.data.meta.totalPages;
            } catch (error) {
                console.error("Error al obtener los leads:", error);
            }
        }

        onMounted(async () => {
            fetchLeads();
        });
        
        return {
            leads,
            currentPage,
            perPage,
            totalPages,
            fetchLeads,
            goToPage,
        };
    },
    components: {
        Button,
        Checkbox,
        TableRow,
        TableHeaderCell,
        TableDataCell,
        Table,
        Pagination,
    },
};
</script>

<template>
    <section class="flex items-end justify-end mb-6 gap-3">
        <Button 
            name="uploadLead"
            actionLabel="Subir" 
            label="CSV"
            width="w-32"
            icon="bi bi-filetype-csv"
            background="bg-[#4f6d7a]"
            borderColor="border-[#4f6d7a]"
        />

        <Button 
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
                    <TableHeaderCell>Correo Electrónico</TableHeaderCell>
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
                            
                        />
                    </TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.information.name }}</TableDataCell>
                    <TableDataCell>{{ lead.information.followUp?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.enrollmentStatus }}</TableDataCell>
                    <TableDataCell>{{ lead.phones[0] }}</TableDataCell>
                    <TableDataCell>{{ lead.emails[0] }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.careerInterest }}</TableDataCell>
                    <TableDataCell>{{ lead.grade?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.formerSchool }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.typeSchool }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.asetName?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.campaign?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.address?.country }}</TableDataCell>
                    <TableDataCell>{{ lead.address?.state }}</TableDataCell>
                    <TableDataCell>{{ lead.address?.city }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell class="flex flex-col gap-2 text-center">

                        <router-link 
                            title="Asignar y reasignar promotor"
                            :to="{ path: '/admin/leads/' + lead.id + '/assignment'}"
                            class="py-2 px-4 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md duration-200"
                        >
                            <i class="bi bi-person-plus-fill"></i>
                        </router-link>

                        <router-link 
                            title="Mostrar datos"
                            :to="{ path: '/admin/leads/' + lead.id + '/show'}"
                            class="py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md duration-200"
                        >
                            <i class="bi bi-eye-fill"></i>
                        </router-link>

                        <router-link 
                            :to="{ path: '/admin/leads/' + lead.id + '/edit' }"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>

        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="fetchLeads" />

    </section>
</template>