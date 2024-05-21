<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useCareersStore } from "../../../store/Admin/careers";

import CreateButton from "../../../components/CreateButton.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useCareersStore();
const careers = ref([]);

onMounted(async () => {
    await store.getAll();
    careers.value = store.careers;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <CreateButton
            name="createCareer"
            label="carrera"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre</TableHeaderCell>
                    <TableHeaderCell>Programa</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="career in careers" :key="career.id">
                    <TableDataCell>{{ career.name }}</TableDataCell>
                    <TableDataCell>{{ career.program }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/careers/' + career.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>