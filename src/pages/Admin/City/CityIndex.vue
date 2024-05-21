<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useCitiesStore } from "../../../store/Admin/cities";

import CreateButton from "../../../components/CreateButton.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useCitiesStore();
const cities = ref([]);

onMounted(async () => {
    await store.getAll();
    cities.value = store.cities;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <CreateButton
            name="createCity"
            label="ciudad"
            width="w-36"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre de la ciudad</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="city in cities" :key="city.id">
                    <TableDataCell>{{ city.name }}</TableDataCell>
                    <TableDataCell>{{ city.state.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/cities/' + city.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>