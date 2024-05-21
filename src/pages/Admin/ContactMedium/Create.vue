<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject } from 'vue';
import { reset } from "@formkit/vue"

import contactMedium from '../../../services/contactMedium.service';

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const handleSubmit = async (form) => {
  try {
    const { data } = await contactMedium.create(form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    })

    reset('create');

    router.push({ name: 'admin/contact-mediums'})
    
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
      incomplete-message="Lo sentimos hubo un error al crear el medio de contacto."
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

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>