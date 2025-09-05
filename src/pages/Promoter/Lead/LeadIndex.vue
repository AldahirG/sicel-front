<script setup>
/* ---------------------- Imports ---------------------- */
import { onMounted, ref, computed, onBeforeUnmount  } from "vue";
import { useAuthStore } from "../../../store/auth";
import lead from "../../../services/lead.service";
import ColumnFilter from "../../../components/ColumnFilter.vue";
import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from "../../../components/Table.vue";

/* ---------------------- Variables reactivas ---------------------- */
const authStore = useAuthStore();
const authUser = authStore.authUser;
const userId = authUser.id;

const leads = ref([]);
const leadsOriginal = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const showFilterModal = ref(false);
const selectedFilterType = ref("");
const selectedFilterValue = ref("");
const filters = ref({});
const appliedFilters = ref([]);

/* ---------------------- Configuración de filtros ---------------------- */
const filterTypes = ref([
  { key: "followUp", label: "Seguimiento" },
  { key: "asetnameId", label: "Asset Name" },
  { key: "campaignId", label: "Campaña" },
  { key: "cycleId", label: "Ciclo" },
  { key: "countryId", label: "País" },
  { key: "stateId", label: "Estado" },
  { key: "cityId", label: "Ciudad" },
]);

const filterableFields = [
  { key: "createAt", label: "Fecha de creación" },
  { key: "dateContact", label: "Fecha de primer contacto" },
  { key: "information.genre", label: "Género" },
  { key: "information.followUp.name", label: "Seguimiento" },
  { key: "information.enrollmentStatus", label: "Status" },
  { key: "information.careerInterest", label: "Carrera de interés" },
  { key: "grade.name", label: "Grado escolar" },
  { key: "information.formerSchool", label: "Escuela de procedencia" },
  { key: "information.typeSchool", label: "Tipo de escuela" },
  { key: "semester", label: "Semestre de ingreso" },
  { key: "asetName.contactType", label: "Medio de contacto" },
  { key: "asetName.name", label: "Asset Name" },
  { key: "campaign.name", label: "Campaña" },
  { key: "city.state.country.name", label: "País" },
  { key: "city.state.name", label: "Estado" },
  { key: "city.name", label: "Ciudad" },
  { key: "cycle.cycle", label: "Ciclo" },
  { key: "reference.type", label: "Tipo de referido" },
  { key: "reference.name", label: "Nombre de referido" },
];

const options = ref({});

/* ---------------------- Obtener leads ---------------------- */
const fetchLeads = async () => {
  try {
    const { data } = await lead.leads_promoter(userId, currentPage.value);
    console.log(data);
    const ordenados = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    leadsOriginal.value = ordenados;
    leads.value = ordenados;
    totalPages.value = data.meta.totalPages;
  } catch (error) {
    console.error("Error al obtener leads:", error.message);
  }
};

/* ---------------------- Buscar leads por nombre o teléfono ---------------------- */
const handleSearchForUser = async () => {
  const term = searchQuery.value.trim();

  if (term === "") {
    // Si el campo está vacío, reseteamos a la lista original sin filtros
    leads.value = [...leadsOriginal.value];
    return;
  }

  try {
    const { data } = await lead.getSearchByPhoneOrNameForUser(term, userId);
    leads.value = data.data;
  } catch (error) {
    console.error("Error al buscar leads:", error);
  }
};


/* ---------------------- Filtros desde encabezado (frontend) ---------------------- */
const handleHeaderFilter = ({ key, value }) => {
  filters.value[key] = value;
  const existing = appliedFilters.value.find((f) => f.type === key);
  const labelTitle = filterableFields.find(f => f.key === key)?.label || key;

  const values = value.join(", ");
  if (existing) {
    existing.label = `${labelTitle}: ${values}`;
  } else {
    appliedFilters.value.push({
      type: key,
      label: `${labelTitle}: ${values}`,
    });
  }

  applyAllFrontFilters();
  saveLeadViewState(); // ✅ IMPORTANTE
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchLeads(page);
  saveLeadViewState(); // ✅ IMPORTANTE
};


/* ---------------------- Aplicar todos los filtros en frontend ---------------------- */
const applyAllFrontFilters = () => {
  leads.value = leadsOriginal.value.filter((lead) => {
    return Object.entries(filters.value).every(([field, selectedValues]) => {
      const val = getValueFromPath(lead, field);
      const value = val !== undefined && val !== null && val !== "" ? val : "(Vacías)";
      return selectedValues.includes(value);
    });
  });
};

/* ---------------------- Utilidades ---------------------- */
const getValueFromPath = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const getBadgeClass = (type) => {
  switch (type) {
    case "followUp": return "bg-blue-100 text-blue-800 border border-blue-400";
    case "asetnameId": return "bg-green-100 text-green-800 border border-green-400";
    case "campaignId": return "bg-yellow-100 text-yellow-800 border border-yellow-400";
    case "cycleId": return "bg-purple-100 text-purple-800 border border-purple-400";
    case "countryId": return "bg-pink-100 text-pink-800 border border-pink-400";
    case "stateId": return "bg-gray-100 text-gray-800 border border-gray-400";
    case "cityId": return "bg-red-100 text-red-800 border border-red-400";
    default: return "bg-indigo-100 text-indigo-800 border border-indigo-400";
  }
};


const getLastModifiedClass = (updatedAt, followUpName) => {
  if (!updatedAt) return '';

  const now = new Date();
  const updatedDate = new Date(updatedAt);

  // Check if updatedAt is today
  const isToday =
    updatedDate.getDate() === now.getDate() &&
    updatedDate.getMonth() === now.getMonth() &&
    updatedDate.getFullYear() === now.getFullYear();

  if (isToday) {
    // Highlight new leads added today
    return 'bg-teal-100 text-teal-900 border border-teal-400'; // Teal for new
  }

  const days = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));

  // Si no tiene seguimiento o dice "Sin información", evaluamos el color
  if (!followUpName || followUpName === 'Sin información') {
    if (days === 2) return 'bg-green-100 text-green-900';
    if (days === 3) return 'bg-yellow-100 text-yellow-900';
    if (days >= 4) return 'bg-red-100 text-red-900';
  }

  return '';
};



/* ---------------------- Filtros desde modal clásico ---------------------- */
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
    console.error("Error al obtener opciones de los filtros:", error.message);
  }
};

const sortedFilterOptions = computed(() => {
  const current = options.value[selectedFilterType.value] || [];
  return current.filter((option, index, self) =>
    index === self.findIndex((o) => o.value === option.value)
  ).sort((a, b) => a.label.localeCompare(b.label));
});

const applyFilter = () => {
  // Aquí puedes mantener la lógica del modal si decides combinar con los encabezados
};

const formatDate = (iso) => {
  if (!iso) return "(Vacías)";
  const date = new Date(iso);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};



/* ---------------------- Reset de filtros ---------------------- */
const clearFilters = () => {
  filters.value = {};
  appliedFilters.value = [];
  leads.value = [...leadsOriginal.value];
  // Limpiar scroll y filtros guardados
  localStorage.removeItem("leadScrollTop");
  localStorage.removeItem("leadPage");
  localStorage.removeItem("leadFilters");
  localStorage.removeItem("leadAppliedFilters");
};



const removeFilter = (type) => {
  delete filters.value[type];
  appliedFilters.value = appliedFilters.value.filter((f) => f.type !== type);
  applyAllFrontFilters();
};


/* ---------------------- Paginación ---------------------- */
// const handlePageChange = (page) => {
//   currentPage.value = page;
//   fetchLeads(page);
// };

const saveLeadViewState = () => {
  const table = document.querySelector(".scrollbar-thin");
  if (table) localStorage.setItem("leadScrollTop", table.scrollTop.toString());
  localStorage.setItem("leadPage", currentPage.value.toString());
  localStorage.setItem("leadFilters", JSON.stringify(filters.value));
  localStorage.setItem("leadAppliedFilters", JSON.stringify(appliedFilters.value));
};

/* ---------------------- Montaje ---------------------- */
onMounted(() => {
  fetchFilterOptions();

    const savedFilters = localStorage.getItem("leadFilters");
  const savedAppliedFilters = localStorage.getItem("leadAppliedFilters");
  const savedPage = localStorage.getItem("leadPage");

  if (savedFilters && savedAppliedFilters) {
    filters.value = JSON.parse(savedFilters);
    appliedFilters.value = JSON.parse(savedAppliedFilters);
  }
  if (savedPage) {
    currentPage.value = parseInt(savedPage, 10);
  }

fetchLeads(currentPage.value).then(() => {
  applyAllFrontFilters();
  setTimeout(() => {
    const scrollTop = parseInt(localStorage.getItem("leadScrollTop"), 10);
    const table = document.querySelector(".scrollbar-thin");
    if (!isNaN(scrollTop) && table) {
      table.scrollTop = scrollTop;
    }
  }, 3000);
});

});

onBeforeUnmount(() => {
  saveLeadViewState(); // ✅ guarda al salir
});
</script>


<template>
  <section>
    <!-- Contenedor para botones e información de filtros -->
    <div class="flex justify-between items-center mb-4">
      <!-- Botón para buscar leads por nombre o teléfono -->
      <div class="relative w-full max-w-xl mx-auto bg-white rounded-full">
        <input
          v-model="searchQuery"
          @input="handleSearchForUser"
          type="text"
          placeholder="Buscar en mis leads..."
          class="rounded-full w-full h-16 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-teal-200 focus:border-teal-200"
        />

      <button
        disabled
        class="absolute inline-flex items-center h-10 px-4 py-2 text-sm text-white bg-teal-500 opacity-100 cursor-not-allowed rounded-full right-3 top-3 sm:px-6 sm:text-base sm:font-medium"
        title="La búsqueda se realiza automáticamente al escribir"
      >
        <svg
          class="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        Buscar
      </button>

      </div>
      <div class="flex items-center flex-wrap gap-2">
        <!-- Botón para limpiar todos los filtros si hay filtros aplicados -->
        <div v-if="appliedFilters.length > 0">
          <button
            @click="clearFilters"
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Limpiar Filtros
          </button>
        </div>
        <!-- Badges para los filtros aplicados -->
        <div
          v-if="appliedFilters.length > 0"
          class="flex items-center flex-wrap gap-2"
        >
          <span
            v-for="(filter, index) in appliedFilters"
            :key="index"
            :class="[
              'inline-flex items-center px-2 py-1 text-sm font-medium rounded',
              getBadgeClass(filter.type),
            ]"
          >
            {{ filter.label }}
            <button
              type="button"
              @click="removeFilter(filter.type)"
              class="inline-flex items-center p-1 ms-2 text-sm bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>

  <div class="flex gap-3">
    <Button
      name="createLeadPromotor"
      label="Lead"
      width="w-32"
      icon="bi bi-person-plus"
    />
  </div>
      <!-- Botón para abrir el modal de filtros -->
      <!-- <button
        @click="showFilterModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Aplicar Filtros
      </button> -->
    </div>

    <!-- Modal para aplicar filtros -->
    <div
      v-if="showFilterModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h3 class="text-2xl font-semibold mb-4 text-center">Aplicar Filtros</h3>

        <!-- Botón para cerrar el modal -->
        <button
          @click="showFilterModal = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <i class="bi bi-x-circle text-2xl"></i>
        </button>

        <!-- Selección del tipo de filtro -->
        <div class="mb-4">
          <label for="filterType" class="block mb-1 font-medium"
            >Tipo de Filtro</label
          >
          <select
            id="filterType"
            v-model="selectedFilterType"
            @change="selectedFilterValue = ''"
            class="w-full p-2 border rounded"
          >
            <option disabled value="">Seleccione un tipo</option>
            <option
              v-for="filter in filterTypes"
              :key="filter.key"
              :value="filter.key"
            >
              {{ filter.label }}
            </option>
          </select>
        </div>

        <!-- Selección del valor del filtro -->
        <select
          id="filterValue"
          v-model="selectedFilterValue"
          class="w-full p-2 border rounded"
        >
          <option disabled value="">Seleccione un valor</option>
          <option
            v-for="option in sortedFilterOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Botones del modal -->
        <div class="flex justify-end gap-2">
          <button
            @click="showFilterModal = false"
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            @click="applyFilter"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>

<!-- Contenedor con scroll horizontal -->
<div class="w-full overflow-auto max-h-[calc(100vh-280px)] border rounded shadow-inner scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
  <!-- Tabla de leads -->
  <Table class="min-w-[1280px]">
<template #header>
  
  <TableRow>
        <TableHeaderCell>Acciones</TableHeaderCell>

 <TableHeaderCell>
  Fecha de creación
  <template #filter-icon>
    <ColumnFilter field="createdAt" :leads="leads" @filter-applied="handleHeaderFilter" />
  </template>
</TableHeaderCell> 

    <TableHeaderCell>
      Fecha de primer contacto
      <template #filter-icon>
        <ColumnFilter field="dateContact" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>Nombre Completo</TableHeaderCell>
    <TableHeaderCell>
      Género
      <template #filter-icon>
        <ColumnFilter field="information.genre" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Seguimiento
      <template #filter-icon>
        <ColumnFilter field="information.followUp.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Status
      <template #filter-icon>
        <ColumnFilter field="information.enrollmentStatus" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>Teléfono</TableHeaderCell>
    <TableHeaderCell>Correo Electrónico</TableHeaderCell>
    <TableHeaderCell>
      Carrera de interés
      <template #filter-icon>
        <ColumnFilter field="information.careerInterest" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Grado escolar
      <template #filter-icon>
        <ColumnFilter field="grade.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
     <TableHeaderCell>
       Programa
       <template #filter-icon>
         <ColumnFilter field="program" :leads="leads" @filter-applied="handleHeaderFilter" />
       </template>
     </TableHeaderCell>


    <TableHeaderCell>
      Escuela de procedencia
      <template #filter-icon>
        <ColumnFilter field="information.formerSchool" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Tipo de escuela
      <template #filter-icon>
        <ColumnFilter field="information.typeSchool" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Semestre a ingresar
      <template #filter-icon>
        <ColumnFilter field="semester" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Interno/Externo
      <template #filter-icon>
        <ColumnFilter field="intern" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Medio de contacto
      <template #filter-icon>
        <ColumnFilter field="asetName.contactType" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Asset Name
      <template #filter-icon>
        <ColumnFilter field="asetName.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Campaña
      <template #filter-icon>
        <ColumnFilter field="campaign.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      País
      <template #filter-icon>
        <ColumnFilter field="city.state.country.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Estado
      <template #filter-icon>
        <ColumnFilter field="city.state.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Ciudad
      <template #filter-icon>
        <ColumnFilter field="city.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Ciclo
      <template #filter-icon>
        <ColumnFilter field="cycle.cycle" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Tipo de referido
      <template #filter-icon>
        <ColumnFilter field="reference.type" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>
    <TableHeaderCell>
      Nombre de referido
      <template #filter-icon>
        <ColumnFilter field="reference.name" :leads="leads" @filter-applied="handleHeaderFilter" />
      </template>
    </TableHeaderCell>

  </TableRow>
</template>

<template #content>
 <TableRow
         v-for="lead in leads"
          :key="lead.id"
          :customClass="getLastModifiedClass(lead.updateAt, lead.information?.followUp?.name)"
        >
        <TableDataCell class="flex flex-col gap-2 text-center">
      <router-link
        title="Mostrar datos"
        :to="{ path: '/promoter/leads/' + lead.id + '/show' }"
        class="py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md duration-200"
      >
        <i class="bi bi-eye-fill"></i>
      </router-link>
      <router-link
        :to="{ path: '/promoter/leads/' + lead.id + '/edit' }"
        class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
      >
        <i class="bi bi-pencil-square"></i>
      </router-link>
    </TableDataCell>



<TableDataCell>
  {{ lead.createAt ? new Date(lead.createAt).toLocaleDateString() : 'Sin información' }}
</TableDataCell> 

    <TableDataCell>
      {{ lead.dateContact ? new Date(lead.dateContact).toLocaleDateString() : 'Sin información' }}
    </TableDataCell>
    <TableDataCell>{{ lead.information?.name || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.information?.genre || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.information?.followUp?.name || lead.information?.followUpId || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.information?.enrollmentStatus || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.phones?.[0] || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.emails?.[0] || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.information?.careerInterest || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.grade?.name || lead.gradesId || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.program || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.information?.formerSchool || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.information?.typeSchool || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.semester || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.intern || "Sin información" }}</TableDataCell>

    <TableDataCell>{{ lead.asetName?.contactType || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.asetName?.name || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.campaign?.name || lead.campaignId || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.address?.country?.name || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.address?.state || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.address?.city || "Sin información" }}</TableDataCell>

    <TableDataCell>{{ lead.cycle?.cycle || lead.cycleId || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.reference?.type || "Sin información" }}</TableDataCell>
    <TableDataCell>{{ lead.reference?.name || "Sin información" }}</TableDataCell>

  </TableRow>
</template>

  </Table>
</div>

<div class="mt-4 text-sm text-gray-600 font-bold text-center">
  Mostrando {{ leads.length }} datos
</div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="handlePageChange"
    />
  </section>
</template>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 4px;
}

.scrollbar-track-gray-200::-webkit-scrollbar-track {
  background-color: #e5e7eb;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
</style>
