<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import channel from '../../../services/channel.service';
import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const form = ref({
  name: '',
});

const handleSubmit = async (form) => {
  try {
    const { data } = await channel.update(id, form);
    const message = data.http.message;

    toast.open({
      message,
      type: 'success',
    });

    router.push({ name: 'admin/enrollments/channels' });

  } catch (error) {
    toast.open({
      message: error.response?.data?.message || 'Error al actualizar el canal.',
      type: 'error',
    });
  }
};

onMounted(async () => {
  try {
    const { data } = await channel.getById(id);
    form.value = {
      name: data.data.name,
    };
  } catch (error) {
    router.push({ name: 'admin/enrollments/channels' });
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
      incomplete-message="Lo sentimos, hubo un error al editar el canal."
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre del Canal"
        name="name"
        placeholder="Ej. Digital, Presencial, Redes Sociales..."
        validation="required|length:3"
        :validation-messages="{
          required: 'El nombre es obligatorio.',
          length: 'El nombre es muy corto.'
        }"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>
