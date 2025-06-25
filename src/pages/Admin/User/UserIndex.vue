<script>
import { onMounted, ref } from "vue";
import user from '../../../services/user.service';

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import Table from '../../../components/Table.vue';
import TableDataCell from "../../../components/TableDataCell.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableRow from "../../../components/TableRow.vue";

export default {
  setup() {
    const users = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);

    const sortUsers = (list) => {
      return [...list].sort((a, b) => {
        const nameA = (a.name + ' ' + a.paternalSurname).toUpperCase();
        const nameB = (b.name + ' ' + b.paternalSurname).toUpperCase();
        return nameA.localeCompare(nameB);
      });
    };

    const fetchUsers = async (page = 1) => {
      const { data } = await user.getAll(page);
      users.value = sortUsers(data.data);
      currentPage.value = data.meta.currentPage;
      totalPages.value = data.meta.totalPages;
    };

    const handlePageChange = (page) => {
      fetchUsers(page);
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      currentPage,
      totalPages,
      handlePageChange,
      fetchUsers,
    };
  },
  methods: {
    confirmDelete(userId) {
      this.$swal.fire({
        title: '¿Estás seguro de dar de baja a este usuario?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '758694',
        confirmButtonText: 'Dar de baja',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await user.delete(userId);
            this.$swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            await this.fetchUsers(this.currentPage);
          } catch (error) {
            console.log(error);
          }
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
}
</script>

<template>
  <section class="flex items-end justify-end mb-6">
    <Button name="createUser" label="usuario" />
  </section>

  <section>
    <Table>
      <template #header>
        <TableRow>
          <TableHeaderCell>ID</TableHeaderCell>
          <TableHeaderCell>Nombre</TableHeaderCell>
          <TableHeaderCell>Apellido Paterno</TableHeaderCell>
          <TableHeaderCell>Apellido Materno</TableHeaderCell>
          <TableHeaderCell>Correo Electrónico</TableHeaderCell>
          <TableHeaderCell>Roles</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>

      <template #content>
        <TableRow v-for="user in users" :key="user.id">
          <TableDataCell>{{ user.id }}</TableDataCell>
          <TableDataCell>{{ user.name }}</TableDataCell>
          <TableDataCell>{{ user.paternalSurname }}</TableDataCell>
          <TableDataCell>{{ user.maternalSurname }}</TableDataCell>
          <TableDataCell>{{ user.email }}</TableDataCell>
          <TableDataCell>{{ user.roles.join(', ') }}</TableDataCell>
          <TableDataCell class="flex flex-col gap-2 text-center">
            <router-link
              :to="{ path: '/admin/users/' + user.id + '/edit/' }"
              class="btn text-black bg-amber-400 hover:bg-amber-500"
            >
              <i class="bi bi-pencil-square"></i>
            </router-link>

            <button
              class="btn text-white bg-red-500 hover:bg-red-600"
              @click="confirmDelete(user.id)"
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
