<script setup>
import axios from 'axios';
import { getId } from '../../../routes/auth';
import { computed, defineAsyncComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const DashboardLayout = defineAsyncComponent(() =>
  import('../../../layouts/DashboardLayout.vue')
)

const BigFormContainer = defineAsyncComponent(() =>
  import('../../../components/BigFormContainer.vue')
)

const InputGroup = defineAsyncComponent(() =>
  import('../../../components/InputGroup.vue')
) 

const InputLabel = defineAsyncComponent(() =>
  import('../../../components/InputLabel.vue')
)

const TextInput = defineAsyncComponent(() =>
  import('../../../components/TextInput.vue')
)

// URL de API
const url = import.meta.env.VITE_API_URL;

// Paths for breadcrumbs
const bread = [
    { label: "Dashboard", name: 'promoter' },
    { label: "Leads", name: 'promoter/leads' },
    { label: "Crear", name: 'createLeadPromotor' },
]

const router = useRouter();
const startValidation = ref(false);

// Nombre completo
const name = ref('');
// Sexo
const genre = ref('');
// Status
const enrollmentStatus = ref('');
// Seguimiento
const followId = ref('');
// Teléfono
const tel = ref('');
// Teléfono opcional
const telOptional = ref('');
// Correo electrónico
const email = ref('');
// Correo electrónico opcional
const emailOptional = ref('');
// Carrera de interés
const career = ref('');
// Grado escolar
const gradeId = ref('');
// Beca ofrecida
const scholarship = ref('')
// Escuela de procedencia
const formerSchool = ref('');
// Tipo de escuela
const typeSchool = ref('');
// Medio de contacto
const contactMediumId = ref('');
// Aset Name
const asetNameId = ref('');
// Campaña
const campaignId = ref('');
// País
const country = ref('');
// Estado
const state = ref('');
// Ciudad
const city = ref('');
// Ciclo escolar
const schoolYearId = ref('');
// Semestre de ingreso
const admissionSemester = ref('');
// Tipo de referido
const referenceType = ref('');
// Nombre del referido
const referenceName = ref('');
// Donde obtuvo el dato

const dataSource = ref('');
const countries = ref([]);
const states = ref([]);
const selectedStateCities = ref([]);
const campaigns = ref([]);
const followUps = ref([]);
const grades = ref([]);
const contactMediums = ref([]);
const asetNames = ref([]);
const schoolYears = ref([]);

// Semestres
const admissionSemesters = ref([
    { id: 1, value: "1", text: "1" },
    { id: 2, value: "2", text: "2" },
    { id: 3, value: "3", text: "3" },
    { id: 4, value: "4", text: "4" },
    { id: 5, value: "5", text: "5" },
    { id: 6, value: "6", text: "6" },
    { id: 7, value: "7", text: "7" },
    { id: 8, value: "8", text: "8" },
    { id: 9, value: "9", text: "9" },
    { id: 10, value: "10", text: "10" },
]);

// Becas
const scholarships = [
    '0', '10', '15', '20', '25', '30', '35', 
    '40', '45', '50', '55', '60', '70','80', 
    '90', '100', 'APOYO TRABAJADOR', 'ORFANDAD'
];

/*
    Validar que medio de contacto tenga un Aset Name
*/
const getContactMediums = async () => {
    try {
        const response = await axios.get(`${url}/contact-mediums/list`);
        contactMediums.value = response.data;
    } catch (error) {
        console.error('Error al obtener los medios de contacto:', error);
    }
};

const getAsetNames = async () => {
    if (contactMediumId.value) {
        try {
            const response = await axios.get(`${url}/contact-mediums/${contactMediumId.value}/aset-names`);
            asetNames.value = response.data;

            if (asetNames.value.length === 0) {
                asetNameId.value = null;
            } else {
            // Si hay Aset Names, verificar si el asetNameId seleccionado es válido
                const selectedAsetName = asetNames.value.find(asetName => asetName.id === asetNameId.value);
                
                if (!selectedAsetName) {
                    // Si el asetNameId seleccionado no es válido, establecer asetNameId como nulo
                    asetNameId.value = null;
                }
            }
        } catch (error) {
        console.error('Error al obtener los aset names:', error);
        }
    }
};
/*
    Fin de la validación
*/


function updateCities() {
    const stateSelected = states.value.find(s => s.nombre === state.value);
    selectedStateCities.value = stateSelected ? stateSelected.ciudades : [];
}

// Validaciones
const isValidName = computed(() => {
  return startValidation.value ? name.value.length > 2 : null;
});

const isValidTel = computed(() => {
  return startValidation.value ? tel.value.trim().length >= 10 : null;
});

const isValidEmail = computed(() => {
  return startValidation.value ?
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) : null;
});

const isValidStatus = computed(() => {
  return startValidation.value ? enrollmentStatus.value !== '' : null;
});

const isValidFollowId = computed(() => {
  return startValidation.value ? followId.value !== '' : null;
});

const isValidCampaignId = computed(() => {
  return startValidation.value ? campaignId.value !== '' : null;
});

async function register() {
  startValidation.value = true;

  // Validar todos los campos antes de enviar
  if (
    !isValidName.value || 
    !isValidEmail.value ||
    !isValidTel.value ||
    !isValidStatus.value ||
    !isValidFollowId.value ||
    !isValidCampaignId.value
    ) {
        return;
  }

  // Promotor
    const userId = await getId();

  // Recolectar los datos del formulario
  const formData = {
    name: name.value,
    genre: genre.value || null,
    enrollmentStatus: enrollmentStatus.value,
    followId: followId.value,
    tel: tel.value,
    telOptional: telOptional.value || null,
    email: email.value,
    emailOptional:emailOptional.value || null,
    career: career.value || null,
    gradeId: gradeId.value || null,
    scholarship: scholarship.value || null,
    formerSchool: formerSchool.value || null,
    typeSchool: typeSchool.value || null,
    contactMediumId: contactMediumId.value || null,
    asetNameId: asetNameId.value || null,
    campaignId: campaignId.value,
    country: country.value || null,
    state: state.value || null,
    city: city.value || null,
    schoolYearId: schoolYearId.value || null,
    referenceType: referenceType.value || null,
    referenceName: referenceName.value || null,
    dataSource: dataSource.value || null,
    admissionSemester: admissionSemester.value || null,
    userId: userId
  };

  // Enviar datos a tu endpoint utilizando Axios
  axios.post(`${url}/promoter/lead`, formData)
    .then(response => {
      router.push("/promoter/leads");
      console.clear();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    }); 
}

onMounted(async () => {
  try {
    const countriesResponse = await axios.get('/json/countries.json');
    countries.value = countriesResponse.data;

    const statesResponse = await axios.get('/json/states-mexico.json');
    states.value = statesResponse.data;

    const campaignsResponse = await axios.get(`${url}/campaigns/list`);
    campaigns.value = campaignsResponse.data;

    const followUpsResponse = await axios.get(`${url}/follow-ups/list`);
    followUps.value = followUpsResponse.data;

    const gradesResponse = await axios.get(`${url}/grades/list`);
    grades.value = gradesResponse.data;

    const schoolYearsResponse = await axios.get(`${url}/school-years/list`);
    schoolYears.value = schoolYearsResponse.data;

    getContactMediums();
  } catch (error) {
    console.error('Error al cargar los datos', error);
  }
});

</script>

<template>
    <DashboardLayout :breadcrumbs="bread">

        <div class="mx-auto max-w-3xl lg:max-w-[1400px] mt-3 mb-6 px-3 md:px-0">
            <router-link :to="{ path: '/promoter/leads' }"
                class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200">
                Volver a la página anterior
            </router-link>
        </div>

        <BigFormContainer>
            <div>
                <div class="mt-4">
                    <InputLabel for="name" value="Nombre completo" />
                    <TextInput 
                        id="name" 
                        v-model="name" 
                        type="text" 
                        class="mt-1 block w-full"
                        placeholder="Ingrese el nombre completo" 
                        autocomplete="name" 
                        autofocus 
                    />        

                    <div v-if="isValidName == false" class="ml-2 mt-2">
                        <p class="text-sm text-red-600 dark:text-red-400">
                            ¡Ingresa un nombre, por favor!
                        </p>
                    </div>
                </div>

                <div class="mt-4">
                    <InputLabel for="genre" value="Sexo" />
                    <select
                        id="genre"
                        v-model="genre"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                    >
                        <option value="" disabled>Selecciona el sexo</option>
                        <option value="FEMENINO">FEMENINO</option>
                        <option value="MASCULINO">MASCULINO</option>
                    </select>
                </div>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="enrollmentStatus" value="Status" />
                        <select
                            id="enrollmentStatus"
                            v-model="enrollmentStatus"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un status</option>
                            <option value="INS">INS</option>
                            <option value="INSO">INSO</option>
                            <option value="REZA">REZA</option>
                        </select>

                        <div v-if="isValidStatus == false" class="ml-2 mt-2">
                            <p class="text-sm text-red-600 dark:text-red-400">
                                Selecciona un status, por favor.
                            </p>
                        </div>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="selectedFollowUp" value="Seguimiento" />
                        <select 
                            v-model="followId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un Seguimiento</option>
                            <option v-for="followUp in followUps" :value="followUp.id" :key="followUp.id">{{ followUp.name }}</option>
                        </select>

                        <div v-if="isValidFollowId == false" class="ml-2 mt-2">
                            <p class="text-sm text-red-600 dark:text-red-400">
                                Selecciona un seguimiento, por favor.
                            </p>
                        </div>
                    </div>
                </InputGroup>  

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="tel" value="Teléfono" />
                        <TextInput 
                            id="tel" 
                            v-model="tel" 
                            type="tel" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el número de teléfono" 
                            autocomplete="tel" 
                        />

                        <div v-if="isValidTel === false" class="ml-2 mt-2">
                            <p class="text-sm text-red-600 dark:text-red-400">
                                ¡Ingresa un teléfono válido de 10 dígitos, por favor!
                            </p>
                        </div>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="telOptional" value="Teléfono secundario (Opcional)" />
                        <TextInput 
                            id="telOptional" 
                            v-model="telOptional" 
                            type="tel" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el número de teléfono secundario" 
                            autocomplete="telOptional" 
                        />
                    </div>
                </InputGroup>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="email" value="Correo electrónico" />
                        <TextInput 
                            id="email" 
                            v-model="email" 
                            type="email" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el correo electrónico" 
                            autocomplete="email" 
                        />

                        <div v-if="isValidEmail == false" class="ml-2 mt-2">
                            <p class="text-sm text-red-600 dark:text-red-400">
                            ¡Ingresa un correo electrónico válido, por favor!
                            </p>
                        </div>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="emailOptional" value="Correo electrónico secundario (Opcional)" />
                        <TextInput 
                            id="emailOptional" 
                            v-model="emailOptional" 
                            type="email" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el correo electrónico secundario" 
                            autocomplete="email" 
                        />
                    </div>
                </InputGroup>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="career" value="Carrera de interés" />
                        <TextInput 
                            id="career" 
                            v-model="career" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese la carrera de interés" 
                            autocomplete="email" 
                        />
                    </div>
                    

                    <div class="w-full md:w-1/2">
                        <InputLabel for="selectedGrade" value="Grados escolares" />
                        <select 
                            v-model="gradeId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-in-out"
                        >
                            <option value="" disabled>Selecciona un grado escolar</option>
                            <option v-for="grade in grades" :value="grade.id" :key="grade.id">{{ grade.name }}</option>
                        </select>
                    </div>
                </InputGroup>

                <div class="mt-4">
                    <InputLabel for="scholarship" value="Beca ofrecida" />
                    <select
                        id="scholarship"
                        v-model="scholarship"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                    >
                        <option disabled value="">Selecciona una beca</option>
                        <option v-for="scholar_ship in scholarships" :key="scholar_ship" :value="scholar_ship">{{ scholar_ship }}</option>
                    </select>
                </div>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="formerSchool" value="Escuela de procedencia" />
                        <TextInput 
                            id="formerSchool" 
                            v-model="formerSchool" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese la escuela de procedencia" 
                        />
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="typeSchool" value="Tipo de escuela" />
                        <select
                            id="typeSchool"
                            v-model="typeSchool"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                            >
                            <option value="" disabled>Selecciona un tipo de escuela</option>
                            <option value="Pública">Pública</option>
                            <option value="Privada">Privada</option>
                        </select>
                    </div>
                </InputGroup>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="contactMediumId" value="Medio de contacto" />
                        <select 
                            v-model="contactMediumId"
                            @change="getAsetNames"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un medio de contacto</option>
                            <option v-for="contactMedium in contactMediums" :value="contactMedium.id" :key="contactMedium.id">{{ contactMedium.type }}</option>
                        </select>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="asetNameId" value="Aset Name" />
                        <select
                            v-model="asetNameId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un Aset Name</option>
                            <option v-for="asetName in asetNames" :value="asetName.id" :key="asetName.id">{{ asetName.name }}</option>
                        </select>
                    </div>
                </InputGroup>

                <div class="mt-4">
                    <InputLabel for="selectedCampaign" value="Campaña" />
                    <select 
                        v-model="campaignId"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                    >
                        <option value="" disabled>Selecciona una campaña</option>
                        <option v-for="campaign in campaigns" :value="campaign.id" :key="campaign.id">{{ campaign.name }}</option>
                    </select>

                    <div v-if="isValidCampaignId == false" class="ml-2 mt-2">
                        <p class="text-sm text-red-600 dark:text-red-400">
                            Selecciona una campaña, por favor.
                        </p>
                    </div>
                </div>

                <div class="mt-4">
                    <InputLabel for="country" value="País" />
                    <select 
                        id="country" 
                        v-model="country"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-out"
                    >
                        <option value="" disabled>Selecciona un país</option>
                        <option v-for="country in countries" :value="country.name" :key="country.id">{{ country.name }}</option>
                    </select>
                </div>

                <!-- Si es país seleccionado es méxico -->
                <template v-if="country === 'México'">
                    <InputGroup>
                        <div class="w-full md:w-1/2">
                            <InputLabel for="selectedState" value="Estado" />
                            <select 
                                id="selectedState" 
                                v-model="state"
                                @change="updateCities"
                                class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                            >
                                <option value="" disabled>Selecciona un estado</option>
                                <option v-for="state in states" :value="state.nombre" :key="state.nombre">{{ state.nombre }}</option>
                            </select>
                        </div>

                        <div class="w-full md:w-1/2">
                            <InputLabel for="selectedCity" value="Ciudad" />
                            <select 
                                id="selectedCity" 
                                v-model="city"
                                class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                            >
                                <option value="" disabled>Selecciona una ciudad</option>
                                <option v-for="city in selectedStateCities" :value="city" :key="city">{{ city }}</option>
                            </select>
                        </div>
                    </InputGroup>
                </template>

                <!-- Si es país seleccionado no es méxico -->
                <template v-else>
                    <InputGroup>
                        <div class="w-full md:w-1/2">
                            <InputLabel for="selectedState" value="Estado" />
                            <TextInput 
                                id="selectedState" 
                                v-model="state" 
                                type="text" 
                                class="mt-1 block w-full"
                                placeholder="Ingrese el estado del país" 
                            />
                        </div>

                        <div class="w-full md:w-1/2">
                            <InputLabel for="selectedCity" value="Ciudad" />
                            <TextInput 
                                id="selectedCity" 
                                v-model="city" 
                                type="text" 
                                class="mt-1 block w-full"
                                placeholder="Ingrese la ciudad del estado" 
                            />
                        </div>
                    </InputGroup>
                </template>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="schoolYearId" value="Ciclo escolar" />
                        <select
                            v-model="schoolYearId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un ciclo escolar</option>
                            <option v-for="schoolYear in schoolYears" :value="schoolYear.id" :key="schoolYear.id">{{ schoolYear.cicle }}</option>
                        </select>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="admissionSemester" value="Semestre de ingreso" />
                        <select
                            id="admissionSemester"
                            v-model="admissionSemester"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option v-for="semester in admissionSemesters" :value="semester.value" :key="semester.id">{{ semester.text }}</option>
                        </select>
                    </div>
                </InputGroup>

                <div class="mt-4">
                    <InputLabel for="referenceType" value="Tipo de referido" />
                    <select
                        id="referenceType"
                        v-model="referenceType"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                    >
                        <option value="" disabled>Selecciona un tipo de referido</option>
                        <option value="NINGUNO">NINGUNO</option>
                        <option value="PERSONAL UNINTER">PERSONAL UNINTER</option>
                        <option value="ALUMNO">ALUMNO</option>
                        <option value="FAMILIAR ALUMNO">FAMILIAR ALUMNO</option>
                    </select>
                </div>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="referenceName" value="Nombre de referido" />
                        <TextInput 
                            id="referenceName" 
                            v-model="referenceName" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el nombre de referido" 
                        />
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="dataSource" value="Donde obtuvo el dato" />
                        <TextInput 
                            id="dataSource" 
                            v-model="dataSource" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese donde obtuvo el dato" 
                        />
                    </div>
                </InputGroup>       

                <div class="flex justify-end mt-6 gap-3">
                    <button 
                        @click="register" 
                        class="inline-block py-2 px-4 text-white bg-green-500 hover:bg-green-600 rounded-md duration-150"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </BigFormContainer>

        
    </DashboardLayout>
</template>