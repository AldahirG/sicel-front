<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useStatesStore } from "../../../store/Admin/states";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useStatesStore();
const states = ref([]);

onMounted(async () => {
    await store.getAll();
    states.value = store.states;
});

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
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/states/' + state.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>