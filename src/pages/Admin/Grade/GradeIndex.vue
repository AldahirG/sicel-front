<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useGradesStore } from "../../../store/Admin/grades";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useGradesStore();
const grades = ref([]);

onMounted(async () => {
    await store.getAll();
    grades.value = store.grades;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <Button
            name="createGrade"
            label="grado"
            width="w-36"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre del grado escolar</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="grade in grades" :key="grade.id">
                    <TableDataCell>{{ grade.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/grades/' + grade.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>