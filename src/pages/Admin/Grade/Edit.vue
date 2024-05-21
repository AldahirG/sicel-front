<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import grade from '../../../services/grade.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const form = ref({
    name: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await grade.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/grades'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    try {
        const { data } = await grade.getById(id);
        form.value = {
            name: data.data.name,
        };
    } catch (error) {
        router.push({ name: 'admin/grades' })
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
            incomplete-message="Lo sentimos hubo un error al editar el grado escolar." 
            @submit="handleSubmit"
        >
            <FormKit 
                type="text" 
                label="Grado escolar"
                name="name"
                placeholder="Ingresa un grado escolar"
                validation="required|length:3" 
                :validation-messages="{
                  required: 'El grado escolar es obligatorio.',
                  length: 'El nombre del grado escolar es muy corto.'
                }"
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>