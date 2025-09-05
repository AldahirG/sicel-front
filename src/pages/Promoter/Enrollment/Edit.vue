<template>
  <FormContainer maxWidth="max-w-4xl">
    <div class="text-lg font-semibold mb-4">Editar Inscripción</div>

    <!-- Aviso si tiene pago -->
    <p v-if="hasPayment" class="text-sm text-red-600 mb-4">
      Esta inscripción ya tiene un pago registrado. Los datos no se pueden editar.
    </p>

    <FormKit type="form" :actions="false" @submit="() => handleSubmit()">
      <!-- GRID: 2 columnas en md+ -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Fila 1 -->
        <FormKit type="select" name="careersId" label="Programa"
          :options="careers.map(c => ({ label: c.program, value: c.id }))"
          placeholder="Selecciona un programa" v-model="form.careersId" :disabled="hasPayment" />
        <FormKit type="select" name="promotionId" label="Promoción"
          :options="promotions.map(p => ({ label: p.name, value: p.id }))"
          placeholder="Selecciona una promoción" v-model="form.promotionId" :disabled="hasPayment" />

        <!-- Fila 2 -->
        <FormKit type="select" name="channelId" label="Canal de venta"
          :options="channels.map(c => ({ label: c.name, value: c.id }))"
          placeholder="Selecciona un canal" v-model="form.channelId" :disabled="hasPayment" />
        <FormKit type="select" name="listId" label="Lista de comisión"
          :options="lists.map(l => ({ label: l.noLista, value: l.id }))"
          placeholder="Selecciona una lista" v-model="form.listId" :disabled="hasPayment" />

        <!-- Fila 3 -->
        <FormKit type="text" name="enrollment_folio" label="Recibo de inscripción"
          placeholder="Ej. FO-123" v-model="form.enrollment_folio" :disabled="hasPayment" />
        <FormKit type="text" name="matricula" label="Matrícula"
          placeholder="Número de matrícula" v-model="form.matricula" :disabled="hasPayment" />

        <!-- Fila 4 -->
        <FormKit type="select" name="beca" label="Beca asignada"
          :options="['0','5','10','15','20','25','30','35','40','45','50','55','60','APOYO TRABAJADOR','ORFANDAD','PATRONATO','PRACTICANTE RH']"
          placeholder="Ej. 20" v-model="form.beca" :disabled="hasPayment" />
        <FormKit type="text" name="curp" label="CURP"
          placeholder="CURP del alumno" v-model="form.curp" :disabled="hasPayment" />

        <!-- Fila 5 -->
        <FormKit
          type="select"
          name="comments"
          label="Estrategia"
          :options="strategyOptions"
          placeholder="Selecciona una estrategia"
          v-model="form.comments"
          :disabled="hasPayment"
        />
        <FormKit
          type="date"
          name="enrollmentDate"
          label="Fecha de inscripción"
          v-model="form.createAt"
          :disabled="hasPayment"
        />
      </div>

      <!-- Pago Colegiatura -->
      <div class="mt-6 p-4 rounded-lg shadow border border-gray-200 text-center bg-white">
        <label class="font-semibold text-sm text-gray-700 block">Pago Colegiatura:</label>
        <p class="text-lg mt-1" :class="hasPayment ? 'text-green-600' : 'text-red-600'">
          {{ hasPayment ? 'PAGADO' : 'SIN PAGO' }}
        </p>
        <button
          v-if="!hasPayment"
          type="button"
          class="btn bg-blue-600 hover:bg-blue-700 text-white mt-2"
          @click="showPaymentModal = true"
        >
          Agregar Pago
        </button>
        <button
          v-else
          type="button"
          class="btn bg-green-600 hover:bg-green-700 text-white mt-2"
          @click="handleViewPayment"
        >
          Ver Pago
        </button>
      </div>

      <!-- Botones -->
      <div class="flex justify-between gap-4 mt-6">
        <button type="submit" class="btn bg-green-600 hover:bg-green-700 text-white" :disabled="isSubmitting || hasPayment">
          <i class="bi bi-check2-circle"></i> Guardar cambios
        </button>
        <button type="button" class="btn bg-gray-500 hover:bg-gray-600 text-white" @click="router.back()">
          <i class="bi bi-arrow-left-circle"></i> Cancelar
        </button>
      </div>
    </FormKit>

    <!-- Modal de Pago -->
    <Modal v-if="showPaymentModal" @close="showPaymentModal = false">
      <template #title>Registrar Pago</template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="() => handleRegisterPayment()">
          <FormKit type="text" name="documentNumber" label="Recibo"
            v-model="paymentForm.documentNumber" validation="required" />
          <FormKit type="text" name="amount" label="Cantidad" placeholder="$0.00"
            v-model="paymentForm.amount" validation="required" />
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" class="btn bg-gray-400 hover:bg-gray-500 text-white"
              @click="showPaymentModal = false">Cancelar</button>
            <button type="submit" class="btn bg-green-600 hover:bg-green-700 text-white">Guardar</button>
          </div>
        </FormKit>
      </template>
    </Modal>

    <!-- Modal Ver Pago -->
    <Modal v-if="showViewPaymentModal" @close="showViewPaymentModal = false">
      <template #title>
        <div class="text-center uppercase text-sm font-bold tracking-wide">
          Detalle del Comprobante de Pago
        </div>
      </template>
      <template #body>
        <div class="rounded-md border border-gray-300 p-4 bg-white shadow space-y-3 text-sm text-gray-800">
          <div class="flex justify-between text-xs border-b pb-2 mb-2">
            <div>
              <p class="font-bold text-gray-700">Universidad Internacional</p>
              <p class="text-gray-500">Instituto Universitario Internacional, S.C.</p>
            </div>
            <div class="text-right">
              <p><strong>Recibo:</strong> {{ currentPayment?.documentNumber }}</p>
              <p><strong>Fecha:</strong> {{ formatDate(currentPayment?.createAt) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-1 text-sm">
            <p><strong>Alumno:</strong> {{ currentPayment?.Enrollment?.Lead?.information?.name || '---' }}</p>
            <p><strong>Programa:</strong> {{ currentPayment?.Enrollment?.Career?.program || '---' }}</p>
            <p><strong>Matrícula:</strong> <span class="font-mono">{{ currentPayment?.Enrollment?.matricula || '---' }}</span></p>
            <p><strong>CURP:</strong> <span class="font-mono">{{ currentPayment?.Enrollment?.curp || '---' }}</span></p>
            <p><strong>Recibo de inscripción:</strong> {{ currentPayment?.Enrollment?.enrollment_folio || '---' }}</p>
          </div>

          <div class="mt-4 pt-3 border-t">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-600 font-semibold border-b">
                  <th>Concepto</th>
                  <th class="text-right">Importe</th>
                  <th class="text-right">Beca</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td>Colegiatura {{ currentMonth }}/{{ currentYear }}</td>
                  <td class="text-right">${{ formatAmount(currentPayment?.amount) }}</td>
                  <td class="text-right">
                    {{ currentPayment?.Enrollment?.scholarship ? currentPayment.Enrollment.scholarship + '%' : '0.00' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="text-right mt-4">
          <button
            type="button"
            class="btn bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md shadow"
            @click="showViewPaymentModal = false"
          >
            Cerrar
          </button>
        </div>
      </template>
    </Modal>
  </FormContainer>
</template>

<script setup>
import Swal from "sweetalert2";
import { onMounted, ref, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import enrollmentService from '../../../services/enrollment.service';
import careerService from '../../../services/career.service';
import promotionService from '../../../services/promotion.service';
import channelService from '../../../services/channel.service';
import listService from '../../../services/list.service';
import paymentService from '../../../services/payment.service';

import FormContainer from '../../../components/FormContainer.vue';
import Modal from '../../../components/Modal.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();
const { id } = route.params;

const isSubmitting = ref(false);

const form = ref({
  careersId: '',
  promotionId: '',
  channelId: '',
  listId: '',
  enrollment_folio: '',
  matricula: '',
  beca: '',
  curp: '',
  comments: '',
  createAt: '' // yyyy-mm-dd
});

const careers = ref([]);
const promotions = ref([]);
const channels = ref([]);
const lists = ref([]);

const hasPayment = ref(false);
const showPaymentModal = ref(false);
const showViewPaymentModal = ref(false);
const currentPayment = ref(null);

const today = new Date();
const monthNames = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
const currentMonth = monthNames[today.getMonth()];
const currentYear = today.getFullYear();

// Catálogo base de estrategias
const strategyOptions = ref([
  { label: 'ACAPULCO', value: 'ACAPULCO' },
  { label: 'BECA CONGELADA', value: 'BECA CONGELADA' },
  { label: 'BECA DOBLE 14FEB', value: 'BECA DOBLE 14FEB' },
  { label: 'ESTRATEGIA DUO', value: 'ESTRATEGIA DUO' },
  { label: 'ESTRATEGIA ESCUELA PUBLICA', value: 'ESTRATEGIA ESCUELA PUBLICA' },
  { label: 'ESTRATEGIA VACACIONES', value: 'ESTRATEGIA VACACIONES' },
  { label: 'PAPA SIU/BIU', value: 'PAPA SIU/BIU' },
  { label: 'NINGUNA', value: 'NINGUNA' }
]);

// Si el valor guardado no está en el catálogo, lo agregamos para que se muestre
const ensureStrategyOption = (val) => {
  if (!val) return;
  const exists = strategyOptions.value.some(o => o.value === val);
  if (!exists) strategyOptions.value.unshift({ label: val, value: val });
};

const paymentForm = ref({
  enrollmentId: id,
  documentNumber: `COLEGIATURA ${currentMonth} ${currentYear}`,
  amount: ''
});

// Normalizadores
const normalizeInput = (v) => v?.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase() || '';

watch(form, (val) => {
  form.value.enrollment_folio = normalizeInput(val.enrollment_folio);
  form.value.matricula = normalizeInput(val.matricula);
  form.value.curp = normalizeInput(val.curp);
  form.value.beca = normalizeInput(val.beca);
  // strategy se deja tal cual por compatibilidad con el catálogo
}, { deep: true });

// Document number autogenerado por promoción (si no hay pago)
watch(() => form.value.promotionId, (newPromotionId) => {
  const promo = promotions.value.find(p => p.id === newPromotionId);
  if (promo && !hasPayment.value) {
    paymentForm.value.documentNumber = normalizeInput(promo.name);
  }
});

// Modo cajero para amount
watch(() => paymentForm.value.amount, (raw) => {
  const digits = (raw || '').toString().replace(/\D/g, '');
  const parsed = (parseInt(digits || '0') / 100).toFixed(2);
  paymentForm.value.amount = parsed;
});

// Cargar inscripción
const fetchEnrollment = async () => {
  try {
    const { data } = await enrollmentService.getById(id);
    const e = data.data;

    form.value = {
      careersId: e.Career?.id || '',
      promotionId: e.Promotion?.id || '',
      channelId: e.Channel?.id || '',
      listId: e.List?.id || '',
      enrollment_folio: e.enrollment_folio || '',
      matricula: e.matricula || '',
      beca: e.scholarship || '',
      curp: e.curp || '',
      comments: e.comments || '',
      createAt: e.createAt ? e.createAt.split('T')[0] : ''
    };

    // Asegurar que la estrategia guardada se vea en el select
    ensureStrategyOption(form.value.strategy);
  } catch (error) {
    toast.open({ message: 'Error al cargar la inscripción', type: 'error' });
  }
};

// Ver si tiene pago
const checkPaymentStatus = async () => {
  try {
    await paymentService.getDetailsByEnrollmentId(id);
    hasPayment.value = true;
  } catch (error) {
    hasPayment.value = error?.response?.status !== 404 ? hasPayment.value : false;
    if (error?.response?.status !== 404) {
      toast.open({ message: 'Error al verificar el estado de pago', type: 'error' });
      console.error(error);
    }
  }
};

// Catálogos
const fetchOptions = async () => {
  const [careerData, promotionData, channelData, listData] = await Promise.all([
    careerService.getAll(),
    promotionService.getAll(),
    channelService.getAll(),
    listService.getAll(),
  ]);
  careers.value = careerData.data.data;
  promotions.value = promotionData.data.data;
  channels.value = channelData.data.data;
  lists.value = listData.data.data;
};

// Guardar
const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await enrollmentService.update(id, {
      careersId: form.value.careersId,
      promotionId: form.value.promotionId,
      channelId: form.value.channelId,
      listId: form.value.listId,
      enrollment_folio: form.value.enrollment_folio,
      matricula: form.value.matricula,
      scholarship: form.value.beca,
      curp: form.value.curp,
      comments: form.value.comments || null,
      createAt: form.value.createAt ? new Date(form.value.createAt) : undefined
    });
    toast.open({ message: 'Inscripción actualizada correctamente.', type: 'success' });
    await fetchEnrollment();
    await checkPaymentStatus();
    router.push({ name: 'promoter/enrollments' });
  } catch (error) {
    toast.open({ message: error?.response?.data?.message || 'Error al actualizar inscripción', type: 'error' });
  } finally {
    isSubmitting.value = false;
  }
};

// Registrar pago
const handleRegisterPayment = async () => {
  const { enrollmentId, documentNumber, amount } = paymentForm.value;

  const missing = [];
  if (!form.value.careersId) missing.push('Programa');
  if (!form.value.promotionId) missing.push('Promoción');
  if (!form.value.channelId) missing.push('Canal de venta');
  if (!form.value.listId) missing.push('Lista de comisión');
  if (!form.value.enrollment_folio) missing.push('Recibo de inscripción');
  if (!form.value.matricula) missing.push('Matrícula');
  if (!form.value.beca) missing.push('Beca asignada');
  // if (!form.value.curp) missing.push('CURP');

  if (missing.length) {
    await Swal.fire({
      icon: 'warning',
      title: 'Faltan campos obligatorios',
      html: `Antes de registrar el pago, completa los siguientes campos:<br><ul class="text-left">${missing.map(f => `<li><b>${f}</b></li>`).join('')}</ul>`,
      confirmButtonText: 'Entendido'
    });
    return;
  }

  const { isConfirmed } = await Swal.fire({
    icon: 'warning',
    title: '¿Registrar el pago?',
    text: 'Una vez registrado el pago, ya no se podrá modificar esta inscripción.',
    showCancelButton: true,
    confirmButtonText: 'Sí, registrar',
    cancelButtonText: 'Cancelar'
  });
  if (!isConfirmed) return;

  try {
    await enrollmentService.update(id, {
      careersId: form.value.careersId,
      promotionId: form.value.promotionId,
      channelId: form.value.channelId,
      listId: form.value.listId,
      enrollment_folio: form.value.enrollment_folio,
      matricula: form.value.matricula,
      scholarship: form.value.beca,
      curp: form.value.curp,
      comments: form.value.comments || null
    });

    const payload = {
      enrollmentId,
      documentNumber,
      amount: parseFloat(amount),
      available: true
    };
    await paymentService.create(payload);
    toast.open({ message: 'Pago registrado con éxito', type: 'success' });
    showPaymentModal.value = false;

    await checkPaymentStatus();
    await fetchEnrollment();
  } catch (error) {
    toast.open({ message: error?.response?.data?.message || 'Error al registrar el pago', type: 'error' });
  }
};

// Ver pago
const handleViewPayment = async () => {
  try {
    const { data } = await paymentService.getDetailsByEnrollmentId(id);
    currentPayment.value = data.data;
    showViewPaymentModal.value = true;
  } catch (err) {
    toast.open({ message: 'Error al obtener detalles del pago.', type: 'error' });
    console.error(err);
  }
};

const formatDate = (s) => new Date(s).toLocaleDateString('es-MX', { day:'2-digit', month:'2-digit', year:'numeric' });
const formatAmount = (v) => Number(v).toFixed(2);

onMounted(async () => {
  await fetchOptions();
  await fetchEnrollment();
  await checkPaymentStatus();
});
</script>
