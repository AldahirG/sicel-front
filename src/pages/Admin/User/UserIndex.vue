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
        const users = ref({});
        const currentPage = ref(1);
        const totalPages = ref(1);

        const fetchUsers = async (page) => {
            const { data } = await user.getAll(page);

            users.value = data.data;
            currentPage.value = data.meta.currentPage;
            totalPages.value = data.meta.totalPages;
        };

        const handlePageChange = (page) => {
            fetchUsers(page);
        };

        onMounted(async () => {
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
                    await user.delete(userId);
                    this.$swal.fire(
                        '¡Eliminado!',
                        'El registro ha sido eliminado.',
                        'success'
                    );
                    await this.fetchUsers(this.currentPage);
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
        <Button
            name="createUser"
            label="usuario"
        />
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
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/users/' + user.id + '/edit/'}"
                            class="btn text-black bg-amber-400 hover:bg-amber-500">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

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