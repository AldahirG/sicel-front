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

// Función para ordenar por nombre de forma alfabética
const sortByName = (arr, key = 'name') => {
  return [...arr].sort((a, b) => {
    const nameA = a[key]?.toUpperCase?.() || '';
    const nameB = b[key]?.toUpperCase?.() || '';
    return nameA.localeCompare(nameB);
  });
};

onMounted(async () => {
  await store.getAll();
  asetNames.value = sortByName(store.asetNames);
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
