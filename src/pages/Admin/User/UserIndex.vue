<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useUsersStore } from "../../../store/Admin/users";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useUsersStore();
const users = ref([]);

onMounted(async () => {
    await store.getAll();
    users.value = store.users;
});

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
                    <TableDataCell>{{ user.name }}</TableDataCell>
                    <TableDataCell>{{ user.paternalSurname }}</TableDataCell>
                    <TableDataCell>{{ user.maternalSurname }}</TableDataCell>
                    <TableDataCell>{{ user.email }}</TableDataCell>
                    <TableDataCell>{{ user.roles.join(', ') }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/users/' + user.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>