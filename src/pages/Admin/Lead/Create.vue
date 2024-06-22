<script setup>
import { useRouter } from "vue-router"
import { defineAsyncComponent, inject, ref, onMounted } from 'vue';
import { reset } from "@formkit/vue"

import lead from '../../../services/lead.service';
import { LeadResource } from "./mapper/lead.mapper";

import { useFollowUpsStore } from '../../../store/Admin/followUp';
import { useGradesStore } from '../../../store/Admin/grades';
import { useAsetNamesStore } from '../../../store/Admin/asetNames';
import { useCampaignsStore } from '../../../store/Admin/campaigns';
import { useCitiesStore } from '../../../store/Admin/cities';
import { useCyclesStore } from '../../../store/Admin/cycles';

import InputGroup from "../../../components/InputGroup.vue";
import FormRow from "../../../components/FormRow.vue";
const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();

const followUpStore = useFollowUpsStore();
const followUps = ref([]);

const gradeStore = useGradesStore();
const grades = ref([]);

const asetNameStore = useAsetNamesStore();
const asetNames = ref([]);

const campaignStore = useCampaignsStore();
const campaigns = ref([]);

const cityStore = useCitiesStore();
const cities = ref([]);

const cycleStore = useCyclesStore();
const cycles = ref([]);

const selectedReferenceType = ref('');

const handleSubmit = async (form) => {
  try {
    
    const mapper = LeadResource(form);

    const { data } = await lead.create(mapper);
    const message = data.http.message;

    toast.open({
      message: message,
      type: 'success'
    });

    reset('register');

    router.push({ name: 'admin/leads' });

  } catch (error) {
    toast.open({
      message: error.response.data.message,
      type: 'error'
    });
  }
};

onMounted(async () => {
    await followUpStore.getAll();
    followUps.value = followUpStore.followUps;

    await gradeStore.getAll();
    grades.value = gradeStore.grades;

    await asetNameStore.getAll();
    asetNames.value = asetNameStore.asetNames;

    await campaignStore.getAll();
    campaigns.value = campaignStore.campaigns;

    await cityStore.getAll();
    cities.value = cityStore.cities;

    await cycleStore.getAll();
    cycles.value = cycleStore.cycles;
});

</script>

<template>
  <FormContainer maxWidth="max-w-5xl">
    <FormKit
      id="register"
      type="form"
      :actions="false"
      incomplete-message="Lo sentimos hubo un error al crear el lead."
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
          length: 'Ingresa un nombre válido.'
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
        validation="required|length:10"
        :validation-messages="{
          required: 'El número de teléfono es obligatorio.',
          length: 'Ingresa un número de teléfono válido.'
        }"
      />

      <FormKit
        type="email"
        label="Correo electrónico"
        name="email"
        placeholder="Ingresa un correo electrónico"
        validation="required|email"
        :validation-messages="{
          required: 'El correo electrónico es obligatorio.',
          length: 'Ingresa un correo electrónico válido.'
        }"
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

      <FormKit
        type="select"
        label="Tipo de referido"
        name="type"
        placeholder="Selecciona un tipo de referido"
        :options="[
          'NINGUNO',
          'ALUMNO',
          'PERSONAL_UNINTER',
          'FAMILIAR_ALUMNO'
        ]"
        v-model="selectedReferenceType"
      />

      <InputGroup v-if="selectedReferenceType !== 'NINGUNO'">
        <FormRow>
          <FormKit
            type="text"
            label="Nombre del referido"
            name="nameReference"
            placeholder="Ingresa el nombre del referido"
            validation="length:3"
            :validation-messages="{
              length: 'Ingresa un nombre válido.'
            }"
          />
        </FormRow>

        <FormRow>
          <FormKit
            type="text"
            label="Donde obtuvo el dato"
            name="dataSource"
            placeholder="Ingresa donde obtuvo el dato"
            validation="length:3"
            :validation-messages="{
              length: 'Ingresa un dato válido.'
            }"
          />
        </FormRow>
      </InputGroup>

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>