<script>
import { onMounted, ref } from "vue";
import city from '../../../services/city.service';

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import Table from '../../../components/Table.vue';
import TableDataCell from "../../../components/TableDataCell.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableRow from "../../../components/TableRow.vue";

export default {
  setup() {
    const cities = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);

    const sortByName = (arr, key = 'name') => {
      return [...arr].sort((a, b) => {
        const nameA = a[key]?.toUpperCase?.() || '';
        const nameB = b[key]?.toUpperCase?.() || '';
        return nameA.localeCompare(nameB);
      });
    };

    const fetchCities = async (page = 1) => {
      const { data } = await city.getAll(page);
      cities.value = sortByName(data.data);
      currentPage.value = data.meta.currentPage;
      totalPages.value = data.meta.totalPages;
    };

    const handlePageChange = (page) => {
      fetchCities(page);
    };

    onMounted(() => {
      fetchCities();
    });

    return {
      cities,
      currentPage,
      totalPages,
      handlePageChange,
      fetchCities,
    };
  },
  methods: {
    confirmDelete(cityId) {
      this.$swal.fire({
        title: '¿Estás seguro de eliminar este registro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '758694',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await city.delete(cityId);
          this.$swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
          await this.fetchCities(this.currentPage);
        }
      });
    },
  },
  components: {
    Button,
    Pagination,
    Table,
    TableDataCell,
    TableHeaderCell,
    TableRow,
  },
};
</script>

<template>
  <section class="flex items-end justify-end mb-6">
    <Button
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
          <TableDataCell class="flex gap-2 text-center">
            <router-link
              :to="{ path: '/admin/cities/' + city.id + '/edit/' }"
              class="btn text-black bg-amber-400 hover:bg-amber-500"
            >
              <i class="bi bi-pencil-square"></i>
            </router-link>
            <button
              class="btn text-white bg-red-500 hover:bg-red-600"
              @click="confirmDelete(city.id)"
            >
              <i class="bi bi-trash3-fill"></i>
            </button>
          </TableDataCell>
        </TableRow>
      </template>
    </Table>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="handlePageChange"
    />
  </section>
</template>
