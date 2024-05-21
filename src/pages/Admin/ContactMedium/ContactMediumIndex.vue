<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useContactMediumsStore } from "../../../store/Admin/contactMedium";

import CreateButton from "../../../components/CreateButton.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useContactMediumsStore();
const contactMediums = ref([]);

onMounted(async () => {
    await store.getAll();
    contactMediums.value = store.contactMediums;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        <CreateButton
            name="createContactMedium"
            label="medio de contacto"
            width="w-52"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Medio de contacto</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="contactMedium in contactMediums" :key="contactMedium.id">
                    <TableDataCell>{{ contactMedium.name }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/contact-mediums/' + contactMedium.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>