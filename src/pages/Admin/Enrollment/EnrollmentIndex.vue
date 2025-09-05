<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import enrollmentService from '../../../services/enrollment.service';
import leadService from '../../../services/lead.service';

import Pagination from '../../../components/Pagination.vue';
import Table from '../../../components/Table.vue';
import TableRow from '../../../components/TableRow.vue';
import TableHeaderCell from '../../../components/TableHeaderCell.vue';
import TableDataCell from '../../../components/TableDataCell.vue';
import ColumnFilter from '../../../components/ColumnFilter.vue';
import Button from "../../../components/Button.vue";
import Modal from "../../../components/Modal.vue";

const router = useRouter();

const enrollments = ref([]);
const originalEnrollments = ref([]);
const currentPage = ref(parseInt(localStorage.getItem('admin-enrollment-page')) || 1);
const searchQuery = ref(localStorage.getItem('admin-enrollment-search') || '');
const filters = ref(JSON.parse(localStorage.getItem('admin-enrollment-filters')) || {});
const filterOptions = ref({});

const appliedFilters = ref([]);
const dropdowns = ref({});
const totalPages = ref(1);
const perPage = 50;

const showDownloadModal = ref(false);
const selectedListId = ref('');

const filterTypes = ref([
  { key: 'Lead.promoter.name', label: 'Promotor' },
  { key: 'Lead.information.followUp.name', label: 'Seguimiento' },
  { key: 'Lead.asetName.contactType', label: 'Medio' },
  { key: 'Lead.asetName.name', label: 'Asset' },
  { key: 'Lead.campaign.name', label: 'Campaña' },
  { key: 'Lead.address.country.name', label: 'País' },
  { key: 'Lead.address.state', label: 'Estado' },
  { key: 'Lead.address.city', label: 'Ciudad' },
  { key: 'Career.program', label: 'Programa' },
  { key: 'Lead.information.formerSchool', label: 'Escuela' },
  { key: 'Lead.information.typeSchool', label: 'Tipo' },
  { key: 'Lead.cycle.cycle', label: 'Ciclo' },
  { key: 'Lead.scholarship', label: 'Beca' },
  { key: 'Channel.name', label: 'Canal' },
  { key: 'Promotion.name', label: 'Promoción' },
  { key: 'List.noLista', label: 'Lista' },
  { key: 'Lead.information.enrollmentStatus', label: 'Status' },
]);

const getValueFromPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

const applyAllFrontFilters = () => {
  enrollments.value = originalEnrollments.value.filter((enrollment) => {
    return Object.entries(filters.value).every(([field, selected]) => {
      const val = getValueFromPath(enrollment, field);
      const value = val !== undefined && val !== null && val !== '' ? val : '(Vacías)';
      return selected.includes(value);
    });
  });
};

const handleHeaderFilter = ({ key, value }) => {
  filters.value[key] = value;
  localStorage.setItem('admin-enrollment-filters', JSON.stringify(filters.value));
    regenerateAppliedFilters(); // 🔁
  const labelTitle = filterTypes.value.find(f => f.key === key)?.label || key;
  const existing = appliedFilters.value.find((f) => f.type === key);
  if (existing) {
    existing.label = `${labelTitle}: ${value.join(', ')}`;
  } else {
    appliedFilters.value.push({ type: key, label: `${labelTitle}: ${value.join(', ')}` });
  }
  applyAllFrontFilters();
};

const clearFilters = () => {
  filters.value = {};
  appliedFilters.value = [];
  localStorage.removeItem('admin-enrollment-filters');
  enrollments.value = [...originalEnrollments.value];
};

const removeFilter = (type) => {
  delete filters.value[type];
  appliedFilters.value = appliedFilters.value.filter((f) => f.type !== type);
  localStorage.setItem('admin-enrollment-filters', JSON.stringify(filters.value));
  applyAllFrontFilters();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  localStorage.setItem('admin-enrollment-page', page);
};

const handleSearch = async () => {
  localStorage.setItem('admin-enrollment-search', searchQuery.value);
  if (!searchQuery.value.trim()) {
    enrollments.value = [...originalEnrollments.value];
    return;
  }
  enrollments.value = originalEnrollments.value.filter((e) => {
    const name = e?.Lead?.information?.name?.toLowerCase() || '';
    const phone = (e?.Lead?.phones?.[0] || '').toLowerCase();
    return name.includes(searchQuery.value.toLowerCase()) || phone.includes(searchQuery.value.toLowerCase());
  });
};

const fetchEnrollments = async () => {
  try {
    const { data } = await enrollmentService.getAll();
    const results = await Promise.all(
      data.data.map(async (enrollment) => {
        const { data: leadData } = await leadService.getById(enrollment.leadId);
        return {
          ...enrollment,
          Lead: {
            ...leadData.data,
            phones: leadData.data.phones,
            emails: leadData.data.emails,
            address: leadData.data.address,
            information: leadData.data.information,
            asetName: leadData.data.asetName,
            campaign: leadData.data.campaign,
            cycle: leadData.data.cycle,
            promoter: leadData.data.promoter || leadData.data.user || null,
          }
        };
      })
    );
    enrollments.value = results;
    originalEnrollments.value = results;
    filterOptions.value = {
  List: [...new Map(results.map(e => [e.List?.id, e.List])).values()].filter(Boolean)
};

    applyAllFrontFilters();
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
  }
};

const toggleDropdown = (id) => {
  dropdowns.value = {
    ...dropdowns.value,
    [id]: !dropdowns.value[id],
  };
};

const getLastModifiedClass = (updatedAt, followUpName) => {
  if (!updatedAt) return '';
  const days = Math.floor((new Date() - new Date(updatedAt)) / (1000 * 60 * 60 * 24));
  if (!followUpName || followUpName === 'Sin información') {
    if (days === 2) return 'bg-green-100 text-green-900';
    if (days === 3) return 'bg-yellow-100 text-yellow-900';
    if (days >= 4) return 'bg-red-100 text-red-900';
  }
  return '';
};

const goToEdit = (id) => {
  router.push({ name: 'admin/editEnrollment', params: { id } });
};

const goToShow = (id) => {
  router.push({ name: 'admin/showEnrollment', params: { id } });
};

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

const regenerateAppliedFilters = () => {
  appliedFilters.value = [];

  for (const key in filters.value) {
    const value = filters.value[key];
    if (value?.length) {
      const labelTitle = filterTypes.value.find(f => f.key === key)?.label || key;
      appliedFilters.value.push({
        type: key,
        label: `${labelTitle}: ${value.join(', ')}`
      });
    }
  }
};


onMounted(() => {
  fetchEnrollments();
    regenerateAppliedFilters();
});
</script>
<template>
  <section class="flex flex-wrap items-center justify-between mb-6 gap-4">
    <!-- Botones de navegación -->
    <div class="flex flex-wrap gap-4">
      <Button name="admin/enrollments/promotions" actionLabel="Promociones de" label="inscripción" icon="bi bi-badge-ad-fill" borderColor="border-gray-600" background="bg-gray-600" height="h-12" width="w-56" />
      <Button name="admin/enrollments/lists" actionLabel="Lista de" label="comisiones" icon="bi bi-journals" borderColor="border-gray-600" background="bg-gray-600" height="h-12" width="w-[178px]" />
      <Button name="admin/enrollments/channels" actionLabel="Canal de" label="venta" icon="bi bi-clipboard2-data-fill" borderColor="border-gray-600" background="bg-gray-600" height="h-12" />
    </div>

    <!-- Buscar + Descargar -->
    <div class="flex gap-3">
      <input v-model="searchQuery" @input="handleSearch" placeholder="Buscar por nombre o teléfono..." class="input input-bordered w-80" />
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

  <!-- Filtros activos -->
<div v-if="appliedFilters.length" class="flex flex-wrap gap-2 mb-4">
  <span
    v-for="filter in appliedFilters"
    :key="filter.type"
    class="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-gray-200 border border-gray-400"
  >
    {{ filter.label }}
    <button @click="removeFilter(filter.type)" class="ml-2 text-black hover:text-red-500">
      <i class="bi bi-x-lg"></i>
    </button>
  </span>
  <button
    @click="clearFilters"
    class="ml-4 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
  >
    Eliminar filtros
  </button>
</div>


  <!-- Tabla de inscripciones -->
<section class="overflow-x-auto w-full border border-gray-300 rounded-xl scrollbar-thin">
  <div class="max-h-[70vh] overflow-y-auto">
    <Table class="min-w-[1800px]">
      <template #header>
        <TableRow>
          <TableHeaderCell>Fecha de Inscripción</TableHeaderCell>
          <TableHeaderCell>Promotor<ColumnFilter field="Lead.promoter.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Nombre<br /><small>(+ teléfono)</small></TableHeaderCell>
          <TableHeaderCell>Seguimiento<ColumnFilter field="Lead.information.followUp.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Medio<ColumnFilter field="Lead.asetName.contactType" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Asset<ColumnFilter field="Lead.asetName.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Campaña<ColumnFilter field="Lead.campaign.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>País<ColumnFilter field="Lead.address.country.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Estado<ColumnFilter field="Lead.address.state" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Ciudad<ColumnFilter field="Lead.address.city" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Programa<ColumnFilter field="Career.program" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Escuela<ColumnFilter field="Lead.information.formerSchool" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Tipo<ColumnFilter field="Lead.information.typeSchool" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Ciclo<ColumnFilter field="Lead.cycle.cycle" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Beca<ColumnFilter field="Lead.scholarship" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Canal<ColumnFilter field="Channel.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Promoción<ColumnFilter field="Promotion.name" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Lista<ColumnFilter field="List.noLista" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Status<ColumnFilter field="Lead.information.enrollmentStatus" :leads="enrollments" @filter-applied="handleHeaderFilter" /></TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>

      <template #content>
        <TableRow
          v-for="enrollment in enrollments"
          :key="enrollment.id"
          :customClass="getLastModifiedClass(enrollment.Lead?.updateAt, enrollment.Lead?.information?.followUp?.name)"
        >
          <TableDataCell>{{ new Date(enrollment.createAt).toLocaleDateString() }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.promoter?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>
            {{ enrollment.Lead?.information?.name || 'Sin info' }}<br />
            <small class="text-gray-500">{{ enrollment.Lead?.phones?.[0] || 'Sin teléfono' }}</small>
          </TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.information?.followUp?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.asetName?.contactType || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.asetName?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.campaign?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.address?.country?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.address?.state || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.address?.city || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Career?.program || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.information?.formerSchool || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.information?.typeSchool || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.cycle?.cycle || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.scholarship || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Channel?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Promotion?.name || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.List?.noLista || 'Sin info' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.information?.enrollmentStatus || 'Sin info' }}</TableDataCell>
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
  </div>
  </section>
  <!-- Mensaje de no resultados -->
  <div v-if="enrollments.length === 0" class="text-center mt-8">
    <p class="text-gray-500">No se encontraron inscripciones.</p>
  </div>

  <!-- Mensaje de total de inscripciones -->
  <p class="text-sm text-gray-600 mb-2 mt-8 text-center font-semibold   ">
  Mostrando <strong>{{ enrollments.length }}</strong> inscripciones
</p>


      <!-- <div class="flex justify-center mt-2 mb-8">
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
    </div> -->

  <!-- Modal descarga por lista -->
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
</template>
