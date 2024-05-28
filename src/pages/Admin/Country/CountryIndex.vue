<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useCountriesStore } from "../../../store/Admin/countries";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useCountriesStore();
const countries = ref([]);

onMounted(async () => {
    await store.getAll();
    countries.value = store.countries;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <Button
            name="createCountry"
            label="país"
            width="w-32"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre del país</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="country in countries" :key="country.id">
                    <TableDataCell>{{ country.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/countries/' + country.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>