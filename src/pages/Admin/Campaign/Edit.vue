<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import campaign from '../../../services/campaign.service';

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const form = ref({
    name: '',
    type: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await campaign.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/campaigns'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    try {
        const { data } = await campaign.getById(id);
        form.value = {
            name: data.data.name,
            type: data.data.type,
        };
    } catch (error) {
        router.push({ name: 'admin/campaigns' })
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
            incomplete-message="Lo sentimos hubo un error al editar la campaign_name." 
            @submit="handleSubmit"
        >
            <FormKit 
                type="text" 
                label="Campaign_name"
                name="name"
                placeholder="Ingresa un campaign_name"
                validation="required|length:3" 
                :validation-messages="{
                    required: 'El nombre es obligatorio.',
                    length: 'El nombre es muy corto.'
                }" 
            />

            <FormKit
                type="select"
                label="Tipo de campaña"
                name="type"
                placeholder="Selecciona un tipo de campaña"
                :options="[
                    'PAUTA',
                    'ORGANICA',
                ]"
                validation="required"
                :validation-messages="{
                required: 'El tipo de campaña es obligatorio.',
                }"
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>