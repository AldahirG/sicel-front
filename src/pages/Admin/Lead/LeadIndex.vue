<script setup>
import { ref, onMounted, computed } from 'vue';
import lead from '../../../services/lead.service';

import Button from '../../../components/Button.vue';
import Pagination from '../../../components/Pagination.vue';
import TableRow from '../../../components/TableRow.vue';
import TableHeaderCell from '../../../components/TableHeaderCell.vue';
import TableDataCell from '../../../components/TableDataCell.vue';
import Table from '../../../components/Table.vue';
import ColumnFilter from '../../../components/ColumnFilter.vue';

const leads = ref([]);
const leadsOriginal = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const filters = ref({});
const appliedFilters = ref([]);
const dropdowns = ref({});

const filterTypes = ref([
  { key: 'cycleId', label: 'Ciclo' },
  { key: 'followUp', label: 'Seguimiento' },
  { key: 'asetnameId', label: 'Asset Name' },
  { key: 'countryId', label: 'País' },
  { key: 'gradeId', label: 'Grado Escolar' },
  { key: 'careerId', label: 'Carrera de Interés' },
  { key: 'medioContacto', label: 'Medio de Contacto' },
  { key: 'cityId', label: 'Ciudad' },
  { key: 'stateId', label: 'Estado' },
  { key: 'campaignId', label: 'Campaña' },
  { key: 'promoterId', label: 'Promotor' },
]);

const options = ref({});

const fetchLeads = async () => {
  try {
    const { data } = await lead.getAll(currentPage.value, { paginated: true, 'per-page': 80 });
    leadsOriginal.value = [...data.data];
    leads.value = [...data.data];
    totalPages.value = data.meta.totalPages;
  } catch (error) {
    console.error('Error al obtener leads:', error);
  }
};

const fetchFilterOptions = async () => {
  try {
    for (const filter of filterTypes.value) {
      const { data } = await lead.getFilterOptions(filter.key);
      options.value[filter.key] = data.map((option) => ({
        label: option.name || option,
        value: option.id || option,
      }));
    }
  } catch (error) {
    console.error('Error al obtener opciones de filtros:', error);
  }
};

function getValueFromPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

const applyAllFrontFilters = () => {
  leads.value = leadsOriginal.value.filter((lead) => {
    return Object.entries(filters.value).every(([field, selected]) => {
      const val = getValueFromPath(lead, field);
      const value = val !== undefined && val !== null && val !== '' ? val : '(Vacías)';
      return selected.includes(value);
    });
  });
};

const handleHeaderFilter = ({ key, value }) => {
  filters.value[key] = value;
  const labelTitle = filterTypes.value.find(f => f.key === key || key.includes(f.key))?.label || key;
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
  leads.value = [...leadsOriginal.value];
};

const removeFilter = (type) => {
  delete filters.value[type];
  appliedFilters.value = appliedFilters.value.filter((f) => f.type !== type);
  applyAllFrontFilters();
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    leads.value = [...leadsOriginal.value];
    return;
  }
  try {
    const { data } = await lead.getSearchByPhoneOrName(searchQuery.value);
    leads.value = data.data;
  } catch (error) {
    console.error('Error en búsqueda:', error);
  }
};

const sortedFilterOptions = computed(() => {
  const current = options.value[selectedFilterType.value] || [];
  return [...new Set(current)].sort((a, b) => a.label.localeCompare(b.label));
});

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchLeads();
};

const getBadgeClass = (type) => {
  switch (type) {
    case 'followUp': return 'bg-blue-100 text-blue-800 border border-blue-400';
    case 'asetnameId': return 'bg-green-100 text-green-800 border border-green-400';
    case 'campaignId': return 'bg-yellow-100 text-yellow-800 border border-yellow-400';
    case 'cycleId': return 'bg-purple-100 text-purple-800 border border-purple-400';
    case 'countryId': return 'bg-pink-100 text-pink-800 border border-pink-400';
    case 'stateId': return 'bg-gray-100 text-gray-800 border border-gray-400';
    case 'cityId': return 'bg-red-100 text-red-800 border border-red-400';
    default: return 'bg-indigo-100 text-indigo-800 border border-indigo-400';
  }
};

const getLastModifiedClass = (updatedAt, followUpName) => {
  if (!updatedAt) return '';

  const days = Math.floor((new Date() - new Date(updatedAt)) / (1000 * 60 * 60 * 24));

  // Si no tiene seguimiento o dice "Sin información", evaluamos el color
  if (!followUpName || followUpName === 'Sin información') {
 if (days === 2) return 'bg-green-100 text-green-900';     // Verde suave
if (days === 3) return 'bg-yellow-100 text-yellow-900';   // Amarillo claro
if (days >= 4) return 'bg-red-100 text-red-900';          // Rojo tenue

  }

  return '';
};

const toggleDropdown = (id) => {
  dropdowns.value = {
    ...dropdowns.value,
    [id]: !dropdowns.value[id],
  };
};

onMounted(() => {
  fetchLeads();
  fetchFilterOptions();
});
</script>
<template>
  <!-- Sección de búsqueda y botones -->
  <section class="flex items-end justify-end mb-6 gap-3">
    <!-- Búsqueda -->
    <div class="relative w-full max-w-xl mx-auto bg-white rounded-full">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Buscar por nombre o teléfono..."
        class="rounded-full w-full h-16 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-teal-200 focus:border-teal-200"
      />
      <button
        disabled
        class="absolute inline-flex items-center h-10 px-4 py-2 text-sm text-white rounded-full outline-none right-3 top-3 bg-gray-300 cursor-not-allowed"
      >
        <svg class="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Buscar
      </button>
    </div>

    <!-- Botones adicionales -->
    <Button name="uploadLead" actionLabel="Subir" label="CSV" width="w-32" icon="bi bi-filetype-csv" background="bg-[#4f6d7a]" borderColor="border-[#4f6d7a]" />
    <Button name="createLead" label="Lead" width="w-32" />
  </section>

  <!-- Filtros aplicados -->
  <div v-if="appliedFilters.length" class="flex flex-wrap gap-2 mb-4">
    <span
      v-for="filter in appliedFilters"
      :key="filter.type"
      :class="`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getBadgeClass(filter.type)}`"
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

  <!-- Tabla -->
  <div class="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <Table>
      <template #header>
        <TableRow>
          <TableHeaderCell>✓</TableHeaderCell>
          <TableHeaderCell>
            Promotor Asignado
            <ColumnFilter field="promoter.name" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Nombre Completo
          </TableHeaderCell>
          <TableHeaderCell>
            Género
            <ColumnFilter field="information.genre" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Seguimiento
            <ColumnFilter field="information.followUp.name" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Carrera
            <ColumnFilter field="information.careerInterest" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Grado Escolar
            <ColumnFilter field="grade.name" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>Teléfono</TableHeaderCell>
          <TableHeaderCell>Correo Electrónico</TableHeaderCell>
          <TableHeaderCell>
            Medio
            <ColumnFilter field="asetName.contactType" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Asset
            <ColumnFilter field="asetName.name" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Campaña
            <ColumnFilter field="campaign.name" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            País
            <ColumnFilter field="address.country.name" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Estado
            <ColumnFilter field="address.state" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Ciudad
            <ColumnFilter field="address.city" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>
            Beca
            <ColumnFilter field="scholarship" :leads="leads" @filter-applied="handleHeaderFilter" />
          </TableHeaderCell>
          <TableHeaderCell>Última modificación</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>

      <template #content>
      <TableRow
         v-for="lead in leads"
          :key="lead.id"
          :customClass="getLastModifiedClass(lead.updateAt, lead.information?.followUp?.name)"
        >
          <TableDataCell><input type="checkbox" class="checkbox" /></TableDataCell>
          <TableDataCell>{{ lead.promoter?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.information?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.information?.genre || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.information?.followUp?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.information?.careerInterest || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.grade?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.phones?.join(', ') || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.emails?.[0] || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.asetName?.contactType || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.asetName?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.campaign?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.address?.country?.name || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.address?.state || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.address?.city || 'Sin información' }}</TableDataCell>
          <TableDataCell>{{ lead.scholarship || 'Sin información' }}</TableDataCell>
          <TableDataCell>
            <relative-time no-title format="relative" tense="past" :datetime="lead.updateAt">
              Fecha de actualización
            </relative-time>
          </TableDataCell>
          <TableDataCell>
            <div class="relative inline-block">
              <button
                @click="toggleDropdown(lead.id)"
                class="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded-md"
              >
                <i class="bi bi-three-dots"></i>
              </button>
              <div
                v-if="dropdowns[lead.id]"
                class="dropdown-menu absolute bg-white shadow-lg rounded-md border border-gray-300 flex flex-col"
                :style="{ top: '100%', right: '0', minWidth: '160px', zIndex: 1050 }"
              >
                <router-link
                  :to="{ path: '/admin/leads/' + lead.id + '/assignment' }"
                  class="block px-4 py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-t-md"
                >
                  <i class="bi bi-person-plus-fill mr-2"></i>Asignar
                </router-link>
                <router-link
                  :to="{ path: '/admin/leads/' + lead.id + '/show' }"
                  class="block px-4 py-2 text-white bg-blue-500 hover:bg-blue-600"
                >
                  <i class="bi bi-eye-fill mr-2"></i>Mostrar
                </router-link>
                <router-link
                  :to="{ path: '/admin/leads/' + lead.id + '/edit' }"
                  class="block px-4 py-2 text-black bg-amber-400 hover:bg-amber-500"
                >
                  <i class="bi bi-pencil-square mr-2"></i>Editar
                </router-link>
                <button
                  @click="confirmDelete(lead.id)"
                  class="block w-full text-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-b-md"
                >
                  <i class="bi bi-trash3-fill mr-2"></i>Eliminar
                </button>
              </div>
            </div>
          </TableDataCell>
        </TableRow>
      </template>
    </Table>
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
  position: relative;
}

.dropdown-menu {
  min-width: 180px;
  max-height: none;
  overflow: visible;
  white-space: nowrap;
  z-index: 1050;
  box-shadow: 0 4px 8px rgba(94, 137, 255, 0.2);
}

.table-container {
  position: relative;
  overflow: visible;
}
</style>
