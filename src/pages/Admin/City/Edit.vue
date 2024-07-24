<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import state from '../../../services/state.service';
import city from '../../../services/city.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const states = ref([]);

const form = ref({
    name: '',
    stateId: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await city.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/cities'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    try {
        const { data } = await state.getList();
        states.value = data.data || [];

        const { data: cityData } = await city.getById(id);
        form.value = {
            name: cityData.data.name,
            stateId: cityData.data.state.id,
        };
    } catch (error) {
        toast.open({
            message: error,
            type: 'error'
        })
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
            incomplete-message="Lo sentimos hubo un error al editar la ciudad." 
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
                label="Estado"
                name="stateId"
                placeholder="Selecciona un estado"
                :options="states.map(state => ({ label: state.name, value: state.id }))"
                validation="required"
                :validation-messages="{
                    required: 'El estado es obligatorio.',
                }"
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>