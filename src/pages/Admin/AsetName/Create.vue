<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject, onMounted, ref } from 'vue';
import { reset } from "@formkit/vue"

import asetName from '../../../services/asetName.service';
import { useContactMediumsStore } from '../../../store/Admin/contactMedium';

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const store = useContactMediumsStore();
const contactMediums = ref([]);

const handleSubmit = async (form) => {
  try {
    const { data } = await asetName.create(form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    })

    reset('create');

    router.push({ name: 'admin/aset-names'})
    
  } catch (error) {
    toast.open({
      message: error,
      type: 'error'
    })
  }
}

onMounted(async () => {
    await store.getAll();
    contactMediums.value = store.contactMediums;
});

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
        label="Medio de contacto"
        name="contactTypesId"
        placeholder="Selecciona un medio de contacto"
        :options="contactMediums.map(contactMedium => ({ label: contactMedium.name, value: contactMedium.id }))"
        validation="required"
        :validation-messages="{
          required: 'El medio de contacto es obligatorio.',
        }"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>