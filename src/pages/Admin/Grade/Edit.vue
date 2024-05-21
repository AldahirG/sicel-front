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
            grade: {
                name: '',
            },

            // Paths for breadcrumbs
            bread: [
                { label: "Dashboard", name: 'admin' },
                { label: "Grados escolares", name: 'admin/grades' },
                { label: "Editar", name: "editGrade" }
            ]
        };
    },
    methods: {
        getgrade(id) {
            axios.get(`${url}/grade/${id}`)
                .then(res => {
                    this.grade.name = res.data.name;
                });
        },
        async update() {
            const id = this.$route.params.id;

            try {
                await axios.put(`${url}/grade/${id}`, this.grade);
                this.$router.push("/admin/grades");
            } catch (error) {
                console.error('Error al actualizar el grado:', error);
            }
        },
    },
    created() {
        const id = this.$route.params.id;
        this.getgrade(id);
    },
};
</script>

<template>
    <DashboardLayout :breadcrumbs="bread">
        <FormContainer>
            <form @submit.prevent="update">
                <div class="mt-4 mb-4">
                    <InputLabel for="name" value="Nombre del grado escolar" />
                    <TextInput 
                        id="name" 
                        v-model="grade.name" 
                        type="text" 
                        class="mt-1 block w-full"
                        placeholder="Ingrese el nombre del grado escolar" 
                        autocomplete="name" 
                        autofocus 
                    />
                </div>

                <div class="flex justify-end">
                    <button 
                        type="submit"
                        class="py-2 px-4 text-white bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
                    >
                        Editar
                    </button>
                </div>

            </form>
        </FormContainer>
    </DashboardLayout>
</template>