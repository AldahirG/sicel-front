<script setup>
import { useRouter } from "vue-router"
import { inject } from 'vue'
import { reset } from "@formkit/vue"

import list from '../../../services/list.service'

import FormContainer from '../../../components/FormContainer.vue'

const toast = inject('toast')
const router = useRouter()

const handleSubmit = async (form) => {
  try {
    form.dateStart = new Date(form.dateStart).toISOString()
    form.dateEnd = new Date(form.dateEnd).toISOString()

    const { data } = await list.create(form)
    const message = data.http.message

    toast.open({
      message: message,
      type: 'success'
    })

    reset('create')
    router.push({ name: 'admin/enrollments/lists' }) // Asegúrate de que esta ruta exista
  } catch (error) {
    toast.open({
      message: error.response?.data?.message || 'Error al crear la lista.',
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
      incomplete-message="Lo sentimos hubo un error al crear la lista."
      @submit="handleSubmit"
    >
    <FormKit 
  type="text" 
  name="noLista" 
  label="Nombre de la Lista"
  validation="required"
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
