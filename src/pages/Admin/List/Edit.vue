<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import list from '../../../services/list.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const form = ref({
  noLista: '',
  dateStart: '',
  dateEnd: ''
});

const handleSubmit = async (form) => {
  try {
    const { data } = await list.update(id, form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    });

    router.push({ name: 'admin/enrollments/lists' });
  } catch (error) {
    toast.open({
      message: error.response?.data?.message || 'Error al editar la lista.',
      type: 'error'
    });
  }
};

onMounted(async () => {
  try {
    const { data } = await list.getById(id);
    form.value = {
      noLista: data.data.noLista || '',
      dateStart: data.data.dateStart?.substring(0, 10),
      dateEnd: data.data.dateEnd?.substring(0, 10),
    };
  } catch (error) {
    router.push({ name: 'admin/enrollments/lists' });
  }
});
</script>

<template>
  <FormContainer>
    <FormKit 
      id="edit"
      type="form"
      v-model="form"
      :actions="false"
      incomplete-message="Lo sentimos, hubo un error al editar la lista."
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre de la Lista"
        name="noLista"
        placeholder="Ej. Lista Primavera 2025"
        validation="required"
        :validation-messages="{
          required: 'El nombre es obligatorio.'
        }"
      />

      <FormKit
        type="date"
        label="Fecha de inicio"
        name="dateStart"
        validation="required"
        :validation-messages="{
          required: 'La fecha de inicio es obligatoria.'
        }"
      />

      <FormKit
        type="date"
        label="Fecha de fin"
        name="dateEnd"
        validation="required"
        :validation-messages="{
          required: 'La fecha de fin es obligatoria.'
        }"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>
