<script setup>
import axios from 'axios';
import { getId } from '../../../routes/auth';
import { computed, defineAsyncComponent, ref, onMounted } from 'vue';

// Componentes
const DashboardLayout = defineAsyncComponent(() =>
  import('../../../layouts/DashboardLayout.vue')
);

const TableSkeleton = defineAsyncComponent(() =>
  import('../../../components/TableSkeleton.vue')
)

const Table = defineAsyncComponent({
  loader: () => import('../../../components/Table.vue'),
  delay: 2000,
  timeout: 3000,
  suspensible: true,
});

const TableDataCell = defineAsyncComponent(() =>
  import('../../../components/TableDataCell.vue')
);

const TableHeaderCell = defineAsyncComponent(() =>
  import('../../../components/TableHeaderCell.vue')
);

const TableRow = defineAsyncComponent(() =>
  import('../../../components/TableRow.vue')
);

// URL de API
const url = import.meta.env.VITE_API_URL;

// Variables reactivas
const bread = [
    { label: "Dashboard", name: 'promoter' },
    { label: "Inscripciones", name: 'promoter/enrollments' },
]

const leads = ref([]);

const currentPage = ref(1);
const pageSize = 10;
const totalItems = ref(0);

// Métodos
const fetchLeads = async () => {
    try {
        const userId = await getId();
        const response = await axios.get(`${url}/promoter/${userId}/enrollments?skip=${(currentPage.value - 1) * pageSize}&take=${pageSize}`);
        leads.value = response.data;
    } catch (error) {
        console.error('Error al obtener los leads:', error);
    }
};

const fetchTotalLeads = async () => {
  try {
    const userId = await getId();
    const response = await axios.get(`${url}/promoter/${userId}/leads/count`);
    totalItems.value = response.data;
  } catch (error) {
    console.error('Error al obtener el total de leads:', error);
  }
}

const onClickHandler = (page) => {
  currentPage.value = page;
  fetchLeads();
};

// Montaje inicial
onMounted(() => {
    fetchLeads();
    fetchTotalLeads();
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

</script>

<template>
    <DashboardLayout :breadcrumbs="bread">
        <Suspense>
            <template #default>
                <section class="mt-4">
                    <Table>
                        <template #header>
                            
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Nombre Completo</TableHeaderCell>
                                <TableHeaderCell>Matrícula</TableHeaderCell>
                                <TableHeaderCell>Programa</TableHeaderCell>
                                <TableHeaderCell>Ciclo</TableHeaderCell>
                                <TableHeaderCell>Grado</TableHeaderCell>
                                <TableHeaderCell>Fecha de Inscripción</TableHeaderCell>
                                <TableHeaderCell>Promotor</TableHeaderCell>
                                <TableHeaderCell>Teléfono</TableHeaderCell>
                                <TableHeaderCell>Correo electrónico</TableHeaderCell>
                                <TableHeaderCell>Acciones</TableHeaderCell>
                            </TableRow>
                        </template>
                        <template #content>
                            <TableRow v-for="lead in leads" :key="lead.id">
                                <TableDataCell>{{ lead.id }}</TableDataCell>
                                <TableDataCell>{{ lead.name }}</TableDataCell>
                                <TableDataCell></TableDataCell>
                                <TableDataCell></TableDataCell>
                                <TableDataCell>{{ lead.schoolYear.cicle }}</TableDataCell>
                                <TableDataCell>{{ lead.grade.name }}</TableDataCell>
                                <TableDataCell></TableDataCell>
                                <TableDataCell>{{ lead.user.name }}</TableDataCell>
                                <TableDataCell>{{ lead.tel }}</TableDataCell>
                                <TableDataCell>{{ lead.email }}</TableDataCell>

                                <!-- Acciones -->
                                <TableDataCell class="flex flex-col gap-2 text-center">

                                    <router-link 
                                        title="Editar"
                                        :to="{ path: '/promoter/lead/edit/' + lead.id }"
                                        class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
                                    >
                                        <i class="bi bi-pencil-square"></i>
                                    </router-link>

                                </TableDataCell>
                            </TableRow>
                        </template>
                    </Table>

                    <div class="flex justify-center mx-auto max-w-xl">
                        <template v-if="totalItems > 0">
                            <vue-awesome-paginate
                            :total-items="totalItems"
                            :items-per-page="pageSize"
                            :max-pages-shown="totalPages"
                            v-model="currentPage"
                            :on-click="onClickHandler"
                            />
                        </template>
                    </div>

                </section>
            </template>

            <template #fallback>
                <TableSkeleton />
            </template>
        </Suspense>
    </DashboardLayout>
</template>

<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
</style>