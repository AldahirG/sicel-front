<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useAsetNamesStore } from "../../../store/Admin/asetNames";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useAsetNamesStore();
const asetNames = ref([]);

onMounted(async () => {
    await store.getAll();
    asetNames.value = store.asetNames;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <Button
            name="createAsetName"
            label="aset name"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Aset Name</TableHeaderCell>
                    <TableHeaderCell>Medio de Contacto</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="asetName in asetNames" :key="asetName.id">
                    <TableDataCell>{{ asetName.name }}</TableDataCell>
                    <TableDataCell>{{ asetName.contactType.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/aset-names/' + asetName.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>