<script>
import { onMounted, ref } from "vue";
import country from '../../../services/country.service';

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import Table from '../../../components/Table.vue';
import TableDataCell from "../../../components/TableDataCell.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableRow from "../../../components/TableRow.vue";

export default {
  setup() {
    const countries = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);

    const fetchCountries = async (page = 1) => {
      const { data } = await country.getAll(page);

      countries.value = [...data.data].sort((a, b) => {
        const nameA = a.name?.toUpperCase?.() || '';
        const nameB = b.name?.toUpperCase?.() || '';
        return nameA.localeCompare(nameB);
      });

      currentPage.value = data.meta.currentPage;
      totalPages.value = data.meta.totalPages;
    };

    const handlePageChange = (page) => {
      fetchCountries(page);
    };

    onMounted(async () => {
      fetchCountries();
    });

    return {
      countries,
      currentPage,
      totalPages,
      handlePageChange,
      fetchCountries,
    };
  },
  methods: {
    confirmDelete(countryId) {
      this.$swal.fire({
        title: '¿Estás seguro de eliminar este registro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#758694',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await country.delete(countryId);
          this.$swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
          await this.fetchCountries(this.currentPage);
        }
      });
    },
  },
  components: {
    Button,
    TableRow,
    TableHeaderCell,
    TableDataCell,
    Table,
    Pagination,
  },
};
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
          <TableDataCell class="flex gap-2 text-center">
            <router-link :to="{ path: '/admin/countries/' + country.id + '/edit/'}"
              class="btn text-black bg-amber-400 hover:bg-amber-500">
              <i class="bi bi-pencil-square"></i>
            </router-link>
            <button 
              class="btn bg-red-500 hover:bg-red-600 text-white"
              @click="confirmDelete(country.id)"
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
