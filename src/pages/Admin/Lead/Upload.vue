<script>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import FileInput from '../../../components/FileInput.vue';
import lead from '../../../services/lead.service';

export default {
  components: {
    FileInput,
  },
  setup() {
    const toast = inject('toast');
    const router = useRouter();
    const uploadedFile = ref(null);
    const isLoading = ref(false);

    const onFileUploaded = (file) => {
      uploadedFile.value = file;
    };

    const uploadFile = async () => {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      isLoading.value = true;

      try {
        const { data } = await lead.upload(formData);
        const message = data.http.message;

        toast.open({
          message: message,
          type: 'success'
        });

        router.push({ name: 'admin/leads' });

      } catch (error) {
        toast.open({
          message: error.response.data.message,
          type: 'error'
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      onFileUploaded,
      uploadFile,
      uploadedFile,
      isLoading,
    };
  }
}
</script>

<template>
  <FileInput 
    @file-uploaded="onFileUploaded" 
  />

  <div class="flex justify-center w-full mt-4">
    <button 
      v-if="uploadedFile" 
      @click="uploadFile" 
      :disabled="isLoading"
      class="btn text-white bg-green-500 hover:bg-green-600 flex items-center"
    >
      <h5 v-if="!isLoading">Subir archivo</h5>
      <h5 
        v-else 
        class="flex items-center"
      >
        Cargando leads <span class="loading loading-spinner loading-xs ml-2"></span>
      </h5>
    </button>
  </div>
</template>
