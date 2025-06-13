<script setup>
import { useRouter } from "vue-router";
import { inject } from "vue";
import { reset } from "@formkit/vue";

import channel from '../../../services/channel.service';
import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const router = useRouter();

const handleSubmit = async (form) => {
  try {
    const { data } = await channel.create(form);
    const message = data.http.message;

    toast.open({
      message,
      type: 'success',
    });

    reset('create');
    router.push({ name: 'admin/enrollments/channels' });

  } catch (error) {
    toast.open({
      message: error.response?.data?.message || 'Error al crear el canal.',
      type: 'error',
    });
  }
};
</script>

<template>
  <FormContainer>
    <FormKit
      id="create"
      type="form"
      :actions="false"
      incomplete-message="Lo sentimos, hubo un error al crear el canal de venta."
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
