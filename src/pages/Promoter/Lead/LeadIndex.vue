<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../../store/auth";
import lead from "../../../services/lead.service";

import Button from "../../../components/Button.vue";
import Pagination from "../../../components/Pagination.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
import Table from "../../../components/Table.vue";

const authStore = useAuthStore();
const authUser = authStore.authUser;
const userId = authUser.id;

const leads = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const showFilterModal = ref(false);
const selectedFilterType = ref("");
const selectedFilterValue = ref("");
const filters = ref({});
const appliedFilters = ref([]); // Filtros aplicados con tipo y nombre legible

const filterTypes = ref([
    { key: "followUp", label: "Seguimiento" },
    { key: "asetnameId", label: "Asset Name" },
    { key: "campaignId", label: "Campaña" },
    { key: "cycleId", label: "Ciclo" },
    { key: "countryId", label: "País" },
    { key: "stateId", label: "Estado" },
    { key: "cityId", label: "Ciudad" },
]);
const options = ref({});

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

const fetchLeads = async (page = 1) => {
    try {
        const { data } = await lead.leads_promoter(userId, page);
        leads.value = data.data;
        currentPage.value = data.meta.currentPage;
        totalPages.value = data.meta.totalPages;
    } catch (error) {
        console.error("Error al obtener leads:", error.message);
    }
};

const fetchFilteredLeads = async (filtersToApply = {}) => {
    try {
        const params = { ...filtersToApply };
        console.log("Filters being sent to backend: ", params);

        const { data } = await lead.getFilteredLeadsByUser(params, userId);

        if (data && Array.isArray(data.data)) {
            leads.value = data.data;
            currentPage.value = 1;
            totalPages.value = data.meta?.totalRecords
                ? Math.ceil(data.meta.totalRecords / 10)
                : 1;
        } else {
            console.error("La estructura de datos del backend no es válida.");
        }
    } catch (error) {
        console.error("Error al obtener leads filtrados:", error.message);
    }
};

const applyFilter = () => {
    if (selectedFilterType.value && selectedFilterValue.value) {
        // Obtener el nombre del filtro seleccionado
        const filterName = filterTypes.value.find(
            (f) => f.key === selectedFilterType.value
        )?.label;

        if (selectedFilterType.value === "followUp") {
            // Caso especial para 'followUp', enviamos el nombre directamente
            const selectedOption = options.value.followUp.find(
                (option) => option.value === selectedFilterValue.value
            );
            if (selectedOption) {
                filters.value.followUp = selectedOption.label; // Asignar el nombre
                // Verificar si el filtro ya existe en appliedFilters y actualizarlo
                const existingFilter = appliedFilters.value.find(
                    (f) => f.type === "followUp"
                );
                if (existingFilter) {
                    existingFilter.label = `${filterName}: ${selectedOption.label}`;
                } else {
                    appliedFilters.value.push({
                        type: "followUp",
                        label: `${filterName}: ${selectedOption.label}`,
                    });
                }
            }
        } else {
            // Otros filtros, enviar ID y mostrar nombre en los badges
            const selectedOption = options.value[selectedFilterType.value]?.find(
                (option) => option.value === selectedFilterValue.value
            );
            if (selectedOption) {
                filters.value[selectedFilterType.value] = selectedFilterValue.value; // Mantener el ID
                const existingFilter = appliedFilters.value.find(
                    (f) => f.type === selectedFilterType.value
                );
                if (existingFilter) {
                    existingFilter.label = `${filterName}: ${selectedOption.label}`;
                } else {
                    appliedFilters.value.push({
                        type: selectedFilterType.value,
                        label: `${filterName}: ${selectedOption.label}`,
                    });
                }
            }
        }
    }

    // Cerrar el modal y actualizar los datos filtrados
    showFilterModal.value = false;
    fetchFilteredLeads(filters.value);
};


const clearFilters = () => {
    filters.value = {};
    appliedFilters.value = [];
    fetchLeads();
};

const removeFilter = (type) => {
    delete filters.value[type];
    appliedFilters.value = appliedFilters.value.filter((f) => f.type !== type);
    fetchFilteredLeads(filters.value);
};

const getBadgeClass = (type) => {
    switch (type) {
        case "followUp":
            return "bg-blue-100 text-blue-800 border border-blue-400";
        case "asetnameId":
            return "bg-green-100 text-green-800 border border-green-400";
        case "campaignId":
            return "bg-yellow-100 text-yellow-800 border border-yellow-400";
        case "cycleId":
            return "bg-purple-100 text-purple-800 border border-purple-400";
        case "countryId":
            return "bg-pink-100 text-pink-800 border border-pink-400";
        case "stateId":
            return "bg-gray-100 text-gray-800 border border-gray-400";
        case "cityId":
            return "bg-red-100 text-red-800 border border-red-400";
        default:
            return "bg-indigo-100 text-indigo-800 border border-indigo-400";
    }
};

onMounted(() => {
    fetchLeads();
    fetchFilterOptions();
});
</script>

<template>
    <section>
        <!-- Contenedor para botones e información de filtros -->
        <div class="flex justify-between items-center mb-4">
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
                <div v-if="appliedFilters.length > 0" class="flex items-center flex-wrap gap-2">
                    <span
                        v-for="(filter, index) in appliedFilters"
                        :key="index"
                        :class="[
                            'inline-flex items-center px-2 py-1 text-sm font-medium rounded',
                            getBadgeClass(filter.type)
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

            <!-- Botón para abrir el modal de filtros -->
            <button
                @click="showFilterModal = true"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
                Aplicar Filtros
            </button>
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

        <!-- Tabla de leads -->
        <Table>
            <template #header>
                <TableRow>
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
                    <TableHeaderCell>Aset Name</TableHeaderCell>
                    <TableHeaderCell>Campaña</TableHeaderCell>
                    <TableHeaderCell>País</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell>Ciudad</TableHeaderCell>
                    <TableHeaderCell>Ciclo</TableHeaderCell>
                    <TableHeaderCell>Tipo de referido</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>

            <template #content>
                <TableRow v-for="lead in leads" :key="lead.id">
                    <TableDataCell>{{ lead.information.name }}</TableDataCell>
                    <TableDataCell>{{ lead.information.followUp?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.enrollmentStatus }}</TableDataCell>
                    <TableDataCell>{{ lead.phones[0] }}</TableDataCell>
                    <TableDataCell>{{ lead.emails[0] }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.careerInterest }}</TableDataCell>
                    <TableDataCell>{{ lead.grade?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.formerSchool }}</TableDataCell>
                    <TableDataCell>{{ lead.information?.typeSchool }}</TableDataCell>
                    <TableDataCell></TableDataCell>
                    <TableDataCell>{{ lead.asetName?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.campaign?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.address?.country?.name }}</TableDataCell>
                    <TableDataCell>{{ lead.address?.state }}</TableDataCell>
                    <TableDataCell>{{ lead.address?.city }}</TableDataCell>
                    <TableDataCell>{{ lead.cycle?.cycle }}</TableDataCell>
                    <TableDataCell>{{ lead.reference?.type }}</TableDataCell>
                    <TableDataCell class="flex flex-col gap-2 text-center">
                        <router-link 
                            title="Mostrar datos"
                            :to="{ path: '/promoter/leads/' + lead.id + '/show'}"
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
                </TableRow>
            </template>
        </Table>

        <!-- Paginación -->
        <Pagination 
            :currentPage="currentPage" 
            :totalPages="totalPages" 
            @page-changed="handlePageChange" 
        />
    </section>
</template>
