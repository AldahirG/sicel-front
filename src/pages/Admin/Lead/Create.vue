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
          'HOMBRE',
          'MUJER',
        ]"
      />

      <div class="flex gap-4">
        <div class="w-1/2">
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
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Seguimiento"
            name="followUpId"
            placeholder="Selecciona un seguimiento"
            :options="followUps.map(followUp => ({ label: followUp.name, value: followUp.id }))"
          />
        </div>
      </div>

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

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="text"
            label="Carrera de interés"
            name="careerInterest"
            placeholder="Ingresa la carrera de interés"
          />
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Grado escolar"
            name="grade"
            placeholder="Selecciona un grado escolar"
            :options="grades.map(grade => ({ label: grade.name, value: grade.id }))"
          />
        </div>
      </div>

      <FormKit
        type="select"
        label="Beca ofrecida"
        name="scholarship"
        placeholder="Selecciona una beca"
        :options="[
          'INS',
          'INSO',
          'REZA',
        ]"
      />

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="text"
            label="Escuela de procedencia"
            name="formerSchool"
            placeholder="Ingresa la escuela de procedencia"
          />
        </div>

        <div class="w-1/2">
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
        </div>
      </div>

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

      <div class="flex gap-4">
        <div class="w-1/2">
          <FormKit
            type="select"
            label="Ciclo escolar"
            name="cycleId"
            placeholder="Selecciona un ciclo escolar"
            :options="cycles.map(cycle => ({ label: cycle.cycle, value: cycle.id }))"
          />
        </div>

        <div class="w-1/2">
          <FormKit
            type="select"
            label="Semestre de ingreso"
            name="cycleId"
            placeholder="Selecciona un semestre de ingreso"
            :options="[
              'PUBLICA',
              'PRIVADA',
            ]"
          />
        </div>
      </div>

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>