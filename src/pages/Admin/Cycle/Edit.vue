<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import cycle from '../../../services/cycle.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const form = ref({
    name: '',
    cycle: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await cycle.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/cycles'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    try {
        const { data } = await cycle.getById(id);
        form.value = {
            name: data.data.name,
            cycle: data.data.cycle,
        };
    } catch (error) {
        router.push({ name: 'admin/cycles' })
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
            incomplete-message="Lo sentimos hubo un error al editar el ciclo escolar." 
            @submit="handleSubmit"
        >
            <FormKit
                type="text"
                label="Ciclo escolar"
                name="cycle"
                placeholder="Ingresa un ciclo escolar"
                validation="required|length:6"
                :validation-messages="{
                required: 'El ciclo escolar es obligatorio.',
                length: 'El ciclo escolar es muy corto.'
                }"
            />

            <FormKit
                type="text"
                label="Periodo"
                name="name"
                placeholder="Ingresa un periodo (Octubre - Noviembre)"
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>