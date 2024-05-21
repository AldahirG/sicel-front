<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useCyclesStore } from "../../../store/Admin/cycles";

import CreateButton from "../../../components/CreateButton.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useCyclesStore();
const cycles = ref([]);

onMounted(async () => {
    await store.getAll();
    cycles.value = store.cycles;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <CreateButton
            name="createCycle"
            label="ciclo"
            width="w-44"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Ciclo escolar</TableHeaderCell>
                    <TableHeaderCell>Periodo</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="cycle in cycles" :key="cycle.id">
                    <TableDataCell>{{ cycle.cycle }}</TableDataCell>
                    <TableDataCell>{{ cycle.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/cycles/' + cycle.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>