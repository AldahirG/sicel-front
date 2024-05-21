<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject } from 'vue';
import { reset } from "@formkit/vue"

import campaign from '../../../services/campaign.service';

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const handleSubmit = async (form) => {
  try {
    const { data } = await campaign.create(form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    })

    reset('create');

    router.push({ name: 'admin/campaigns'})
    
  } catch (error) {
    toast.open({
      message: error.response.data.message,
      type: 'error'
    })
  }
}

</script>

<template>
  <FormContainer>
    <FormKit
      id="create"
      type="form"
      :actions="false"
      incomplete-message="Lo sentimos hubo un error al crear la campaña."
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre"
        name="name"
        placeholder="Ingresa un nombre"
        validation="required|length:3"
        :validation-messages="{
          required: 'El nombre es obligatorio.',
          length: 'El nombre es muy corto.'
        }"
      />

      <FormKit
        type="select"
        label="Tipo de campaña"
        name="type"
        placeholder="Selecciona un tipo de campaña"
        :options="[
          'PAUTA',
          'ORGANICA',
        ]"
        validation="required"
        :validation-messages="{
          required: 'El tipo de campaña es obligatorio.',
        }"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>