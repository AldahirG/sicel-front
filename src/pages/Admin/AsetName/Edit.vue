<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import asetName from '../../../services/asetName.service';
import { useContactMediumsStore } from '../../../store/Admin/contactMedium'

import FormContainer from '../../../components/FormContainer.vue';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const store = useContactMediumsStore();
const contactMediums = ref([]);

const form = ref({
    name: '',
    contactTypesId: '',
});

const handleSubmit = async (form) => {
    try {
        const { data } = await asetName.update(id, form);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        })

        router.push({ name: 'admin/aset-names'})
    
    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        })
    }
}

onMounted(async () => {
    await store.getAll();
    contactMediums.value = store.contactMediums.map(contactMedium => ({
        label: contactMedium.name,
        value: contactMedium.id
    }));

    try {
        const { data } = await asetName.getById(id);
        form.value = {
            name: data.data.name,
            contactTypesId: data.data.contactType.id,
        };
    } catch (error) {
        router.push({ name: 'admin/aset-names' })
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
            incomplete-message="Lo sentimos hubo un error al editar la campaña." 
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
                label="Medio de contacto"
                name="contactTypesId"
                placeholder="Selecciona un medio de contacto"
                :options="contactMediums"
                validation="required"
                :validation-messages="{
                required: 'El medio de contacto es obligatorio.',
                }"
            />

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>