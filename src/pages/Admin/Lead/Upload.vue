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

    const onFileUploaded = (file) => {
      uploadedFile.value = file;
    };

    const uploadFile = async () => {
      const formData = new FormData();
      formData.append('file', uploadedFile.value);

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
      }
    };

    return {
      onFileUploaded,
      uploadFile,
      uploadedFile,
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
      class="btn text-white bg-green-500 hover:bg-green-600"
    >
      Enviar Archivo
    </button>
  </div>
</template>