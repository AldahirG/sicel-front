<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import lead from '../../../services/lead.service';
import { LeadResource } from "./mapper/lead.mapper";

import followUp from '../../../services/followUp.service';
import grade from '../../../services/grade.service';
import asetName from '../../../services/asetName.service';
import campaign from '../../../services/campaign.service';
import city from '../../../services/city.service';
import cycle from '../../../services/cycle.service';

import InputGroup from "../../../components/InputGroup.vue";
import FormRow from "../../../components/FormRow.vue";
import FormContainer from '../../../components/FormContainer.vue';
import Button from "../../../components/Button.vue";

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const followUps = ref([]);
const grades = ref([]);
const asetNames = ref([]);
const campaigns = ref([]);
const cities = ref([]);
const cycles = ref([]);

const form = ref({});

const handleSubmit = async (form) => {
    try {
        const mapper = LeadResource(form);

        const { data } = await lead.update(id, mapper);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        });

        router.push({ name: 'admin/leads' });

    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        });
    }
};

onMounted(async () => {
    try {
        const followUpResponse = await followUp.getAll();
        followUps.value = followUpResponse.data.data;

        const gradeResponse = await grade.getAll();
        grades.value = gradeResponse.data.data;

        const asetNameResponse = await asetName.getAll();
        asetNames.value = asetNameResponse.data.data;

        const campaignResponse = await campaign.getAll();
        campaigns.value = campaignResponse.data.data;

        const cityResponse = await city.getAll();
        cities.value = cityResponse.data.data;

        const cycleResponse = await cycle.getAll();
        cycles.value = cycleResponse.data.data;

        const { data } = await lead.getById(id);
        form.value = {
            name: data.data?.information?.name,
            genre: data.data?.information?.genre,
            enrollmentStatus: data.data?.information?.enrollmentStatus,
            followUpId: data.data?.information?.followUp?.id,
            phone: data.data?.phones,
            email: data.data?.emails,
            careerInterest: data.data?.information?.careerInterest,
            gradeId: data.data?.grade?.id,
            scholarship: data.data?.scholarship,
            formerSchool: data.data?.information?.formerSchool,
            typeSchool: data.data?.information?.typeSchool,
            asetNameId: data.data?.asetName?.id,
            campaignId: data.data?.campaign?.id,
            cityId: data.data.address.city?.id,
            cycleId: data.data.cycle?.id,
            semester: data.data?.semester,
        };
    } catch (error) {
        console.log(error)
    }
})

</script>

<template>
    <FormContainer maxWidth="max-w-5xl">
        <FormKit 
            id="edit" 
            type="form"
            v-model="form"
            :actions="false"
            incomplete-message="Lo sentimos hubo un error al editar el lead." 
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
                label="Sexo"
                name="genre"
                placeholder="Selecciona un sexo"
                :options="[
                    'FEMENINO',
                    'MASCULINO',
                ]"
            />

            <InputGroup>
                <FormRow>
                    <FormKit
                        type="select"
                        label="Status"
                        name="enrollmentStatus"
                        placeholder="Selecciona un status"
                        :options="[
                            'INS',
                            'INSO',
                            'REZA',
                        ]"
                    />
                </FormRow>

                <FormRow>
                    <FormKit
                        type="select"
                        label="Seguimiento"
                        name="followUpId"
                        placeholder="Selecciona un seguimiento"
                        :options="followUps.map(followUp => ({ label: followUp.name, value: followUp.id }))"
                    />
                </FormRow>
            </InputGroup>

            <FormKit
                type="tel"
                label="Teléfono"
                name="phone"
                placeholder="Ingresa un número de teléfono"
            />

            <FormKit
                type="email"
                label="Correo electrónico"
                name="email"
                placeholder="Ingresa un correo electrónico"
            />

            <InputGroup>
                <FormRow>
                    <FormKit
                        type="text"
                        label="Carrera de interés"
                        name="careerInterest"
                        placeholder="Ingresa la carrera de interés"
                    />
                </FormRow>

                <FormRow>
                    <FormKit
                        type="select"
                        label="Grado escolar"
                        name="gradeId"
                        placeholder="Selecciona un grado escolar"
                        :options="grades.map(grade => ({ label: grade.name, value: grade.id }))"
                    />
                </FormRow>
            </InputGroup>

            <FormKit
                type="select"
                label="Beca ofrecida"
                name="scholarship"
                placeholder="Selecciona una beca"
                :options="[
                    '0', 
                    '10', 
                    '15', 
                    '20', 
                    '25', 
                    '30', 
                    '35', 
                    '40', 
                    '45', 
                    '50', 
                    '55', 
                    '60', 
                    '70',
                    '80', 
                    '90', 
                    '100', 
                    'APOYO TRABAJADOR', 
                    'ORFANDAD',
                ]"
            />

            <InputGroup>
                <FormRow>
                    <FormKit
                        type="text"
                        label="Escuela de procedencia"
                        name="formerSchool"
                        placeholder="Ingresa la escuela de procedencia"
                    />
                </FormRow>

                <FormRow>
                    <FormKit
                        type="select"
                        label="Tipo de escuela"
                        name="typeSchool"
                        placeholder="Selecciona un tipo de escuela"
                        :options="[
                            'PUBLICA',
                            'PRIVADA',
                        ]"
                    />
                </FormRow>
            </InputGroup>

            <FormKit
                type="select"
                label="Medio de contacto"
                name="asetNameId"
                placeholder="Selecciona un medio de contacto"
                :options="asetNames.map(asetName => ({ label: [asetName.contactType.name + ' - ' + asetName.name], value: asetName.id }))"
            />

            <FormKit
                type="select"
                label="Campaña"
                name="campaignId"
                placeholder="Selecciona una campaña"
                :options="campaigns.map(campaign => ({ label: campaign.name, value: campaign.id }))"
            />

            <FormKit
                type="select"
                label="Ciudad"
                name="cityId"
                placeholder="Selecciona una ciudad"
                :options="cities.map(city => ({ label: city.name, value: city.id }))"
            />

            <InputGroup>
                <FormRow>
                    <FormKit
                        type="select"
                        label="Ciclo escolar"
                        name="cycleId"
                        placeholder="Selecciona un ciclo escolar"
                        :options="cycles.map(cycle => ({ label: cycle.cycle, value: cycle.id }))"
                    />
                </FormRow>

                <FormRow>
                    <FormKit
                        type="select"
                        label="Semestre de ingreso"
                        name="semester"
                        placeholder="Selecciona un semestre de ingreso"
                        :options="[
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            '10',
                        ]"
                    />
                </FormRow>
            </InputGroup>

            <FormKit type="submit">Guardar</FormKit>
        </FormKit>
    </FormContainer>
</template>