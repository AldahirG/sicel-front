<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject } from 'vue';
import { reset } from "@formkit/vue"

import cycle from '../../../services/cycle.service';

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const handleSubmit = async (form) => {
  try {
    const { data } = await cycle.create(form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    })

    reset('create');

    router.push({ name: 'admin/cycles'})
    
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
      incomplete-message="Lo sentimos hubo un error al crear el ciclo escolar."
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Ciclo escolar"
        name="cycle"
        placeholder="Ingresa un ciclo escolar"
        validation="required|length:6"
        :validation-messages="{
          required: 'El ciclo escolar es obligatorio.',
          length: 'El ciclo escolar es muy corto.'
        }"
      />

      <FormKit
        type="text"
        label="Periodo"
        name="name"
        placeholder="Ingresa un periodo (Octubre - Noviembre)"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>