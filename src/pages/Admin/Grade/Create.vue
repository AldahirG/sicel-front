<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import DashboardLayout from '../../../layouts/DashboardLayout.vue';
import FormContainer from '../../../components/FormContainer.vue';
import InputLabel from '../../../components/InputLabel.vue';
import TextInput from '../../../components/TextInput.vue';

const router = useRouter();
const startValidation = ref(false);

// URL de API
const url = import.meta.env.VITE_API_URL;

// Paths for breadcrumbs
const bread = [
    { label: "Dashboard", name: 'admin' },
    { label: "Grados escolares", name: 'admin/grades' },
    { label: "Crear", name: 'createGrade' },
]

const name = ref('');

function register() {
  startValidation.value = true;

  // Validar todos los campos antes de enviar
  if (!isValidName.value) {
    return;
  }

  // Recolectar los datos del formulario
  const formData = {
    name: name.value,
  };

  // Enviar datos a tu endpoint utilizando Axios
  axios.post(`${url}/grade`, formData)
    .then(response => {
      router.push("/admin/grades");
    })
    .catch(error => {
      console.error('Error en la solicitud', error);
    });
}

// Define si el nombre del grado es válido
const isValidName = computed(() => {
  return startValidation.value ? name.value.length > 0 : null;
});

</script>

<template>
    <DashboardLayout :breadcrumbs="bread">
        <FormContainer>
            <div>
                <div class="mt-4 mb-4">
                    <InputLabel for="name" value="Nombre del grado escolar" />
                    <TextInput 
                        id="name" 
                        v-model="name" 
                        type="text" 
                        class="mt-1 block w-full"
                        placeholder="Ingrese el nombre del grado escolar" 
                        autocomplete="name" 
                        autofocus 
                    />

                    <div v-if="isValidName == false" class="ml-2 mt-2">
                        <p class="text-sm text-red-600 dark:text-red-400 transition-colors duration-300 ease-in-out">
                        ¡Ingresa el nombre del grado, por favor!
                        </p>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button @click="register" class="py-2 px-4 text-white bg-green-500 hover:bg-green-600 rounded-md duration-150">
                        Crear
                    </button>
                </div>
            </div>
        </FormContainer>
    </DashboardLayout>
</template>