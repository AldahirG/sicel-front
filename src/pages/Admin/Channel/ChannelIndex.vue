<script>
import { onMounted, ref } from "vue";
import channel from "../../../services/channel.service";

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from "../../../components/Table.vue";

export default {
  setup() {
    const channels = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);

    const fetchChannels = async (page = 1) => {
      const { data } = await channel.getAll(page);
      channels.value = data.data;
      currentPage.value = data.meta.currentPage;
      totalPages.value = data.meta.totalPages;
    };

    const handlePageChange = (page) => {
      fetchChannels(page);
    };

    onMounted(() => {
      fetchChannels();
    });

    return {
      channels,
      currentPage,
      totalPages,
      handlePageChange,
      fetchChannels,
    };
  },
  methods: {
    confirmDelete(channelId) {
      this.$swal.fire({
        title: '¿Estás seguro de eliminar este canal?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#758694',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await channel.delete(channelId);
          this.$swal.fire(
            '¡Eliminado!',
            'El canal ha sido eliminado.',
            'success'
          );
          await this.fetchChannels(this.currentPage);
        }
      });
    }
  },
  components: {
    Button,
    Pagination,
    Table,
    TableRow,
    TableHeaderCell,
    TableDataCell,
  }
};
</script>

<template>
  <section class="flex items-end justify-end mb-6">
    <Button
      name="createChannel"
      label="canal de venta"
      icon="bi bi-clipboard-plus"
    />
  </section>

  <section>
    <Table>
      <template #header>
        <TableRow>
          <TableHeaderCell>Nombre</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>

      <template #content>
        <TableRow v-for="channel in channels" :key="channel.id">
          <TableDataCell>{{ channel.name }}</TableDataCell>
          <TableDataCell class="flex gap-2 text-center">
            <router-link
              :to="{ path: '/admin/enrollments/channels/' + channel.id + '/edit' }"
              class="btn text-black bg-amber-400 hover:bg-amber-500"
            >
              <i class="bi bi-pencil-square"></i>
            </router-link>

            <button
              @click="confirmDelete(channel.id)"
              class="btn text-white bg-red-500 hover:bg-red-600"
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
