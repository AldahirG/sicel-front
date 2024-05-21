<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject, ref, onMounted } from 'vue';
import { reset } from "@formkit/vue"

import user from '../../../services/user.service';
import { useRolesStore } from '../../../store/Admin/roles';

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const store = useRolesStore();
const roles = ref([]);

const handleSubmit = async ({password_confirm, ...form}) => {
  try {
    const { data } = await user.create(form);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    })

    reset('registerUser');

    router.push({ name: 'admin/users'})
    
  } catch (error) {
    toast.open({
      message: error.response.data.message,
      type: 'error'
    })
  }
}

onMounted(async () => {
    await store.getAll();
    roles.value = store.roles;
});

</script>

<template>
  <FormContainer>
    <FormKit
      id="registerUser"
      type="form"
      :actions="false"
      incomplete-message="Lo sentimos hubo un error al crear el usuario."
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
        label="Apellido paterno"
        name="paternalSurname"
        placeholder="Ingresa un apellido paterno"
        validation="required|length:3"
        :validation-messages="{
          required: 'El apellido paterno es obligatorio.',
          length: 'El apellido es muy corto.'
        }"
      />

      <FormKit
        type="text"
        label="Apellido materno"
        name="maternalSurname"
        placeholder="Ingresa un apellido materno"
      />

      <FormKit
        type="email"
        label="Correo electrónico"
        name="email"
        placeholder="Ingresa un correo electrónico"
        validation="required|email"
        :validation-messages="{
          required: 'El correo electrónico es obligatorio.',
          email: 'Correo electrónico no válido.'
        }"
      />

      <FormKit
        type="password"
        label="Contraseña"
        name="password"
        placeholder="Ingresa una contraseña - Min 8 carácteres"
        validation="required|length:8"
        :validation-messages="{
          required: 'La contraseña es obligatoria.',
          length: 'La contraseña debe contener al menos 8 carácteres.'
        }"
      />

      <FormKit
        type="password"
        label="Confirmación de contraseña"
        name="password_confirm"
        placeholder="Ingresa nuevamente tu contraseña"
        validation="required|confirm"
        :validation-messages="{
          required: 'La contraseña es obligatoria.',
          confirm: 'Las contraseñas no coinciden'
        }"
      />

      <FormKit
        type="checkbox"
        label="Roles"
        name="roles"
        help="Selecciona un rol:"
        :options="roles.map(role => ({ label: role.name, value: role.id }))"
        validation="required|min:1"
        :validation-messages="{
          required: 'El rol es obligatorio',
          min: 'Selecciona al menos un rol'
        }"
        :config="{
          classes: {
            legend: 'block font-medium text-sm text-gray-700 dark:text-white transition-colors duration-300 ease-out',
            help: 'text-sm text-black dark:text-gray-300 mt-1 mb-4',
            input: 'checkbox checkbox-sm border border-black/70 dark:border-[#A6ADBB] mr-4',
            label: 'label-text',
            message: 'text-red-500 text-sm my-3',
          },
        }"
      />

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>