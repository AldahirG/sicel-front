<script setup>
import { onMounted, ref, watch, computed } from "vue";
import enrollmentService from '../../../services/enrollment.service';
import leadService from '../../../services/lead.service';
import paymentService from '../../../services/payment.service';

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
const perPage = 5000;
const showFilterModal = ref(false);
const selectedFilterType = ref('');
const selectedFilterValue = ref('');
const filterOptions = ref({});
const payments = ref([]);

const filters = ref({});

const filterTypes = [
  { key: 'Career', label: 'Carrera' },
  { key: 'Promotion', label: 'Promoción' },
  { key: 'Channel', label: 'Canal de Venta' },
  { key: 'List', label: 'Lista de Comisión' },
  { key: 'Scholarship', label: 'Beca' }
];

const totalPages = computed(() => Math.ceil(filteredEnrollments.value.length / perPage));
const paginatedEnrollments = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredEnrollments.value.slice(start, start + perPage);
});

const applyFilters = () => {
  filteredEnrollments.value = allEnrollments.value.filter(e => {
    return Object.entries(filters.value).every(([key, value]) => {
      if (!value) return true;
      if (key === 'Scholarship') return e.Lead?.scholarship === value;
      return e[key]?.id === value;
    });
  });
  currentPage.value = 1;
};

watch(filters, applyFilters, { deep: true });

// Traer todas las páginas de pagos
const fetchAllPayments = async () => {
  const all = [];
  const PER_PAGE = 100;
  let page = 1;

  // mientras la API devuelva exactamente PER_PAGE, asumimos que hay más
  // (si tu API devuelve metadatos de paginación, puedes usar eso en vez de la longitud)
  /* eslint-disable no-constant-condition */
  while (true) {
    const res = await paymentService.getAll(page);
    const chunk = res?.data?.data || [];
    all.push(...chunk);
    if (chunk.length < PER_PAGE) break;
    page += 1;
  }
  return all;
};


// ✅ Traer inscripciones y pagos
const fetchEnrollments = async () => {
  try {
    // 1) Inscripciones (igual que ya lo tienes)
    const { data } = await enrollmentService.getByUser();
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
          }
        };
      })
    );

    // 2) Pagos (todas las páginas)
    const allPays = await fetchAllPayments();

    // 3) Set rápido por enrollmentId (si hay *cualquier* pago, pintamos)
    const paidIds = new Set(allPays.map(p => p.enrollmentId));

    // 4) Marca de pago
    allEnrollments.value = allEnrollments.value.map(enr => ({
      ...enr,
      hasPayment: paidIds.has(enr.id),
    }));

    // 5) Opciones de filtros (igual)
    filterOptions.value = {
      Career: [...new Map(allEnrollments.value.map(e => [e.Career?.id, e.Career])).values()].filter(Boolean),
      Promotion: [...new Map(allEnrollments.value.map(e => [e.Promotion?.id, e.Promotion])).values()].filter(Boolean),
      Channel: [...new Map(allEnrollments.value.map(e => [e.Channel?.id, e.Channel])).values()].filter(Boolean),
      List: [...new Map(allEnrollments.value.map(e => [e.List?.id, e.List])).values()].filter(Boolean),
      Scholarship: [...new Set(allEnrollments.value.map(e => e.Lead?.scholarship))].filter(Boolean)
    };

    applyFilters();
  } catch (error) {
    console.error("Error al obtener inscripciones o pagos:", error);
  }
};

const openFilterModal = () => showFilterModal.value = true;

const applySelectedFilter = () => {
  if (selectedFilterType.value && selectedFilterValue.value) {
    filters.value[selectedFilterType.value] = selectedFilterValue.value;
  }
  showFilterModal.value = false;
  selectedFilterType.value = '';
  selectedFilterValue.value = '';
};

const goToEdit = (id) => router.push({ name: 'promoter/editEnrollment', params: { id } });
const goToShow = (id) => router.push({ name: 'promoter/showEnrollment', params: { id } });



onMounted(() => fetchEnrollments());
</script>

<template>
  <section class="flex items-center justify-between mb-6 gap-4">
    <button @click="openFilterModal" class="btn btn-primary">
      <i class="bi bi-funnel-fill mr-2"></i> Filtrar
    </button>
  </section>

  <!-- Modal de filtros -->
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
        <select v-if="selectedFilterType && selectedFilterType !== 'Scholarship'" v-model="selectedFilterValue" class="input w-full">
          <option disabled value="">Seleccione un valor</option>
          <option
            v-for="option in filterOptions[selectedFilterType]"
            :key="option?.id"
            :value="option?.id"
          >
            {{ option?.name || option?.program || option?.noLista }}
          </option>
        </select>
        <select v-else-if="selectedFilterType === 'Scholarship'" v-model="selectedFilterValue" class="input w-full">
          <option disabled value="">Seleccione una beca</option>
          <option v-for="sch in filterOptions.Scholarship" :key="sch" :value="sch">{{ sch }}</option>
        </select>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <button @click="showFilterModal = false" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
          <i class="bi bi-x-circle-fill mr-1"></i> Cancelar
        </button>
        <button @click="applySelectedFilter" class="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded">
          <i class="bi bi-check-circle-fill mr-1"></i> Aplicar
        </button>
      </div>
    </template>
  </Modal>

  <!-- Tabla de inscripciones -->
  <section>
    <Table>
      <template #header>
        <TableRow>
          <TableHeaderCell>Fecha de inscripción</TableHeaderCell>
          <TableHeaderCell>Nombre</TableHeaderCell>
          <TableHeaderCell>Carrera</TableHeaderCell>
          <TableHeaderCell>Promoción</TableHeaderCell>
          <TableHeaderCell>Canal</TableHeaderCell>
          <TableHeaderCell>Beca</TableHeaderCell>
          <TableHeaderCell>Lista</TableHeaderCell>
          <TableHeaderCell>Folio</TableHeaderCell>
          <TableHeaderCell>Matrícula</TableHeaderCell>
          <TableHeaderCell>CURP</TableHeaderCell>
          <TableHeaderCell>Programa</TableHeaderCell>
          <TableHeaderCell>Interno/Externo</TableHeaderCell>
          <TableHeaderCell>Comentarios</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </TableRow>
      </template>
      <template #content>
        <TableRow
          v-for="enrollment in paginatedEnrollments"
          :key="enrollment.id"
          :class="enrollment.hasPayment ? 'bg-green-100' : ''"
        >
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
          <TableDataCell>{{ enrollment.enrollment_folio || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.matricula || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.curp || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.program || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.Lead?.intern || 'N/A' }}</TableDataCell>
          <TableDataCell>{{ enrollment.comments || 'N/A' }}</TableDataCell>
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

    <p class="mt-8 text-black-600 text-center font-bold">
      Total de inscripciones: {{ filteredEnrollments.length }}
    </p>

    <div class="flex justify-center mt-6">
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="(page) => currentPage.value = page"
      />
    </div>
  </section>
</template>
