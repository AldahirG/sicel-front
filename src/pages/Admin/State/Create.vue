<script setup>
import { useRouter } from "vue-router"
import { inject, onMounted, ref } from 'vue';
import { reset } from "@formkit/vue"

import state from '../../../services/state.service';
import country from '../../../services/country.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const router = useRouter();

const countries = ref([]);

const handleSubmit = async (form) => {
    try {
        const { data } = await state.create(form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        reset('create');

        router.push({ name: 'admin/states' })

    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    const { data } = await country.getList();
    countries.value = data.data;
});


</script>

<template>
    <FormContainer>
        <FormKit 
            id="create" 
            type="form" 
            :actions="false"
            incomplete-message="Lo sentimos hubo un error al crear el estado." 
            @submit="handleSubmit"
        >
            <FormKit 
                type="text" 
                label="Nombre del estado" 
                name="name" 
                placeholder="Ingresa un nombre"
                validation="required|length:3" 
                :validation-messages="{
                    required: 'El nombre es obligatorio.',
                    length: 'El nombre es muy corto.'
                }" 
            />

            <FormKit
                type="select"
                label="País"
                name="countryId"
                placeholder="Selecciona un país"
                :options="countries.map(country => ({ label: country.name, value: country.id }))"
                validation="required"
                :validation-messages="{
                required: 'El país es obligatorio.',
                }"
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>