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
const form = ref({
  location: {
    countryId: '',
    stateId: '',
    cityId: ''
  },
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
    // mapper.dateContact = new Date().toISOString(); // ⏰ fecha actual
    mapper.name = mapper.name?.trim();
    mapper.formerSchool = mapper.formerSchool?.trim();
    // 🔧 Asegura que sean arrays de strings
 mapper.phone = form.phone ? [String(form.phone)] : undefined;
mapper.email = form.email ? [String(form.email)] : undefined;

 // Añade país, estado y ciudad desde `form.location`
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

// Nombre: letras y espacios
const normalizeName = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z\s]/gi, "")
    .toUpperCase() || "";

// Teléfono: solo números (sin espacios, +52, paréntesis, etc.)
const normalizePhone = (value) =>
  value?.replace(/\D/g, "").slice(0, 10) || "";

// Email: sin acentos, permite @ . - _ pero no espacios
const normalizeEmail = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9@._\-]/g, "")
    .trim() || "";

// Escuela: letras, espacios y números
const normalizeSchool = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9\s]/gi, "")
    .toUpperCase() || "";

// Otros
const normalizeAlpha = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z_\s]/gi, "").trim().toUpperCase() || "";

const normalizeAlphanumeric = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9]/gi, "").trim().toUpperCase() || "";

const normalizeBeta = (value) =>
  value?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z0-9_]/gi, "").toUpperCase() || "";

// Aplicar normalización reactiva
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
}, { deep: true });

onMounted(async () => {
  const followUpStore = useFollowUpsStore();
  const gradeStore = useGradesStore();
  const asetNameStore = useAsetNamesStore();
  const campaignStore = useCampaignsStore();
  const cityStore = useCitiesStore();
  const cycleStore = useCyclesStore();

  await followUpStore.getAll();
  await gradeStore.getAll();
  await asetNameStore.getAll();
  await campaignStore.getAll();
  await cityStore.getAll();
  await cycleStore.getAll();

  followUps.value = followUpStore.followUps || [];
  grades.value = gradeStore.grades || [];

  // Ordenamos y agrupamos los asetNames
  const groupedAsetNames = asetNameStore.asetNames || [];
  
  asetNames.value = groupedAsetNames
    .sort((a, b) => {
      const typeA = a.contactType.name || "";
      const typeB = b.contactType.name || "";

      // Si los tipos son iguales, ordenamos alfabéticamente por el nombre
      if (typeA === typeB) {
        return a.name.localeCompare(b.name);
      }

      // Si los tipos son diferentes, ordenamos alfabéticamente por el tipo
      return typeA.localeCompare(typeB);
    });

  campaigns.value = campaignStore.campaigns || [];
  cities.value = cityStore.cities || [];
  cycles.value = cycleStore.cycles || [];
});

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
        label="Nombre"
        placeholder="Nombre completo"
        validation="required"
      />

      <FormKit
        type="select"
        name="genre"
        label="Sexo"
        :options="[{ label: 'Selecciona un sexo', value: '' }, 'FEMENINO', 'MASCULINO']"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            name="enrollmentStatus"
            label="Status"
            :options="[{ label: 'Selecciona un status', value: '' }, 'INS', 'INSO', 'REZA']"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="followUpId"
            label="Seguimiento"
            :options="[{ label: 'Selecciona un seguimiento', value: '' }, ...followUps.map(f => ({ label: f.name, value: f.id }))]"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="tel"
        name="phone"
        label="Teléfono"
        validation="matches:/^[0-9]{10}$/"
       />

      <FormKit
         type="email"
         name="email"
         label="Correo electrónico"
         validation="email"
        />

      <InputGroup>
        <FormRow>
          <FormKit
            type="text"
            name="careerInterest"
            label="Carrera de interés"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="gradeId"
            label="Grado escolar"
            :options="[{ label: 'Selecciona un grado escolar', value: '' }, ...grades.map(g => ({ label: g.name, value: g.id }))]"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        name="scholarship"
        label="Beca ofrecida"
        :options="[
          { label: 'Selecciona una beca', value: '' },
          '0','5','10','15','20','25','30','35','40','45','50','55','60',
          'APOYO TRABAJADOR','ORFANDAD','PATRONATO','PRACTICANTE RH'
        ]"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="text"
            name="formerSchool"
            label="Escuela de procedencia"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="typeSchool"
            label="Tipo de escuela"
            :options="[{ label: 'Selecciona un tipo de escuela', value: '' }, 'PUBLICA', 'PRIVADA']"
          />
        </FormRow>
      </InputGroup>
<FormKit
  type="select"
  name="asetNameId"
  label="Aset Name"
  :options="[{ label: 'Selecciona un Aset Name', value: '' }, ...asetNames.map(a => ({ label: `${a.contactType.name} - ${a.name}`, value: a.id }))]"
/>


      <FormKit
        type="select"
        name="campaignId"
        label="Campaña"
        :options="[{ label: 'Selecciona una campaña', value: '' }, ...campaigns.map(c => ({ label: c.name, value: c.id }))]"
      />

      <LocationSelect v-model="form.location" />


      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            name="cycleId"
            label="Ciclo escolar"
            :options="[{ label: 'Selecciona un ciclo escolar', value: '' }, ...cycles.map(c => ({ label: c.cycle, value: c.id }))]"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            name="semester"
            label="Semestre/Cuatrimestre/Año de ingreso"
            :options="[ 
              { label: 'Selecciona un semestre', value: '' },
              '1','2','3','4','5','6','7','8','9','10','NO ESPECIFICADO','OTRO'
            ]"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        name="type"
        label="Tipo de referido"
        :options="[{ label: 'Selecciona un tipo de referido', value: '' }, 'NINGUNO', 'ALUMNO', 'PERSONAL_UNINTER', 'FAMILIAR_ALUMNO']"
      />

      <InputGroup>
        <FormRow>
          <!-- Campo dinámico: depende del tipo de referido -->
          <FormKit
            v-if="form.type === 'PERSONAL_UNINTER'"
            type="select"
            name="nameReference"
            label="Nombre del referido"
            :options="[{ label: 'Selecciona un referido', value: '' }, ...personalUninterList]"
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
