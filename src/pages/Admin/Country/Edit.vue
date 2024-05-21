<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import country from '../../../services/country.service';

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
        const { data } = await country.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/countries'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    try {
        const { data } = await country.getById(id);
        form.value = {
            name: data.data.name,
        };
    } catch (error) {
        router.push({ name: 'admin/countries' })
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
            incomplete-message="Lo sentimos hubo un error al editar el país." 
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

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>