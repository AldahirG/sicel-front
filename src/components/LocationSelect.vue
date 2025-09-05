<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import countryService from '../services/country.service'
import stateService from '../services/state.service'
import cityService from '../services/city.service'

// v-model del padre: { countryId, stateId, cityId }
const model = defineModel({
  type: Object,
  default: () => ({ countryId: '', stateId: '', cityId: '' }),
})

const countries = ref([])
const states = ref([])
const cities = ref([])

const hydrating = ref(true)
const customState = ref(null)
const customCity = ref(null)

const S = (v) => (v == null ? '' : String(v))
const N = (v) =>
  S(v)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()

const hydrate = async () => {
  hydrating.value = true
  customState.value = null
  customCity.value = null

  countries.value = (await countryService.getAll()).data.data

  if (model.value.countryId) {
    const countryId = S(model.value.countryId)

    states.value = (await stateService.getByCountry(countryId)).data.data

    const rawState = S(model.value.stateId)
    let stateId = ''
    if (rawState) {
      const st =
        states.value.find((s) => S(s.id) === rawState) ||
        states.value.find((s) => N(s.name) === N(rawState))
      if (st) {
        stateId = S(st.id)
        if (rawState !== stateId) model.value.stateId = stateId
      } else {
        customState.value = rawState
      }
    }

    if (stateId) {
      cities.value = (await cityService.getByState(stateId)).data.data

      const rawCity = S(model.value.cityId)
      if (rawCity) {
        const ct =
          cities.value.find((c) => S(c.id) === rawCity) ||
          cities.value.find((c) => N(c.name) === N(rawCity))
        if (ct) {
          const cityId = S(ct.id)
          if (rawCity !== cityId) model.value.cityId = cityId
        } else {
          customCity.value = rawCity
        }
      }
    } else {
      cities.value = []
    }
  } else {
    states.value = []
    cities.value = []
  }

  await nextTick()
  hydrating.value = false
}

// ── Watchers ──────────────────────────────────────────────────────────────
watch(
  () => model.value.countryId,
  async (newVal) => {
    if (hydrating.value) return
    model.value.stateId = ''
    model.value.cityId = ''
    states.value = []
    cities.value = []
    if (newVal) {
      states.value = (await stateService.getByCountry(S(newVal))).data.data
    }
  }
)

watch(
  () => model.value.stateId,
  async (newVal, oldVal) => {
    if (hydrating.value) return

    model.value.cityId = ''
    cities.value = []

    if (!newVal) return

    // 🔁 Asegura que stateId sea un UUID: si viene nombre, conviértelo a id.
    let stateId = S(newVal)
    let match =
      states.value.find((s) => S(s.id) === stateId) ||
      states.value.find((s) => N(s.name) === N(stateId))

    if (match && stateId !== S(match.id)) {
      // Cambiamos al id y salimos; el watcher se volverá a disparar con el id correcto
      model.value.stateId = S(match.id)
      return
    }

    if (!match) {
      // Estado inexistente en catálogo
      customState.value = stateId
      return
    }

    // Ya es un id válido
    cities.value = (await cityService.getByState(S(match.id))).data.data
  }
)

// Si el padre reemplaza el objeto completo luego, rehidrata
watch(
  model,
  () => {
    if (!hydrating.value) hydrate()
  },
  { deep: true }
)

onMounted(hydrate)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormKit
      type="select"
      label="País"
      v-model="model.countryId"
      :options="countries.map((c) => ({ label: c.name, value: S(c.id) }))"
      placeholder="Selecciona un país"
    />

    <FormKit
      :key="`state-${S(model.countryId)}`"
      type="select"
      label="Estado"
      v-model="model.stateId"
      :options="states.map((s) => ({ label: s.name, value: S(s.id) }))"
      placeholder="Selecciona un estado"
      :disabled="!states.length"
    />
    

    <FormKit
      :key="`city-${S(model.stateId)}`"
      type="select"
      label="Ciudad"
      v-model="model.cityId"
      :options="cities.map((c) => ({ label: c.name, value: S(c.id) }))"
      placeholder="Selecciona una ciudad"
      :disabled="!cities.length"
    />
  
  </div>
</template>
