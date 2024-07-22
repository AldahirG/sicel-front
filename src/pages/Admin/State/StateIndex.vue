<script>
import { onMounted, ref } from "vue";
import state from '../../../services/state.service';

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import Table from '../../../components/Table.vue';
import TableDataCell from "../../../components/TableDataCell.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableRow from "../../../components/TableRow.vue";

export default {
    setup() {
        const states = ref({});
        const currentPage = ref(1);
        const totalPages = ref(1);

        const fetchStates = async (page) => {
            const { data } = await state.getAll(page);

            states.value = data.data;
            currentPage.value = data.meta.currentPage;
            totalPages.value = data.meta.totalPages;
        };

        const handlePageChange = (page) => {
            fetchStates(page);
        };

        onMounted(async () => {
            fetchStates();
        });

        return {
            states,
            currentPage,
            totalPages,
            handlePageChange,
            fetchStates,
        };
    },
    methods: {
        confirmDelete(stateId) {
            this.$swal.fire({
                title: '¿Estás seguro de eliminar este registro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '758694',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await state.delete(stateId);
                    this.$swal.fire(
                        '¡Eliminado!',
                        'El registro ha sido eliminado.',
                        'success'
                    );
                    await this.fetchStates(this.currentPage);
                }
            });
        },
    },
    components: {
        Button,
        Pagination,
        Table,
        TableDataCell,
        TableHeaderCell,
        TableRow,
    },
};
</script>

<template>
    <section class="flex items-end justify-end mb-6">
        <Button
            name="createState"
            label="estado"
            width="w-36"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre del estado</TableHeaderCell>
                    <TableHeaderCell>País</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="state in states" :key="state.id">
                    <TableDataCell>{{ state.name }}</TableDataCell>
                    <TableDataCell>{{ state.country.name }}</TableDataCell>
                    <TableDataCell class="flex gap-2 text-center">

                        <router-link :to="{ path: '/admin/states/' + state.id + '/edit/'}"
                            class="btn text-black bg-amber-400 hover:bg-amber-500">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                        <button 
                            class="btn text-white bg-red-500 hover:bg-red-600"
                            @click="confirmDelete(state.id)"
                        >
                            <i class="bi bi-trash3-fill"></i>
                        </button>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>

        <Pagination 
            :currentPage="currentPage" 
            :totalPages="totalPages" 
            @page-changed="handlePageChange" 
        />
    </section>
</template>