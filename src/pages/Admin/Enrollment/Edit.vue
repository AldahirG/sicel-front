<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import enrollmentService from '../../../services/enrollment.service';
import careerService from '../../../services/career.service';
import promotionService from '../../../services/promotion.service';
import channelService from '../../../services/channel.service';
import listService from '../../../services/list.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();
const { id } = route.params;

const form = ref({
  careersId: '',
  promotionId: '',
  channelId: '',
  listId: '',
  matricula: '',
  beca: ''
});

const careers = ref([]);
const promotions = ref([]);
const channels = ref([]);
const lists = ref([]);

const fetchEnrollment = async () => {
  try {
    const { data } = await enrollmentService.getById(id);
    const enrollment = data.data;

    form.value = {
      careersId: enrollment.Career?.id || '',
      promotionId: enrollment.Promotion?.id || '',
      channelId: enrollment.Channel?.id || '',
      listId: enrollment.List?.id || '',
      matricula: enrollment.Lead?.matricula || '',
      beca: enrollment.Lead?.scholarship || ''
    };
  } catch (error) {
    toast.open({
      message: 'Error al cargar la inscripción',
      type: 'error'
    });
  }
};

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

const handleSubmit = async () => {
  try {
    await enrollmentService.update(id, form.value);
    toast.open({
      message: 'Inscripción actualizada correctamente.',
      type: 'success'
    });
    router.push({ name: 'admin/enrollments' });
  } catch (error) {
    toast.open({
      message: error.response?.data?.message || 'Error al actualizar inscripción',
      type: 'error'
    });
  }
};

onMounted(async () => {
  await fetchOptions();
  await fetchEnrollment();
});
</script>

<template>
  <FormContainer maxWidth="max-w-4xl">
    <div class="text-lg font-semibold mb-4">Editar Inscripción</div>

    <FormKit
      type="form"
      v-model="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <FormKit
        type="select"
        name="careersId"
        label="Carrera"
        :options="careers.map(c => ({ label: c.program, value: c.id }))"
        placeholder="Selecciona una carrera"
      />

      <FormKit
        type="select"
        name="promotionId"
        label="Promoción"
        :options="promotions.map(p => ({ label: p.name, value: p.id }))"
        placeholder="Selecciona una promoción"
      />

      <FormKit
        type="select"
        name="channelId"
        label="Canal de venta"
        :options="channels.map(c => ({ label: c.name, value: c.id }))"
        placeholder="Selecciona un canal"
      />

      <FormKit
        type="select"
        name="listId"
        label="Lista de comisión"
        :options="lists.map(l => ({ label: l.noLista, value: l.id }))"
        placeholder="Selecciona una lista"
      />

      <FormKit
        type="text"
        name="matricula"
        label="Matrícula"
        placeholder="Número de matrícula"
      />

      <FormKit
        type="text"
        name="beca"
        label="Beca asignada"
        placeholder="Ej. 20%"
      />

      <div class="flex justify-between gap-4 mt-6">
        <button
          type="submit"
          class="btn bg-green-600 hover:bg-green-700 text-white"
        >
          <i class="bi bi-check2-circle"></i> Guardar cambios
        </button>

        <button
          type="button"
          class="btn bg-gray-500 hover:bg-gray-600 text-white"
          @click="router.back()"
        >
          <i class="bi bi-arrow-left-circle"></i> Cancelar
        </button>
      </div>
    </FormKit>
  </FormContainer>
</template>
