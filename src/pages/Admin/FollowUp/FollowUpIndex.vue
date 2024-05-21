<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useFollowUpsStore } from "../../../store/Admin/followUp";

import CreateButton from "../../../components/CreateButton.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useFollowUpsStore();
const followUps = ref([]);

onMounted(async () => {
    await store.getAll();
    followUps.value = store.followUps;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <CreateButton
            name="createFollowUp"
            label="seguimiento"
            width="w-44"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre del seguimiento</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="followUp in followUps" :key="followUp.id">
                    <TableDataCell>{{ followUp.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/follow-ups/' + followUp.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>