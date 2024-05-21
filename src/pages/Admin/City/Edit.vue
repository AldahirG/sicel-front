<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import state from '../../../services/state.service';
import { useCountriesStore } from "../../../store/Admin/countries";

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const store = useCountriesStore();
const countries = ref([]);

const form = ref({
    name: '',
    countryId: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await state.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/states'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    await store.getAll();
    countries.value = store.countries;

    try {
        const { data } = await state.getById(id);
        form.value = {
            name: data.data.name,
            countryId: data.data.country.id,
        };
    } catch (error) {
        router.push({ name: 'admin/states' })
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