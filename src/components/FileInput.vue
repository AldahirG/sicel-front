<template>
    <div class="flex items-center justify-center w-full">
        <div 
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave" 
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div v-if="!uploadedFile" class="flex flex-col items-center justify-center pt-5 pb-6">
                <i class="bi bi-cloud-arrow-up text-4xl text-gray-500 dark:text-gray-400"></i>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Haz clic para
                        subir</span> o arrastra y suelta aquí.</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Archivos aceptados con extensión: <span
                        class="underline">CSV</span></p>
            </div>
            <div v-else class="flex flex-col mx-auto max-w-sm md:max-w-md text-center pt-5 pb-6">
                <i class="bi bi-cloud-arrow-up-fill text-4xl text-gray-500 dark:text-gray-400"></i>
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400 font-semibold">Archivo cargado</p>
                <p class="mb-2 text-sm text-green-500 dark:text-green-400 font-bold">{{ uploadedFile.name }}</p>
                <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">Haz clic aquí o arrastra y suelta el archivo
                    para cambiarlo.</p>
            </div>

            <input 
                id="dropzone-file" 
                type="file" 
                :accept="accept" 
                class="hidden" 
                @change="handleFileUpload"
                ref="fileInput" 
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        accept: {
            type: String,
            default: '.csv'
        }
    },
    data() {
        return {
            uploadedFile: null,
            isDragging: false,
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.uploadedFile = file;
                this.$emit('file-uploaded', file);
            }
        },
        handleDragOver(event) {
            this.isDragging = true;
        },
        handleDragLeave(event) {
            this.isDragging = false;
        },
        handleDrop(event) {
            this.isDragging = false;
            const file = event.dataTransfer.files[0];
            if (file) {
                this.uploadedFile = file;
                this.$emit('file-uploaded', file);
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        }
    },
};
</script>