<script>
import { onMounted, ref } from "vue";
import list from "../../../services/list.service";

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from '../../../components/Table.vue';

export default {
    setup() {
        const lists = ref([]);
        const currentPage = ref(1);
        const totalPages = ref(1);

        const fetchLists = async (page) => {
            const { data } = await list.getAll(page);
            lists.value = data.data;
            currentPage.value = data.meta.currentPage;
            totalPages.value = data.meta.totalPages;
        };

        const handlePageChange = (page) => {
            fetchLists(page);
        };

        onMounted(() => {
            fetchLists();
        });

        return {
            lists,
            currentPage,
            totalPages,
            handlePageChange,
            fetchLists,
        };
    },
    methods: {
        confirmDelete(listId) {
            this.$swal.fire({
                title: '¿Estás seguro de eliminar esta lista?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '758694',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await list.delete(listId);
                    this.$swal.fire(
                        '¡Eliminado!',
                        'La lista ha sido eliminada.',
                        'success'
                    );
                    await this.fetchLists(this.currentPage);
                }
            });
        },
    },
    components: {
        Button,
        Pagination,
        Table,
        TableRow,
        TableHeaderCell,
        TableDataCell,
    }
};
</script>

<template>
    <section class="flex items-end justify-end mb-6">
        <Button
            name="createList"
            label="lista"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre</TableHeaderCell>
                    <TableHeaderCell>Fecha Inicio</TableHeaderCell>
                    <TableHeaderCell>Fecha Fin</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>

            <template #content>
                <TableRow v-for="list in lists" :key="list.id">
                    <TableDataCell>{{ list.noLista || 'Sin nombre' }}</TableDataCell>
                    <TableDataCell>{{ list.dateStart?.substring(0, 10) || 'Sin información' }}</TableDataCell>
                    <TableDataCell>{{ list.dateEnd?.substring(0, 10) || 'Sin información' }}</TableDataCell>
                    <TableDataCell class="flex gap-2 text-center">
                        <router-link 
                            :to="{ path: '/admin/enrollments/lists/' + list.id + '/edit/' }"
                            class="btn text-black bg-amber-400 hover:bg-amber-500"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                        <button 
                            class="btn text-white bg-red-500 hover:bg-red-600"
                            @click="confirmDelete(list.id)"
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
