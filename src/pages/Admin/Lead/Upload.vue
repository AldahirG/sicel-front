<script>
import axios from 'axios';

import DashboardLayout from '../../../layouts/DashboardLayout.vue';
import FormContainer from '../../../components/FormContainer.vue';
import InputLabel from '../../../components/InputLabel.vue';
import TextInput from '../../../components/TextInput.vue';

// URL de API
const url = import.meta.env.VITE_API_URL;

export default {
  components: {
    DashboardLayout,
    FormContainer,
    InputLabel,
    TextInput,
  },

  data() {
    return {
      uploadedFile: null,
      showErrorMessage: false,
      errorMessage: '',
      showSuccessMessage: false,

      // Paths for breadcrumbs
      bread: [
          { label: "Dashboard", name: 'admin' },
          { label: "Leads", name: 'admin/leads' },
          { label: "Subir csv", name: "uploadLead" }
      ]
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadedFile = file;
    },
    handleDragDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.uploadedFile = file;
      this.unhighlightDropzone();
    },

    highlightDropzone(event) {
      event.preventDefault();
      event.target.classList.add('highlight');
    },
    unhighlightDropzone(event) {
      if (event) {
        event.preventDefault();
        event.target.classList.remove('highlight');
      }
    },
    async uploadFile() {
      try {
        if (!this.uploadedFile) {
          this.showErrorMessage = true;
          this.errorMessage = 'No se ha cargado ningún archivo.';
          return;
        }
        const formData = new FormData();
        formData.append('file', this.uploadedFile);

        const response = await axios.post(`${url}/lead/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },

        });

        this.uploadedFile = null;

        // Mostrar mensaje de éxito
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000); // 3 segundos

      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.showErrorMessage = true;
          this.errorMessage = error.response.data.error;
        } else {
          console.error('Error al subir archivo:', error);
          alert('Ocurrió un error al subir el archivo.');
        }
      }
    },
  },
};
</script>

<template>
  <DashboardLayout :breadcrumbs="bread">
    <div class="mx-auto max-w-3xl lg:max-w-[1400px] mt-3 mb-6 px-3 md:px-0">
        <router-link :to="{ path: '/admin/leads' }"
            class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200">
            Volver a la página anterior
        </router-link>
    </div>

    <!-- Mensaje de error -->
    <div 
      v-if="showErrorMessage"
      class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert"
    >
      
      <p class="flex items-center">
        <i class="bi bi-x-circle mr-2"></i>{{ errorMessage }}
      </p>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccessMessage" class="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
      <p class="flex items-center">
        <i class="bi bi-check-circle-fill mr-2"></i>Datos cargados correctamente
      </p>
    </div>

    <!-- Drag and Drop -->
    <div
      @change="handleFileUpload"
      @dragover.prevent  
      @dragenter.prevent="highlightDropzone"
      @dragleave.prevent="unhighlightDropzone"
      @drop.prevent="handleDragDrop"  
      class="flex items-center justify-center w-full"
    >
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div 
              v-if="!uploadedFile" 
              class="flex flex-col items-center justify-center pt-5 pb-6"
            >
                <i class="bi bi-cloud-arrow-up text-4xl text-gray-500 dark:text-gray-400"></i>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Haz clic para subir</span> o arrastra y suelta aquí.</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Archivos aceptados con extensión: <span class="underline">CSV</span>
                </p>
            </div>

            <div 
              v-else 
              class="flex flex-col mx-auto max-w-sm md:max-w-md text-center pt-5 pb-6"
            >
                <i class="bi bi-cloud-arrow-up-fill text-4xl text-gray-500 dark:text-gray-400"></i>
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400 font-semibold">Archivo cargado</p>
                <p class="mb-2 text-sm text-green-500 dark:text-green-400 font-bold">
                  {{ uploadedFile.name }}
                </p>
                <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Haz clic aquí o arrastra y suelta el archivo para cambiarlo.
                </p>
            </div>

            <input 
              id="dropzone-file"
              type="file"
              accept=".csv"
              class="hidden"
            />
        </label>
    </div> 
    <!-- Fin de Drag and Drop -->

    <div class="flex justify-center my-6 w-full">
      <button
        @click="uploadFile"
        class="py-2 px-4 text-white bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md duration-150"
      >
        Subir Archivo
      </button>
    </div>

  </DashboardLayout>
</template>