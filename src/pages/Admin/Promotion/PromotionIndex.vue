<script>
import { onMounted, ref } from "vue";
import promotion from "../../../services/promotion.service";

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from '../../../components/Table.vue';

export default {
    setup() {
        const promotions = ref({});
        const currentPage = ref(1);
        const totalPages = ref(1);

        const fetchPromotions = async (page) => {
            const { data } = await promotion.getAll(page);

            promotions.value = data.data;
            currentPage.value = data.meta.currentPage;
            totalPages.value = data.meta.totalPages;
        };

        const handlePageChange = (page) => {
            fetchPromotions(page);
        };

        onMounted(async () => {
            fetchPromotions();
        });

        return {
            promotions,
            currentPage,
            totalPages,
            handlePageChange,
            fetchPromotions,
        };
    },
    methods: {
        confirmDelete(promotionId) {
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
                    await promotion.delete(promotionId);
                    this.$swal.fire(
                        '¡Eliminado!',
                        'El registro ha sido eliminado.',
                        'success'
                    );
                    await this.fetchPromotions(this.currentPage);
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
    }
}

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <Button
            name="createPromotion"
            label="promoción"
        />

    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="promotion in promotions" :key="promotion.id">
                    <TableDataCell>{{ promotion.name }}</TableDataCell>
                    <TableDataCell class="flex gap-2 text-center">

                        <router-link :to="{ path: '/admin/enrollments/promotions/' + promotion.id + '/edit/'}"
                            class="btn text-black bg-amber-400 hover:bg-amber-500">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                        <button 
                            class="btn text-white bg-red-500 hover:bg-red-600"
                            @click="confirmDelete(promotion.id)"
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