<script setup>
import { onMounted, ref, watch, computed } from "vue";
import enrollmentService from '../../../services/enrollment.service';
import leadService from '../../../services/lead.service';

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from '../../../components/Table.vue';
import Pagination from '../../../components/Pagination.vue';
import Modal from '../../../components/Modal.vue';
import { useRouter } from "vue-router";

const router = useRouter();

const allEnrollments = ref([]);
const filteredEnrollments = ref([]);
const currentPage = ref(1);
const perPage = 10;
const showFilterModal = ref(false);
const selectedFilterType = ref('');
const selectedFilterValue = ref('');
const filterOptions = ref({});

const filters = ref({});

const filterTypes = [
  { key: 'Career', label: 'Carrera' },
  { key: 'Promotion', label: 'Promoción' },
  { key: 'Channel', label: 'Canal de Venta' },
  { key: 'List', label: 'Lista de Comisión' },
  { key: 'Scholarship', label: 'Beca' },
  { key: 'User', label: 'Promotor' },
];

const totalPages = computed(() => {
  return Math.ceil(filteredEnrollments.value.length / perPage);
});

const paginatedEnrollments = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredEnrollments.value.slice(start, start + perPage);
});

const applyFilters = () => {
  filteredEnrollments.value = allEnrollments.value.filter(e => {
    return Object.entries(filters.value).every(([key, value]) => {
      if (!value) return true;
      if (key === 'Scholarship') return e.Lead?.scholarship === value;
      if (key === 'User') return e.Lead?.user?.id === value;
      return e[key]?.id === value;
    });
  });
  currentPage.value = 1;
};

watch(filters, applyFilters, { deep: true });

const fetchEnrollments = async () => {
  try {
    const { data } = await enrollmentService.getAll();
    allEnrollments.value = await Promise.all(
      data.data.map(async (e) => {
        const leadResponse = await leadService.getById(e.leadId);
        const leadData = leadResponse.data.data;
        return {
          ...e,
          Lead: {
            ...e.Lead,
            information: leadData.information,
            phones: leadData.phones,
            emails: leadData.emails,
            user: e.Lead.user || leadData.user || null
          }
        };
      })
    );
    filterOptions.value = {
      Career: [...new Map(allEnrollments.value.map(e => [e.Career?.id, e.Career])).values()].filter(Boolean),
      Promotion: [...new Map(allEnrollments.value.map(e => [e.Promotion?.id, e.Promotion])).values()].filter(Boolean),
      Channel: [...new Map(allEnrollments.value.map(e => [e.Channel?.id, e.Channel])).values()].filter(Boolean),
      List: [...new Map(allEnrollments.value.map(e => [e.List?.id, e.List])).values()].filter(Boolean),
      Scholarship: [...new Set(allEnrollments.value.map(e => e.Lead?.scholarship))].filter(Boolean),
      User: [...new Map(allEnrollments.value.map(e => [e.Lead?.user?.id, e.Lead?.user])).values()].filter(Boolean)
    };
    applyFilters();
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
  }
};

const openFilterModal = () => {
  showFilterModal.value = true;
};

const applySelectedFilter = () => {
  if (selectedFilterType.value && selectedFilterValue.value) {
    filters.value[selectedFilterType.value] = selectedFilterValue.value;
  }
  showFilterModal.value = false;
  selectedFilterType.value = '';
  selectedFilterValue.value = '';
};

const goToEdit = (id) => {
  router.push({ name: 'admin/editEnrollment', params: { id } });
};

const goToShow = (id) => {
  router.push({ name: 'admin/showEnrollment', params: { id } });
};

const showDownloadModal = ref(false);
const selectedListId = ref('');

const handleDownloadExcel = async () => {
  try {
    const response = await enrollmentService.downloadExcelByList(selectedListId.value);
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lista-inscripciones.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    showDownloadModal.value = false;
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
  }
};


onMounted(() => {
  fetchEnrollments();
});
</script>

<template>
<section class="flex flex-wrap items-center justify-between mb-6 gap-4">
  <!-- Grupo de botones de navegación -->
  <div class="flex flex-wrap gap-4">
    <Button name="admin/enrollments/promotions" actionLabel="Promociones de" label="inscripción" icon="bi bi-badge-ad-fill" borderColor="border-gray-600" background="bg-gray-600" height="h-12" width="w-56" />
    <Button name="admin/enrollments/lists" actionLabel="Lista de" label="comisiones" icon="bi bi-journals" borderColor="border-gray-600" background="bg-gray-600" height="h-12" width="w-[178px]" />
    <Button name="admin/enrollments/channels" actionLabel="Canal de" label="venta" icon="bi bi-clipboard2-data-fill" borderColor="border-gray-600" background="bg-gray-600" height="h-12" />
  </div>

  <!-- Grupo de acciones (filtro + descarga) -->
  <div class="flex gap-3">
    <button @click="openFilterModal" class="btn btn-primary h-12 flex items-center px-4">
      <i class="bi bi-funnel-fill mr-2"></i>
      Filtrar
    </button>
    <Button
      label="Descargar Excel por Lista"
      icon="bi bi-download"
      background="bg-green-600"
      borderColor="border-green-600"
      height="h-12"
      @click="showDownloadModal = true"
    />
  </div>
</section>


  <Modal v-if="showFilterModal" @close="showFilterModal = false">
    <template #header>
      <h3 class="text-lg font-semibold">Aplicar Filtros</h3>
    </template>
    <template #body>
      <div class="mb-4">
        <label class="block text-sm mb-1">Tipo de Filtro</label>
        <select v-model="selectedFilterType" class="input w-full">
          <option disabled value="">Seleccione un tipo</option>
          <option v-for="type in filterTypes" :key="type.key" :value="type.key">{{ type.label }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1">Valor</label>
        <select v-if="selectedFilterType && selectedFilterType !== 'Scholarship' && selectedFilterType !== 'User'" v-model="selectedFilterValue" class="input w-full">
          <option disabled value="">Seleccione un valor</option>
          <option v-for="option in filterOptions[selectedFilterType]" :key="option?.id" :value="option?.id">
            {{ option?.name || option?.program || option?.noLista }}
          </option>
        </select>
        <select v-else-if="selectedFilterType === 'Scholarship'" v-model="selectedFilterValue" class="input w-full">
          <option disabled value="">Seleccione una beca</option>
          <option v-for="sch in filterOptions.Scholarship" :key="sch" :value="sch">{{ sch }}</option>
        </select>
        <select v-else-if="selectedFilterType === 'User'" v-model="selectedFilterValue" class="input w-full">
          <option disabled value="">Seleccione un promotor</option>
          <option v-for="user in filterOptions.User" :key="user?.id" :value="user?.id">{{ user?.name }}</option>
        </select>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <button @click="showFilterModal = false" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
          <i class="bi bi-x-circle-fill mr-1"></i>
          Cancelar
        </button>
        <button @click="applySelectedFilter" class="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded">
          <i class="bi bi-check-circle-fill mr-1"></i>
          Aplicar
        </button>
      </div>
    </template>
  </Modal>

  <Modal v-if="showDownloadModal" @close="showDownloadModal = false">
  <template #header>
    <h3 class="text-lg font-semibold">Seleccionar Lista a Descargar</h3>
  </template>
  <template #body>
    <div>
      <label class="block text-sm mb-1">Lista</label>
      <select v-model="selectedListId" class="input w-full">
        <option disabled value="">Seleccione una lista</option>
        <option v-for="list in filterOptions.List" :key="list.id" :value="list.id">
          {{ list.noLista }}
        </option>
      </select>
    </div>
  </template>
  <template #footer>
    <div class="flex justify-end gap-4">
      <button @click="showDownloadModal = false" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
        <i class="bi bi-x-circle-fill mr-1"></i>
        Cancelar
      </button>
      <button @click="handleDownloadExcel" :disabled="!selectedListId" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        <i class="bi bi-download mr-1"></i>
        Descargar
      </button>
    </div>
  </template>
</Modal>

  <section>
    <Table>
      <template #header>
        <TableRow>
          <TableHeaderCell>Fecha de inscripción</TableHeaderCell>
          <TableHeaderCell>Lead</TableHeaderCell>
          <TableHeaderCell>Carrera</TableHeaderCell>
          <TableHeaderCell>Promoción</TableHeaderCell>
          <TableHeaderCell>Canal de Venta</TableHeaderCell>
          <TableHeaderCell>Beca</TableHeaderCell>
          <TableHeaderCell>Lista de Comisión</TableHeaderCell>
          <TableHeaderCell>Promotor</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>
      <template #content>
        <TableRow v-for="enrollment in paginatedEnrollments" :key="enrollment.id">
          <TableDataCell>{{ new Date(enrollment.createAt).toLocaleDateString() }}</TableDataCell>
          <TableDataCell>
            {{ enrollment.Lead?.information?.name || 'N/A' }}<br />
            <small class="text-gray-500">{{ enrollment.Lead?.phones?.[0] || 'N/A' }}</small>
          </TableDataCell>
          <TableDataCell>{{ enrollment.Career?.program || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Promotion?.name || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Channel?.name || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.scholarship || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.List?.noLista || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.user ? `${enrollment.Lead.user.name} ${enrollment.Lead.user.paternalSurname ?? ''}`: 'N/A'}} </TableDataCell>
          <TableDataCell>
            <div class="flex gap-2">
              <button @click="goToEdit(enrollment.id)" class="btn bg-amber-400 hover:bg-amber-500 text-white">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button @click="goToShow(enrollment.id)" class="btn bg-sky-600 hover:bg-sky-700 text-white">
                <i class="bi bi-eye-fill"></i>
              </button>
            </div>
          </TableDataCell>
        </TableRow>
      </template>
    </Table>
    <div class="flex justify-center mt-6">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="(page) => currentPage.value = page" />
    </div>
  </section>
</template>
