<script setup>
import { useRouter } from "vue-router";
import { defineAsyncComponent, inject, watch, ref, onMounted } from 'vue';
import { reset } from "@formkit/vue";

import lead from '../../../services/lead.service';
import { LeadResource } from "../../Admin/Lead/mapper/lead.mapper";
import { useAuthStore } from '../../../store/auth';

import { useFollowUpsStore } from '../../../store/Admin/followUp';
import { useGradesStore } from '../../../store/Admin/grades';
import { useAsetNamesStore } from '../../../store/Admin/asetNames';
import { useCampaignsStore } from '../../../store/Admin/campaigns';
import { useCitiesStore } from '../../../store/Admin/cities';
import { useCyclesStore } from '../../../store/Admin/cycles';
import { useCareersStore } from '../../../store/Admin/careers';

import InputGroup from "../../../components/InputGroup.vue";
import FormRow from "../../../components/FormRow.vue";
import LocationSelect from "../../../components/LocationSelect.vue";

const FormContainer = defineAsyncComponent(() =>
  import('../../../components/FormContainer.vue')
);

const toast = inject('toast');
const router = useRouter();
const auth = useAuthStore();

const followUps = ref([]);
const grades = ref([]);
const asetNames = ref([]);
const campaigns = ref([]);
const cities = ref([]);
const cycles = ref([]);
const careers = ref([]);

const form = ref({
  location: {
    countryId: '',
    stateId: '',
    cityId: ''
  },
  program: '',
  intern: '',
  // ...otros campos existentes
});

const personalUninterList = [
  "ADRIAN MOLINA", "ALEJANDRA RIVAS", "ALDAHIR GOMEZ", "ANALIT ROMAN ARCE", "ANGELICA NIETO",
  "AXEL ESPINOSA", "BETSABE FLORES", "BRYAN MURGA", "CESAR SANTA OLALLA", "CLAUDIA GALAN",
  "EMMA ARRIAGA", "ISIS CORTES", "JAVIER DE JESUS", "JAVIER ESPINOSA", "JESUS GUZMAN",
  "JESUS TRILLO", "JORGE NARVAEZ", "JOSE JAVIER DEL CASTILLO", "KEREN GOMEZ", "MARIAN SALGADO",
  "MARCO SALGADO", "MELYSSA MONROY", "RAUL CASTILLEJA", "THALIA SANCHEZ", "XIMENA MARTINEZ",
  "YOALI APARICIO", "YANIN VAZQUEZ", "NINGUNO DE LOS ANTERIORES",
];

// ** Validación y normalización de los campos **
const handleSubmit = async (form) => {
  try {
    const filteredForm = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value != null && value !== "")
    );

    const mapper = LeadResource(filteredForm);
    mapper.name = mapper.name?.trim();
    mapper.formerSchool = mapper.formerSchool?.trim();

    mapper.phone = form.phone ? [String(form.phone)] : undefined;
    mapper.email = form.email ? [String(form.email)] : undefined;

    mapper.countryId = form.location?.countryId;
    mapper.stateId = form.location?.stateId;
    mapper.cityId = form.location?.cityId;

    const { data } = await lead.create(mapper);
    console.log('Formulario mapeado:', mapper);

    toast.open({ message: data.http.message, type: 'success' });
    reset('register');
    router.push({ name: 'promoter/leads' });
  } catch (error) {
    toast.open({
      message: Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error.response?.data?.message || 'Error inesperado al crear el lead.',
      type: 'error'
    });
  }
};

// === Normalización personalizada por campo ===
const normalizeName = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z\s]/gi, "")
    .toUpperCase() || "";

const normalizePhone = (value) =>
  value?.replace(/\D/g, "").slice(0, 10) || "";

const normalizeEmail = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9@._\-]/g, "")
    .trim() || "";

const normalizeSchool = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9\s]/gi, "")
    .toUpperCase() || "";

const normalizeAlpha = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z_\s]/gi, "").trim().toUpperCase() || "";

const normalizeAlphanumeric = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9]/gi, "").trim().toUpperCase() || "";

const normalizeBeta = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9_]/gi, "").toUpperCase() || "";

watch(form, (val) => {
  form.value.name = normalizeName(val.name);
  form.value.phone = normalizePhone(val.phone);
  form.value.email = normalizeEmail(val.email);
  form.value.formerSchool = normalizeSchool(val.formerSchool);

  form.value.careerInterest = normalizeAlpha(val.careerInterest);
  form.value.comments = normalizeAlpha(val.comments);
  form.value.dataSource = normalizeAlpha(val.dataSource);
  form.value.matricula = normalizeAlphanumeric(val.matricula);
  form.value.folio = normalizeAlphanumeric(val.folio);
  form.value.curp = normalizeAlphanumeric(val.curp);
  form.value.program = normalizeAlpha(val.program);
}, { deep: true });

onMounted(async () => {
  const followUpStore = useFollowUpsStore();
  const gradeStore = useGradesStore();
  const asetNameStore = useAsetNamesStore();
  const campaignStore = useCampaignsStore();
  const cityStore = useCitiesStore();
  const cycleStore = useCyclesStore();
  const careerStore = useCareersStore();

  await followUpStore.getAll();
  await gradeStore.getAll();
  await asetNameStore.getAll();
  await campaignStore.getAll();
  await cityStore.getAll();
  await cycleStore.getAll();
  await careerStore.getAll();

  followUps.value = followUpStore.followUps || [];
  grades.value = gradeStore.grades || [];

  const groupedAsetNames = asetNameStore.asetNames || [];
  asetNames.value = groupedAsetNames.sort((a, b) => {
    const typeA = a.contactType.name || "";
    const typeB = b.contactType.name || "";

    if (typeA === typeB) {
      return a.name.localeCompare(b.name);
    }
    return typeA.localeCompare(typeB);
  });

  campaigns.value = campaignStore.campaigns || [];
  cities.value = cityStore.cities || [];
  cycles.value = cycleStore.cycles || [];
  careers.value = careerStore.careers || [];
});

const sortOptions = (arr, labelKey = 'label') => {
  return [...arr].sort((a, b) => {
    const labelA = a[labelKey]?.toUpperCase?.() || '';
    const labelB = b[labelKey]?.toUpperCase?.() || '';
    return labelA.localeCompare(labelB);
  });
};

</script>
<template>
  <FormContainer maxWidth="max-w-5xl">
    <FormKit
      id="register"
      type="form"
      v-model="form"
      :actions="false"
      incomplete-message="Error al crear el lead."
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        name="name"
        label="Nombre completo"
        placeholder="Nombre completo"
        validation="required"
      />

      <FormKit
        type="select"
        name="genre"
        label="Sexo"
        :options="sortOptions([{ label: 'Selecciona un sexo', value: '' }, { label: 'FEMENINO', value: 'FEMENINO' }, { label: 'MASCULINO', value: 'MASCULINO' }])"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            name="enrollmentStatus"
            label="Status"
            :options="sortOptions([{ label: 'Selecciona un status', value: '' }, { label: 'INS', value: 'INS' }, { label: 'INSO', value: 'INSO' }, { label: 'REZA', value: 'REZA' }])"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="followUpId"
            label="Seguimiento"
            :options="sortOptions([{ label: 'Selecciona un seguimiento', value: '' }, ...followUps.map(f => ({ label: f.name, value: f.id }))])"
          />
        </FormRow>
      </InputGroup>

      <FormKit type="tel" name="phone" label="Teléfono" validation="matches:/^[0-9]{10}$/"/>
      <FormKit type="email" name="email" label="Correo electrónico" validation="email"/>

      <InputGroup>
        <FormRow>
          <FormKit type="text" name="careerInterest" label="Carrera de interés" />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="gradeId"
            label="Grado escolar"
            :options="sortOptions([{ label: 'Selecciona un grado escolar', value: '' }, ...grades.map(g => ({ label: g.name, value: g.id }))])"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="program"
            label="Programa"
            v-model="form.program"
            :options="sortOptions([
              { label: 'Selecciona un programa', value: '' },
              ...careers
                .map(c => c.program)
                .filter((v, i, a) => v && a.indexOf(v) === i)
                .map(p => ({ label: p, value: p }))
            ])"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        name="scholarship"
        label="Beca ofrecida"
        :options="sortOptions([
          { label: 'Selecciona una beca', value: '' },
          ...['0','5','10','15','20','25','30','35','40','45','50','55','60','APOYO TRABAJADOR','ORFANDAD','PATRONATO','PRACTICANTE RH'].map(v => ({ label: v, value: v }))
        ])"
      />

      <InputGroup>
        <FormRow>
          <FormKit type="text" name="formerSchool" label="Escuela de procedencia" />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="typeSchool"
            label="Tipo de escuela"
            :options="sortOptions([
              { label: 'Selecciona un tipo de escuela', value: '' },
              { label: 'PRIVADA', value: 'PRIVADA' },
              { label: 'PUBLICA', value: 'PUBLICA' }
            ])"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        name="asetNameId"
        label="Aset Name"
        :options="sortOptions([{ label: 'Selecciona un Aset Name', value: '' }, ...asetNames.map(a => ({ label: `${a.contactType.name} - ${a.name}`, value: a.id }))])"
      />

      <FormKit
        type="select"
        name="campaignId"
        label="Campaña"
        :options="sortOptions([{ label: 'Selecciona una campaña', value: '' }, ...campaigns.map(c => ({ label: c.name, value: c.id }))])"
      />

      <LocationSelect v-model="form.location" />

      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            name="cycleId"
            label="Ciclo escolar"
            :options="sortOptions([{ label: 'Selecciona un ciclo escolar', value: '' }, ...cycles.map(c => ({ label: c.cycle, value: c.id }))])"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="semester"
            label="Semestre/Cuatrimestre/Año de ingreso"
            :options="sortOptions([
              { label: 'Selecciona un semestre', value: '' },
              ...['1','2','3','4','5','6','7','8','9','10','NO ESPECIFICADO','OTRO'].map(v => ({ label: v, value: v }))
            ])"
          />
        </FormRow>

        <FormKit
          type="select"
          name="intern"
          label="INTERNO/EXTERNO"
          :options="sortOptions([
            { label: 'Selecciona una opción', value: '' },
            { label: 'INTERNO', value: 'INTERNO' },
            { label: 'EXTERNO', value: 'EXTERNO' }
          ])"
        />
      </InputGroup>

      <FormKit
        type="select"
        name="type"
        label="Tipo de referido"
        :options="sortOptions([
          { label: 'Selecciona un tipo de referido', value: '' },
          { label: 'ALUMNO', value: 'ALUMNO' },
          { label: 'FAMILIAR_ALUMNO', value: 'FAMILIAR_ALUMNO' },
          { label: 'NINGUNO', value: 'NINGUNO' },
          { label: 'PERSONAL_UNINTER', value: 'PERSONAL_UNINTER' }
        ])"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            v-if="form.type === 'PERSONAL_UNINTER'"
            type="select"
            name="nameReference"
            label="Nombre del referido"
            :options="sortOptions([{ label: 'Selecciona un referido', value: '' }, ...personalUninterList.map(n => ({ label: n, value: n }))])"
          />
          <FormKit
            v-else
            type="text"
            name="nameReference"
            label="Nombre del referido"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="text"
            name="dataSource"
            label="Dónde obtuvo el dato"
          />
        </FormRow>
      </InputGroup>

      <FormKit type="submit">Guardar</FormKit>
    </FormKit>
  </FormContainer>
</template>
