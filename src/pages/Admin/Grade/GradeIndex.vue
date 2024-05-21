<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

import DashboardLayout from '../../../layouts/DashboardLayout.vue';
import SearchForm from '../../../components/SearchForm.vue';
import Table from '../../../components/Table.vue';
import TableDataCell from '../../../components/TableDataCell.vue';
import TableHeaderCell from '../../../components/TableHeaderCell.vue';
import TableRow from '../../../components/TableRow.vue';

// URL de API
const url = import.meta.env.VITE_API_URL;

// Paths for breadcrumbs
const bread = [
    { label: "Dashboard", name: 'admin' },
    { label: "Grados escolares", name: 'admin/grades' },
]

// Variables para paginación de api
const currentPage = ref(1);
const pageSize = 10;
const totalItems = ref(0);

const searchTerm = ref('');
const grades = ref([]);

// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', options);
};

const filteredgrades = computed(() => {
  return grades.value.filter(grade =>
    grade.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fetchGrades = async () => {
  try {
    const response = await axios.get(`${url}/grades?skip=${(currentPage.value - 1) * pageSize}&take=${pageSize}`);
    grades.value = response.data;
  } catch (error) {
    console.error('Error al obtener los grados escolares:', error);
  }
};

const onClickHandler = (page) => {
  currentPage.value = page;
  fetchGrades();
};

const fetchTotalGrades = async () => {
  try {
    const response = await axios.get(`${url}/grades/total`);
    totalItems.value = response.data;
  } catch (error) {
    console.error('Error al obtener el total de grados escolares:', error);
  }
}

const handleSearch = (value) => {
  searchTerm.value = value;
}

onMounted(() => {
  fetchGrades();
  fetchTotalGrades();
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

</script>

<template>
    <DashboardLayout :breadcrumbs="bread">
        <section class="flex justify-between items-end p-5">
            <SearchForm 
              text="Buscar grado escolar por nombre" 
              @search="handleSearch" 
            />

            <router-link 
                to="/admin/grade/create"
                class="py-2 px-4 text-white bg-sky-800 hover:bg-sky-900 duration-200 rounded-md"
            >
                Crear un grado escolar <i class="ml-1 bi bi-plus-circle-fill"></i>
            </router-link>
        </section>
        
        <section class="mt-4">
            <Table>
                <template #header>
                <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Grado escolar</TableHeaderCell>
                    <TableHeaderCell>Fecha de creación</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
                </template>
                <template #content>
                <TableRow v-for="grade in filteredgrades" :key="grade.id">
                    <TableDataCell>{{ grade.id }}</TableDataCell>
                    <TableDataCell>{{ grade.name }}</TableDataCell>
                    <TableDataCell class="capitalize">{{ formatDate(grade.created_at) }}</TableDataCell>
                    <TableDataCell class="flex flex-col lg:flex-row gap-4">

                        <router-link 
                          :to="{ path: '/admin/grade/edit/' + grade.id }"
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

            <div v-if="filteredgrades.length === 0" class="mt-4">
                <p class="text-center text-gray-500 dark:text-gray-400">
                    No se encontraron grados
                </p>
            </div>
        </section>
    </DashboardLayout>
</template>

<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
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