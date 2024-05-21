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
  <FormContainer maxWidth="max-w-5xl">
    <FormKit
      id="register"
      type="form"
      :actions="false"
      incomplete-message="Lo sentimos hubo un error al crear el lead."
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
          length: 'Ingresa un nombre válido.'
        }"
      />

      <FormKit
        type="select"
        label="Sexo"
        name="genre"
        placeholder="Selecciona un sexo"
        :options="[
          'FEMENINO',
          'MASCULINO',
        ]"
      />

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="select"
            label="Status"
            name="enrollmentStatus"
            placeholder="Selecciona un status"
            :options="[
              'INS',
              'INSO',
              'REZA',
            ]"
          />
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Seguimiento"
            name="followUpId"
            placeholder="Selecciona un seguimiento"
            :options="[
              'INS',
              'INSO',
              'REZA',
            ]"
          />
        </div>
      </div>

      <FormKit
        type="tel"
        label="Teléfono"
        name="tel"
        placeholder="Ingresa un número de teléfono (xxx-xxx-xxxx)"
        validation="required|length:10"
        :validation-messages="{
          required: 'El número de teléfono es obligatorio.',
          length: 'El número de teléfono tiene que ser igual o mayor a 10 dígitos.'
        }"
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

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="text"
            label="Carrera de interés"
            name="careerInterest"
            placeholder="Ingresa la carrera de interés"
          />
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Grado escolar"
            name="grade"
            placeholder="Selecciona un grado escolar"
            :options="[
              'INS',
              'INSO',
              'REZA',
            ]"
          />
        </div>
      </div>

      <FormKit
        type="select"
        label="Beca ofrecida"
        name="scholarship"
        placeholder="Selecciona una beca"
        :options="[
          'INS',
          'INSO',
          'REZA',
        ]"
      />

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="text"
            label="Escuela de procedencia"
            name="formerSchool"
            placeholder="Ingresa la escuela de procedencia"
          />
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Tipo de escuela"
            name="typeSchool"
            placeholder="Selecciona un tipo de escuela"
            :options="[
              'PUBLICA',
              'PRIVADA',
            ]"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="select"
            label="Aset Name"
            name="asetNameId"
            placeholder="Selecciona un aset name"
            :options="[
              'PUBLICA',
              'PRIVADA',
            ]"
          />
        </div>

        <div class="w-1/2">
          <span>Medio de contacto: </span>
        </div>
      </div>

      <FormKit
        type="select"
        label="Campaña"
        name="campaignId"
        placeholder="Selecciona una campaña"
        :options="[
          'INS',
          'INSO',
          'REZA',
        ]"
      />

      <FormKit
        type="select"
        label="Ciudad"
        name="cityId"
        placeholder="Selecciona una ciudad"
        :options="[
          'INS',
          'INSO',
          'REZA',
        ]"
      />

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="select"
            label="Ciclo escolar"
            name="cycleId"
            placeholder="Selecciona un ciclo escolar"
            :options="[
              'PUBLICA',
              'PRIVADA',
            ]"
          />
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Semestre de ingreso"
            name="cycleId"
            placeholder="Selecciona un semestre de ingreso"
            :options="[
              'PUBLICA',
              'PRIVADA',
            ]"
          />
        </div>
      </div>

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>