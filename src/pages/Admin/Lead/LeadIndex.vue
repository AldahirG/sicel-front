<script>
import { onMounted, ref } from "vue";
import lead from "../../../services/lead.service";

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from "../../../components/Table.vue";

export default {
  setup() {
    const leads = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const showFilterModal = ref(false);
    const selectedFilterType = ref("");
    const selectedFilterValue = ref("");

    // Tipos de filtros disponibles con claves y etiquetas
    const filterTypes = ref([
      { key: "cycleId", label: "Ciclo" },
      { key: "followUp", label: "Seguimiento" },
      { key: "asetnameId", label: "Asset Name" },
      { key: "countryId", label: "País" },
      { key: "gradeId", label: "Grado Escolar" },
      { key: "careerId", label: "Carrera de Interés" },
      { key: "medioContacto", label: "Medio de Contacto" },
      { key: "cityId", label: "Ciudad" },
      { key: "stateId", label: "Estado" },
      { key: "campaignId", label: "Campaña" },
      { key: "promoterId", label: "Promotor" },
    ]);

    // Campos que deben enviar nombres (string) en lugar de UUIDs
    const stringFields = ["followUp", "medioContacto"];

    const options = ref({});
    const filters = ref({});

    // Cargar las opciones de filtros desde el backend
    const fetchFilterOptions = async () => {
      try {
        for (const filter of filterTypes.value) {
          const { data } = await lead.getFilterOptions(filter.key);
          options.value[filter.key] = data.map((option) => ({
            label: option.name || option, // Nombre visible (string)
            value: option.id || option, // UUID o identificador único
          }));
        }
      } catch (error) {
        console.error("Error al obtener opciones de los filtros:", error.message);
      }
    };

    // Aplicar el filtro seleccionado
    const applyFilter = () => {
  if (selectedFilterType.value && selectedFilterValue.value) {
    // Verificar si el campo es de tipo string
    if (stringFields.includes(selectedFilterType.value)) {
      filters.value[selectedFilterType.value] = options.value[selectedFilterType.value].find(
        (option) => option.value === selectedFilterValue.value
      ).label; // Enviar el nombre (string)
    } else {
      filters.value[selectedFilterType.value] = selectedFilterValue.value; // Enviar el UUID
    }
  }

  showFilterModal.value = false; // Cerrar el modal

  // Llamar a la función para aplicar filtros
  fetchFilteredLeads(filters.value); 
};


    // Obtener todos los leads
    const fetchLeads = async (page = 1) => {
      try {
        const params = {
          paginated: true,
          "per-page": 10,
          page,
        };
        const { data } = await lead.getAll(page, params);
        leads.value = data.data;
        currentPage.value = data.meta.currentPage;
        totalPages.value = data.meta.totalPages;
      } catch (error) {
        console.error("Error al obtener leads:", error.message);
      }
    };

    // Obtener leads filtrados
    const fetchFilteredLeads = async (filtersToApply = {}) => {
  try {
    // Solo enviar los filtros, sin parámetros de paginación
    const params = { ...filtersToApply };

    console.log("Filters being sent to backend: ", params); // Log para depuración

    const { data } = await lead.getFilteredLeads(params); // Llama al endpoint de filtros
    leads.value = data.data;

    // Resetea o actualiza la tabla sin preocuparse por la paginación
    currentPage.value = 1; 
    totalPages.value = Math.ceil(data.meta.totalRecords / 10) || 1;
  } catch (error) {
    console.error("Error al obtener leads filtrados:", error.message);
  }
};


    // Manejar el cambio de página
    const handlePageChange = (page) => {
      if (Object.keys(filters.value).length > 0) {
        fetchFilteredLeads(filters.value, page);
      } else {
        fetchLeads(page);
      }
    };

    // Cargar los leads y filtros al montar el componente
    onMounted(() => {
      fetchLeads();
      fetchFilterOptions();
    });

    return {
      leads,
      currentPage,
      totalPages,
      showFilterModal,
      selectedFilterType,
      selectedFilterValue,
      filterTypes,
      filters,
      options,
      fetchLeads,
      fetchFilteredLeads,
      handlePageChange,
      applyFilter,
    };
  },
  components: {
    Button,
    TableRow,
    TableHeaderCell,
    TableDataCell,
    Table,
    Pagination,
  },
};
</script>



<template>
  <!-- Sección de botones para subir CSV, crear lead y aplicar filtros -->
  <section class="flex items-end justify-end mb-6 gap-3">
    <Button
      name="uploadLead"
      actionLabel="Subir"
      label="CSV"
      width="w-32"
      icon="bi bi-filetype-csv"
      background="bg-[#4f6d7a]"
      borderColor="border-[#4f6d7a]"
    />

    <Button name="createLead" label="Lead" width="w-32" />

    <!-- Botón para abrir el modal de filtros -->
    <button
  @click="showFilterModal = true"
  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
>
  Aplicar Filtros
</button>

  </section>

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
        <label for="filterType" class="block mb-1 font-medium">Tipo de Filtro</label>
        <select
          id="filterType"
          v-model="selectedFilterType"
          @change="selectedFilterValue = ''"
          class="w-full p-2 border rounded"
        >
          <option disabled value="">Seleccione un tipo</option>
          <option v-for="filter in filterTypes" :key="filter.key" :value="filter.key">
            {{ filter.label }}
          </option>
        </select>
      </div>

      <!-- Selección del valor del filtro -->
      <div class="mb-4">
        <label for="filterValue" class="block mb-1 font-medium">Valor</label>
        <select
          id="filterValue"
          v-model="selectedFilterValue"
          class="w-full p-2 border rounded"
        >
          <option disabled value="">Seleccione un valor</option>
          <option
            v-for="option in options[selectedFilterType] || []"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Botones de acción en el modal -->
      <div class="flex justify-end gap-3">
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

  <!-- Sección de la tabla de leads -->
  <section>
    <Table>
      <template #header>
        <TableRow>
          <TableHeaderCell>check</TableHeaderCell>
          <TableHeaderCell>Estatus asignación</TableHeaderCell>
          <TableHeaderCell>Promotor</TableHeaderCell>
          <TableHeaderCell>Nombre Completo</TableHeaderCell>
          <TableHeaderCell>Seguimiento</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Teléfono</TableHeaderCell>
          <TableHeaderCell>Correo Electrónico</TableHeaderCell>
          <TableHeaderCell>Carrera de interés</TableHeaderCell>
          <TableHeaderCell>Grado escolar</TableHeaderCell>
          <TableHeaderCell>Escuela de procedencia</TableHeaderCell>
          <TableHeaderCell>Tipo de escuela</TableHeaderCell>
          <TableHeaderCell>Medio de contacto</TableHeaderCell>
          <TableHeaderCell>Asset Name</TableHeaderCell>
          <TableHeaderCell>Campaña</TableHeaderCell>
          <TableHeaderCell>País</TableHeaderCell>
          <TableHeaderCell>Estado</TableHeaderCell>
          <TableHeaderCell>Ciudad</TableHeaderCell>
          <TableHeaderCell>Ciclo</TableHeaderCell>
          <TableHeaderCell>Tipo de referido</TableHeaderCell>
          <TableHeaderCell>Última modificación</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>

      <template #content>
        <TableRow v-for="lead in leads" :key="lead.id">
          <TableDataCell>
            <input type="checkbox" class="checkbox" />
          </TableDataCell>
          <TableDataCell></TableDataCell>
          <TableDataCell>{{ lead.promoter?.name }}</TableDataCell>
          <TableDataCell>{{ lead.information?.name }}</TableDataCell>
          <TableDataCell>{{ lead.information?.followUp?.name }}</TableDataCell>
          <TableDataCell>{{ lead.information?.enrollmentStatus }}</TableDataCell>
          <TableDataCell>{{ lead.phones[0] }}</TableDataCell>
          <TableDataCell>{{ lead.emails[0] }}</TableDataCell>
          <TableDataCell>{{ lead.information?.careerInterest }}</TableDataCell>
          <TableDataCell>{{ lead.grade?.name }}</TableDataCell>
          <TableDataCell>{{ lead.information?.formerSchool }}</TableDataCell>
          <TableDataCell>{{ lead.information?.typeSchool }}</TableDataCell>
          <TableDataCell>{{ lead.medioContacto }}</TableDataCell>
          <TableDataCell>{{ lead.assetName?.name }}</TableDataCell>
          <TableDataCell>{{ lead.campaign?.name }}</TableDataCell>
          <TableDataCell>{{ lead.address?.country?.name }}</TableDataCell>
          <TableDataCell>{{ lead.address?.state }}</TableDataCell>
          <TableDataCell>{{ lead.address?.city }}</TableDataCell>
          <TableDataCell>{{ lead.cycle?.cycle }}</TableDataCell>
          <TableDataCell>{{ lead.reference?.type }}</TableDataCell>
          <TableDataCell>
            <relative-time
              no-title
              format="relative"
              tense="past"
              :datetime="lead.updateAt"
            >
              Fecha de actualización
            </relative-time>
          </TableDataCell>
          <TableDataCell class="flex flex-col gap-2 text-center">
            <router-link
              title="Asignar y reasignar promotor"
              :to="{ path: '/admin/leads/' + lead.id + '/assignment' }"
              class="py-2 px-4 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md duration-200"
            >
              <i class="bi bi-person-plus-fill"></i>
            </router-link>

            <router-link
              title="Mostrar datos"
              :to="{ path: '/admin/leads/' + lead.id + '/show' }"
              class="py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md duration-200"
            >
              <i class="bi bi-eye-fill"></i>
            </router-link>

            <router-link
              :to="{ path: '/admin/leads/' + lead.id + '/edit' }"
              class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
            >
              <i class="bi bi-pencil-square"></i>
            </router-link>

            <button
              class="btn bg-red-500 hover:bg-red-600 text-white"
              @click="confirmDelete(lead.id)"
            >
              <i class="bi bi-trash3-fill"></i>
            </button>
          </TableDataCell>
        </TableRow>
      </template>
    </Table>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
  </section>
</template>
