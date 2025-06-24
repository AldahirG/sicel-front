<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import countryService from '../services/country.service';
import stateService from '../services/state.service';
import cityService from '../services/city.service';

const model = defineModel(); // v-model

const countries = ref([]);
const states = ref([]);
const cities = ref([]);

const selectedCountry = computed(() =>
  countries.value.find(c => c.id === model.value.countryId)
);

const isMexico = computed(() => {
  const name = selectedCountry.value?.name || "";
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === "MEXICO";
});

onMounted(async () => {
  countries.value = (await countryService.getAll()).data.data;

  if (model.value.countryId) {
    states.value = (await stateService.getByCountry(model.value.countryId)).data.data;
  }

  if (model.value.stateId) {
    cities.value = (await cityService.getByState(model.value.stateId)).data.data;
  }
});

watch(() => model.value.countryId, async (newVal) => {
  model.value.stateId = "";
  model.value.cityId = "";
  cities.value = [];

  if (newVal) {
    states.value = (await stateService.getByCountry(newVal)).data.data;
  } else {
    states.value = [];
  }
});

watch(() => model.value.stateId, async (newVal) => {
  model.value.cityId = "";
  if (newVal) {
    cities.value = (await cityService.getByState(newVal)).data.data;
  } else {
    cities.value = [];
  }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- País -->
    <FormKit
      type="select"
      label="País"
      v-model="model.countryId"
      :options="countries.map(c => ({ label: c.name, value: c.id }))"
      placeholder="Selecciona un país"
    />

    <!-- Estado -->
    <FormKit
      v-if="isMexico"
      type="select"
      label="Estado"
      v-model="model.stateId"
      :options="states.map(s => ({ label: s.name, value: s.id }))"
      placeholder="Selecciona un estado"
    />
    <FormKit
      v-else
      type="text"
      label="Estado (manual)"
      v-model="model.stateId"
      placeholder="Escribe el estado"
    />

    <!-- Ciudad -->
    <FormKit
      v-if="isMexico"
      type="select"
      label="Ciudad"
      v-model="model.cityId"
      :options="cities.map(ci => ({ label: ci.name, value: ci.id }))"
      placeholder="Selecciona una ciudad"
    />
    <FormKit
      v-else
      type="text"
      label="Ciudad (manual)"
      v-model="model.cityId"
      placeholder="Escribe la ciudad"
    />
  </div>
</template>
