<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject } from 'vue';
import { reset } from "@formkit/vue"

import career from '../../../services/career.service';

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const handleSubmit = async (form) => {
  try {
    const { data } = await career.create(form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    })

    reset('create');

    router.push({ name: 'admin/careers'})
    
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
      incomplete-message="Lo sentimos hubo un error al crear la carrera."
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
        type="text"
        label="Programa"
        name="program"
        placeholder="Ingresa el programa"
        validation="required"
        :validation-messages="{
          required: 'El programa es obligatorio.',
        }"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>