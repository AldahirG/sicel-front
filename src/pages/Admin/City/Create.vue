<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject, onMounted, ref } from 'vue';
import { reset } from "@formkit/vue"

import city from '../../../services/city.service';
import { useStatesStore } from '../../../store/Admin/states';

const FormContainer = defineAsyncComponent(() =>
    import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const store = useStatesStore();
const states = ref([]);

const handleSubmit = async (form) => {
    try {
        const { data } = await city.create(form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        reset('create');

        router.push({ name: 'admin/cities' })

    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    await store.getAll();
    states.value = store.states;
});


</script>

<template>
    <FormContainer>
        <FormKit 
            id="create" 
            type="form" 
            :actions="false"
            incomplete-message="Lo sentimos hubo un error al crear la ciudad." 
            @submit="handleSubmit"
        >
            <FormKit 
                type="text" 
                label="Nombre de la ciudad" 
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