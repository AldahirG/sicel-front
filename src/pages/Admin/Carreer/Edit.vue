<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import career from '../../../services/career.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const form = ref({
    name: '',
    program: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await career.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/careers'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    try {
        const { data } = await career.getById(id);
        form.value = {
            name: data.data.name,
            program: data.data.program,
        };
    } catch (error) {
        router.push({ name: 'admin/careers' })
    }
})


</script>

<template>
    <FormContainer>
        <FormKit 
            id="edit" 
            type="form"
            v-model="form"
            :actions="false"
            incomplete-message="Lo sentimos hubo un error al editar la carrera." 
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
                label="Programa" 
                name="program"
                placeholder="Ingresa el programa" 
                validation="required" 
                :validation-messages="{
                    required: 'El programa es obligatorio.',
                }" 
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>