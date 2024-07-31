<script setup>
import { onMounted, ref } from "vue";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from'../../../components/Table.vue';

const enrollments = ref([]);

</script>

<template>
    <section class="flex items-end justify-end mb-6 gap-4">

        <Button
                name="admin/enrollments/promotions"
                actionLabel="Promociones de"
                label="inscripción"
                icon="bi bi-badge-ad-fill"
                borderColor="border-gray-600"
                background="bg-gray-600"
                height="h-12"
                width="w-56"
            />

            <Button
                name="admin/enrollments/promotions"
                actionLabel="Lista de"
                label="comisiones"
                icon="bi bi-journals"
                borderColor="border-gray-600"
                background="bg-gray-600"
                height="h-12"
                width="w-[178px]"
            />

        <Button
            name="admin/enrollments/promotions"
            actionLabel="Canal de"
            label="venta"
            icon="bi bi-clipboard2-data-fill"
            borderColor="border-gray-600"
            background="bg-gray-600"
            height="h-12"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Fecha de inscripción</TableHeaderCell>
                    <TableHeaderCell>Lead</TableHeaderCell>
                    <TableHeaderCell>Carrera</TableHeaderCell>
                    <TableHeaderCell>Promoción de inscripción</TableHeaderCell>
                    <TableHeaderCell>Canal de venta</TableHeaderCell>
                    <TableHeaderCell>Beca</TableHeaderCell>
                    <TableHeaderCell>Lista de comisión</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="enrollment in enrollments" :key="enrollment.id">
                    <TableDataCell></TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>

                        <!-- <router-link :to="{ path: '/admin/careers/' + career.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link> -->

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>