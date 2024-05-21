<script>
import { defineAsyncComponent } from 'vue';
import axios from 'axios';

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

const DateInput = defineAsyncComponent(() =>
  import('../../../components/DateInput.vue')
)

const ToggleStatus = defineAsyncComponent(() =>
  import ('../../../components/ToggleStatus.vue')
)

// URL de API
const url = import.meta.env.VITE_API_URL;

export default {
    components: {
        BigFormContainer,
        DashboardLayout,
        DateInput,
        InputGroup,
        InputLabel,
        TextInput,
        ToggleStatus,
    },
    data() {
        return {
            lead: {
                name: '',
                genre: '',
                enrollmentStatus: '',
                followId: '',
                tel: '',
                telOptional: '',
                email: '',
                emailOptional: '',
                career: '',
                gradeId: '',
                scholarship: '',
                formerSchool: '',
                typeSchool: '',
                contactMediumId: '',
                asetNameId: null,
                campaignId: '',
                country: '',
                state: '',
                city: '',
                referenceType: '',
                referenceName: '',
                dataSource: '',
                schoolYearId: '',
                admissionSemester: '',
                status: false,
            },
            countries: [],
            states: [],
            selectedStateCities: [],
            campaigns: [],
            followUps: [],
            grades: [],
            contactMediums: [],
            asetNames: [],
            schoolYears: [],

            admissionSemesters: [
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
            ],

            scholarships: [
                '0', '10', '15', '20', '25', '30', '35', 
                '40', '45', '50', '55', '60', '70','80', 
                '90', '100', 'APOYO TRABAJADOR', 'ORFANDAD'
            ],

            // Paths for breadcrumbs
            bread: [
                { label: "Dashboard", name: 'admin' },
                { label: "Leads", name: 'admin/leads' },
                { label: "Editar", name: "editLead" }
            ]
        };
    },
    methods: {
        async getLead(id) {
            try {
                const res = await axios.get(`${url}/lead/${id}`);
                this.lead.name = res.data.name;
                this.lead.genre = res.data.genre;
                this.lead.enrollmentStatus = res.data.enrollmentStatus;
                this.lead.followId = res.data.followId;
                this.lead.tel = res.data.tel;
                this.lead.telOptional = res.data.telOptional;
                this.lead.email = res.data.email;
                this.lead.emailOptional = res.data.emailOptional;
                this.lead.career = res.data.career;
                this.lead.gradeId = res.data.gradeId;
                this.lead.formerSchool = res.data.formerSchool;
                this.lead.typeSchool = res.data.typeSchool;
                this.lead.contactMediumId = res.data.contactMediumId;
                await this.getAsetNames();
                this.lead.asetNameId = res.data.asetNameId;
                this.lead.campaignId = res.data.campaignId;
                this.lead.scholarship = res.data.scholarship;
                this.lead.country = res.data.country;
                this.lead.state = res.data.state;
                const stateSelected = this.states.find(s => s.nombre === this.lead.state);
                this.selectedStateCities = stateSelected ? stateSelected.ciudades : [];
                this.lead.city = res.data.city;
                this.lead.schoolYearId = res.data.schoolYearId;
                this.lead.referenceType = res.data.referenceType;
                this.lead.referenceName = res.data.referenceName;
                this.lead.dataSource = res.data.dataSource;
                this.lead.admissionSemester = res.data.admissionSemester;
                this.lead.status = res.data.status;
            } catch (error) {
                console.error('Error al obtener el lead:', error);
            }
        },
        async update() {
            const id = this.$route.params.id;

            try {
                await axios.put(`${url}/lead/${id}`, {
                    name: this.lead.name,
                    genre: this.lead.genre,
                    enrollmentStatus: this.lead.enrollmentStatus,
                    followId: this.lead.followId,
                    tel: this.lead.tel,
                    telOptional: this.lead.telOptional,
                    email: this.lead.email,
                    emailOptional: this.lead.emailOptional,
                    career: this.lead.career,
                    gradeId: this.lead.gradeId,
                    scholarship: this.lead.scholarship,
                    formerSchool: this.lead.formerSchool,
                    typeSchool: this.lead.typeSchool,
                    contactMediumId: this.lead.contactMediumId,
                    asetNameId: this.lead.asetNameId,
                    campaignId: this.lead.campaignId,
                    country: this.lead.country,
                    state: this.lead.state,
                    city: this.lead.city,
                    referenceType: this.lead.referenceType,
                    referenceName: this.lead.referenceName,
                    dataSource: this.lead.dataSource,
                    schoolYearId: this.lead.schoolYearId,
                    admissionSemester: this.lead.admissionSemester,
                    status: this.lead.status,
                });
                this.$router.push("/admin/leads");
            } catch (error) {
                console.error('Error al actualizar el lead:', error.data);
            }
        },
        async getCountries() {
            try {
                const response = await axios.get('/json/countries.json');
                this.countries = response.data;
            } catch (error) {
                console.error('Error al obtener los países:', error);
            }
        },
        async getStates() {
            try {
                const response = await axios.get('/json/states-mexico.json');
                this.states = response.data;
            } catch (error) {
                console.error('Error al obtener los estados del país:', error);
            }
        },
        updateCities() {
            const stateSelected = this.states.find(s => s.nombre === this.lead.state);
            this.selectedStateCities = stateSelected ? stateSelected.ciudades : [];
        },
        async getCampaigns() {
            try {
                const response = await axios.get(`${url}/campaigns/list`);
                this.campaigns = response.data;
            } catch (error) {
                console.error('Error al obtener las campañas:', error);
            }
        },
        async getFollowUps() {
            try {
                const response = await axios.get(`${url}/follow-ups/list`);
                this.followUps = response.data;
            } catch (error) {
                console.error('Error al obtener los seguimientos:', error);
            }
        },
        async getGrades() {
            try {
                const response = await axios.get(`${url}/grades/list`);
                this.grades = response.data;
            } catch (error) {
                console.error('Error al obtener los grados escolares:', error);
            }
        },
        async getContactMediums() {
            try {
                const response = await axios.get(`${url}/contact-mediums/list`);
                this.contactMediums = response.data;
            } catch (error) {
                console.error('Error al obtener los medios de contacto:', error);
            }
        },
        async getAsetNames() {
            try {
                if (this.lead.contactMediumId) {
                    const response = await axios.get(`${url}/contact-mediums/${this.lead.contactMediumId}/aset-names`);
                    this.asetNames = response.data;

                    // Verificar si el asetNameId actual es válido
                    const selectedAsetName = this.asetNames.find(asetName => asetName.id === this.lead.asetNameId);
                    if (!selectedAsetName) {
                        // Si el asetNameId actual no es válido, establecer asetNameId como nulo
                        this.lead.asetNameId = null;
                    }
                } else {
                    this.asetNames = []; // Si no hay contactMediumId, limpiar la lista de asetNames
                }
            } catch (error) {
                console.error('Error al obtener los aset names:', error);
            }
        },
        async getSchoolYears() {
            try {
                const response = await axios.get(`${url}/school-years/list`);
                this.schoolYears = response.data;
            } catch (error) {
                console.error('Error al obtener los ciclos escolares:', error);
            }
        },
    },
    mounted() {
        const id = this.$route.params.id;
        this.getLead(id);
        this.getCountries();
        this.getStates();
        this.getCampaigns();
        this.getFollowUps();
        this.getGrades();
        this.getContactMediums();
        this.getAsetNames();
        this.getSchoolYears();
    },
};
</script>

<template>
    <DashboardLayout :breadcrumbs="bread">

        <div class="mx-auto max-w-3xl lg:max-w-[1400px] mt-3 mb-6 px-3 md:px-0">
            <router-link :to="{ path: '/admin/leads' }"
                class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200">
                Volver a la página anterior
            </router-link>
        </div>

        <BigFormContainer>
            <form @submit.prevent="update">
                <div class="mt-4 mb-4">
                    <InputLabel for="name" value="Nombre completo" />
                    <TextInput 
                        id="name" 
                        v-model="lead.name" 
                        type="text" 
                        class="mt-1 block w-full"
                        placeholder="Ingrese el nombre completo" 
                        autocomplete="name" 
                        autofocus 
                    />
                </div>

                <div class="mt-4">
                    <InputLabel for="genre" value="Sexo" />
                    <select
                        id="genre"
                        v-model="lead.genre"
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
                            v-model="lead.enrollmentStatus"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un tipo de escuela</option>
                            <option value="INS">INS</option>
                            <option value="INSO">INSO</option>
                            <option value="REZA">REZA</option>
                        </select>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="followUp" value="Seguimiento" />
                        <select 
                            id="followUp" 
                            v-model="lead.followId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-in-out"
                        >
                            <option v-for="followUp in followUps" :key="followUp.id" :value="followUp.id">
                                {{ followUp.name }}
                            </option>
                        </select>
                    </div>
                </InputGroup>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="tel" value="Teléfono" />
                        <TextInput 
                            id="tel" 
                            v-model="lead.tel" 
                            type="tel" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese un número de teléfono"
                            autocomplete="tel"
                        />
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="telOptional" value="Teléfono (Opcional)" />
                        <TextInput 
                            id="tel" 
                            v-model="lead.telOptional" 
                            type="tel" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese un número de teléfono" 
                        />
                    </div>
                </InputGroup>

                <InputGroup>
                    <div class="w-full md:w-1/2">
                        <InputLabel for="email" value="Correo electrónico" />
                        <TextInput 
                            id="email" 
                            v-model="lead.email" 
                            type="email" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese un correo electrónico" 
                            autocomplete="email" 
                        />
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="emailOptional" value="Correo electrónico (Opcional)" />
                        <TextInput 
                            id="emailOptional" 
                            v-model="lead.emailOptional" 
                            type="email" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese un correo electrónico" 
                            autocomplete="email" 
                        />
                    </div>
                </InputGroup>

                <InputGroup>
                    <!-- Select carrera -->
                    <div class="w-full md:w-1/2">
                        <InputLabel for="career" value="Carrera de interés" />
                        <TextInput 
                            id="career" 
                            v-model="lead.career" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese la carrera de interés" 
                            autocomplete="email" 
                        />
                    </div>

                    <!-- Select grado escolar -->
                    <div class="w-full md:w-1/2">
                        <InputLabel for="grade" value="Grado escolar" />
                        <select 
                            id="grade" 
                            v-model="lead.gradeId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-in-out"
                        >
                            <option v-for="grade in grades" :key="grade.id" :value="grade.id">
                                {{ grade.name }}
                            </option>
                        </select>
                    </div>                   
                </InputGroup>

                <div class="mt-4">
                    <InputLabel for="scholarship" value="Beca ofrecida" />
                    <select
                        id="scholarship"
                        v-model="lead.scholarship"
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
                            v-model="lead.formerSchool" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese la escuela de procedencia" 
                        />
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="typeSchool" value="Tipo de escuela" />
                        <select
                            id="typeSchool"
                            v-model="lead.typeSchool"
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
                            v-model="lead.contactMediumId"
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
                            v-model="lead.asetNameId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-out"
                        >
                            <option value="" disabled>Selecciona un Aset Name</option>
                            <option v-for="asetName in asetNames" :value="asetName.id" :key="asetName.id">{{ asetName.name }}</option>
                        </select>
                    </div>
                </InputGroup>

                <div class="mt-4">
                    <InputLabel for="campaign" value="Campaña" />
                    <select id="campaign" v-model="lead.campaignId"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-in-out">
                        <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                            {{ campaign.name }}
                        </option>
                    </select>
                </div>

                <div class="mt-4">
                    <InputLabel for="country" value="País" />
                    <select 
                        id="country" 
                        v-model="lead.country"
                        class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 ease-out"
                    >
                        <option value="" disabled>Selecciona un país</option>
                        <option v-for="country in countries" :value="country.name" :key="country.id">{{ country.name }}</option>
                    </select>
                </div>

                <!-- Si es país seleccionado es méxico -->
                <template v-if="lead.country === 'México'">
                    <InputGroup>
                        <div class="w-full md:w-1/2">
                            <InputLabel for="selectedState" value="Estado" />
                            <select 
                                id="selectedState" 
                                v-model="lead.state"
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
                                v-model="lead.city"
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
                                v-model="lead.state" 
                                type="text" 
                                class="mt-1 block w-full"
                                placeholder="Ingrese el estado del país" 
                            />
                        </div>

                        <div class="w-full md:w-1/2">
                            <InputLabel for="selectedCity" value="Ciudad" />
                            <TextInput 
                                id="selectedCity" 
                                v-model="lead.city" 
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
                            id="schoolYearId" 
                            v-model="lead.schoolYearId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300 ease-in-out">
                            <option v-for="schoolYear in schoolYears" :key="schoolYear.id" :value="schoolYear.id">
                                {{ schoolYear.cicle }}
                            </option>
                        </select>
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="admissionSemester" value="Semestre de ingreso" />
                        <select
                            id="admissionSemester"
                            v-model="lead.admissionSemester"
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
                        v-model="lead.referenceType"
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
                            v-model="lead.referenceName" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el nombre de referido" 
                        />
                    </div>

                    <div class="w-full md:w-1/2">
                        <InputLabel for="dataSource" value="Tipo de referido" />
                        <TextInput 
                            id="dataSource" 
                            v-model="lead.dataSource" 
                            type="text" 
                            class="mt-1 block w-full"
                            placeholder="Ingrese el tipo de referido" 
                        />
                    </div>
                </InputGroup>   

                <div class="mt-4 mb-4">
                    <InputLabel for="status" value="Estatus del usuario" />
                    <ToggleStatus 
                        id="status" 
                        v-model:checked="lead.status" 
                        name="status" 
                        class="mt-2 block w-full"
                    />
                </div>

                <div class="flex justify-end">
                    <button type="submit"
                        class="py-2 px-4 text-white dark:text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                        Editar
                    </button>
                </div>
            </form>
        </BigFormContainer>
    </DashboardLayout>
</template>