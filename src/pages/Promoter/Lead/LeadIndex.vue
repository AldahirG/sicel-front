<script setup>
import axios from 'axios';
import { getId } from '../../../routes/auth';
import { computed, defineAsyncComponent, reactive, ref, onMounted, watch } from 'vue';

// Componentes
const DashboardLayout = defineAsyncComponent(() =>
  import('../../../layouts/DashboardLayout.vue')
);

const TableSkeleton = defineAsyncComponent(() =>
  import('../../../components/TableSkeleton.vue')
)

const Table = defineAsyncComponent({
  loader: () => import('../../../components/Table.vue'),
  delay: 2000,
  timeout: 3000,
  suspensible: true,
});

const TableDataCell = defineAsyncComponent(() =>
  import('../../../components/TableDataCell.vue')
);

const TableHeaderCell = defineAsyncComponent(() =>
  import('../../../components/TableHeaderCell.vue')
);

const TableRow = defineAsyncComponent(() =>
  import('../../../components/TableRow.vue')
);

const InputLabel = defineAsyncComponent(() =>
  import('../../../components/InputLabel.vue')
)

// URL de API
const url = import.meta.env.VITE_API_URL;

// Variables reactivas
const bread = [
    { label: "Dashboard", name: 'promoter' },
    { label: "Leads", name: 'promoter/leads' },
]

const leads = ref([]);

const selectedLeadIds = ref([]);

const followUps = ref([]);
const contactMediums = ref([]);
const asetNames = ref([]);
const schoolYears = ref([]);
const campaigns = ref([]);
const promoters = ref([]);

const selectAllChecked = ref(false);

const selectedPromoterId = ref('');

const selectedFilter = ref('');

const filters = reactive({
    search: '',
    filterBy: '',
    enrollmentStatus: '',
    followId: '',
    contactMediumId: '',
    asetNameId: '',
    schoolYearId: '',
    campaignId: '',
    referenceType: '',
});

const currentPage = ref(1);
const pageSize = 10;
const totalItems = ref(0);

// Métodos
const fetchLeads = async () => {
    try {
        let params = {
            skip: (currentPage.value - 1) * pageSize,
            take: pageSize,
        };

        switch (selectedFilter.value) {
            case 'enrollmentStatus':
                params = {
                    ...params,
                    enrollmentStatus: filters.enrollmentStatus,
                };
                break;
            case 'followId':
                params = {
                    ...params,
                    followId: filters.followId,
                };
                break;
            case 'contactMediumId':
                params = {
                    ...params,
                    contactMediumId: filters.contactMediumId,
                }
                break;
            case 'asetNameId':
                params = {
                    ...params,
                    asetNameId: filters.asetNameId,
                }
                break;
            case 'schoolYearId':
                params = {
                    ...params,
                    schoolYearId: filters.schoolYearId,
                }
                break;
            case 'campaignId':
                params = {
                    ...params,
                    campaignId: filters.campaignId,
                }
                break;
            case 'referenceType':
                params = {
                    ...params,
                    referenceType: filters.referenceType,
                }
                break;
            case 'typeSchool':
                params = {
                    ...params,
                    typeSchool: filters.typeSchool,
                }
                break;
            default:
                params = {
                    ...params,
                    [selectedFilter.value]: filters.search,
                };
                break;
        }

        const userId = await getId();
        const response = await axios.get(`${url}/promoter/${userId}/leads`, {
            params,
        });
        leads.value = response.data;
    } catch (error) {
        console.error('Error al obtener los leads:', error);
    }
};

const fetchTotalLeads = async () => {
  try {
    const userId = await getId();
    const response = await axios.get(`${url}/promoter/${userId}/leads/count`);
    totalItems.value = response.data;
  } catch (error) {
    console.error('Error al obtener el total de leads:', error);
  }
}

// Listado de Seguimientos
const fetchFollowUps = async () => {
    try {
        const response = await axios.get(`${url}/follow-ups/list`);
        followUps.value = response.data;
    } catch (error) {
        console.error('Error al obtener los seguimientos:', error);
    }
};

// Listado de Medios de contacto
const fetchContactMediums = async () => {
    try {
        const response = await axios.get(`${url}/contact-mediums/list`);
        contactMediums.value = response.data;
    } catch (error) {
        console.error('Error al obtener los medios de contacto:', error);
    }
};

// Listado de Seguimientos
const fetchAsetNames = async () => {
    try {
        const response = await axios.get(`${url}/aset-names/list`);
        asetNames.value = response.data;
    } catch (error) {
        console.error('Error al obtener los aset names:', error);
    }
};

// Listado de Ciclos escolares
const fetchSchoolYears = async () => {
    try {
        const response = await axios.get(`${url}/school-years/list`);
        schoolYears.value = response.data;
    } catch (error) {
        console.error('Error al obtener los ciclos escolares:', error);
    }
};

// Listado de Campañas
const fetchCampaigns = async () => {
    try {
        const response = await axios.get(`${url}/campaigns/list`);
        campaigns.value = response.data;
    } catch (error) {
        console.error('Error al obtener las campañas:', error);
    }
};

// Listado de promotores
const fetchPromoters = async () => {
    try {
        const response = await axios.get(`${url}/promoters`);
        promoters.value = response.data;
    } catch (error) {
        console.error('Error al obtener los promotores:', error);
    }
};

const searchLeads = () => {
    fetchLeads();
};

const onClickHandler = (page) => {
  currentPage.value = page;
  fetchLeads();
};

// Montaje inicial
onMounted(() => {
    fetchLeads();
    fetchTotalLeads();
    fetchFollowUps();
    fetchAsetNames();
    fetchSchoolYears();
    fetchCampaigns();
    fetchContactMediums();
    fetchPromoters();
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

</script>

<template>
    <DashboardLayout :breadcrumbs="bread">
        <section class="flex flex-col lg:flex-row items-center lg:items-end lg:justify-between p-5">    

            <!-- Filtros -->
            <div class="flex flex-col lg:flex-row w-full lg:w-5/6">
                <!-- Filtros input -->
                <div class="w-full lg:w-1/2">
                    <h4 class="text-base text-gray-600 dark:text-gray-300 font-medium ml-2 mb-1">Filtros</h4>

                    <div class="sm:join-vertical md:join">
                        <select v-model="selectedFilter" class="select select-bordered join-item">
                            <option disabled selected class="dark:text-gray-500">Selecciona un filtro</option>
                            <option value="name">Nombre</option>
                            <option value="tel">Teléfono</option>
                            <option value="email">Correo electrónico</option>
                            <option value="career">Carrera de interés</option>
                            <option value="country">País</option>
                            <option value="state">Estado</option>
                            <option value="city">Ciudad</option>
                            <option value="formerSchool">Escuela de procedencia</option>
                        </select>
                        <div>
                            <div>
                                <input
                                    type="search"
                                    v-model="filters.search" 
                                    class="input input-bordered join-item" 
                                    placeholder="Escribe aquí"
                                />
                            </div>
                        </div>
                        <div class="indicator">
                            <button 
                                @click="searchLeads" 
                                class="btn join-item"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filtros de select -->
                <div class="w-full lg:w-1/2">
                    <h4 class="text-base text-gray-600 dark:text-gray-300 font-medium ml-2 mb-1">Selecciona el filtro</h4>

                    <div class="sm:join-vertical md:join">
                        <select v-model="selectedFilter" class="select select-bordered join-item">
                            <option disabled selected class="dark:text-gray-500">Selecciona un filtro</option>
                            <option value="enrollmentStatus">Status</option>
                            <option value="followId">Seguimiento</option>
                            <option value="contactMediumId">Medio de contacto</option>
                            <option value="asetNameId">Aset Name</option>
                            <option value="schoolYearId">Ciclo escolar</option>
                            <option value="campaignId">Campaña</option>
                            <option value="referenceType">Tipo de referido</option>
                            <option value="typeSchool">Tipo de escuela</option>
                        </select>
                        <div>
                            <div v-if="selectedFilter === 'enrollmentStatus'">
                                <select v-model="filters.enrollmentStatus" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona un género</option>
                                    <option value="INS">INS</option>
                                    <option value="INSO">INSO</option>
                                    <option value="REZA">REZA</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'followId'">
                                <select v-model="filters.followId" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona un seguimiento</option>
                                    <option v-for="followUp in followUps" :key="followUp.id" :value="followUp.id">{{ followUp.name }}</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'contactMediumId'">
                                <select v-model="filters.contactMediumId" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona un medio de contacto</option>
                                    <option v-for="contactMedium in contactMediums" :key="contactMedium.id" :value="contactMedium.id">{{ contactMedium.type }}</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'asetNameId'">
                                <select v-model="filters.asetNameId" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona un aset name</option>
                                    <option v-for="asetName in asetNames" :key="asetName.id" :value="asetName.id">{{ asetName.name }}</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'schoolYearId'">
                                <select v-model="filters.schoolYearId" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona una campaña</option>
                                    <option v-for="schoolYear in schoolYears" :key="schoolYear.id" :value="schoolYear.id">{{ schoolYear.cicle }}</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'campaignId'">
                                <select v-model="filters.campaignId" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona una campaña</option>
                                    <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">{{ campaign.name }}</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'referenceType'">
                                <select v-model="filters.referenceType" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona un tipo de referido</option>
                                    <option value="NINGUNO">NINGUNO</option>
                                    <option value="PERSONAL UNINTER">PERSONAL UNINTER</option>
                                    <option value="ALUMNO">ALUMNO</option>
                                    <option value="FAMILIAR ALUMNO">FAMILIAR ALUMNO</option>
                                </select>
                            </div>

                            <div v-else-if="selectedFilter === 'typeSchool'">
                                <select v-model="filters.typeSchool" class="select select-bordered w-full max-w-xs join-item">
                                    <option disabled selected>Selecciona un tipo de escuela</option>
                                    <option value="PUBLICA">PUBLICA</option>
                                    <option value="PRIVADA">PRIVADA</option>
                                </select>
                            </div>
                        </div>
                        <div class="indicator">
                            <button 
                                @click="searchLeads" 
                                class="btn join-item"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-row lg:flex-col items-end mt-6 lg:mt-0 gap-2 w-full md:w-1/6">

                <router-link to="/promoter/lead/create"
                    class="inline-block w-fit py-2 px-4 text-left text-white bg-sky-800 hover:bg-sky-900 duration-200 rounded-md">
                    Crear un lead <i class="ml-1 bi bi-plus-circle-fill"></i>
                </router-link>
                
            </div>
        </section>

        <section 
            v-if="selectedLeadIds.length > 0"
            class="flex flex-col py-2 px-5"
        >
            <InputLabel value="Promotor para asignar o reasignar" />

            <select 
                v-model="selectedPromoterId"
                class="select select-bordered w-full max-w-xs"
            >
                <option disabled selected>Selecciona un promotor</option>
                <option v-for="promoter in promoters" :key="promoter.id" :value="promoter.id">{{ promoter.name }}</option>
            </select>
        </section>

        <Suspense>
            <template #default>
                <section class="mt-4">
                    <Table>
                        <template #header>
                            
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Nombre Completo</TableHeaderCell>
                                <TableHeaderCell>Seguimiento</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Teléfono</TableHeaderCell>
                                <TableHeaderCell>Teléfono Secundario</TableHeaderCell>
                                <TableHeaderCell>Correo Electrónico</TableHeaderCell>
                                <TableHeaderCell>Correo Electrónico Secundario</TableHeaderCell>
                                <TableHeaderCell>Carrera de interés</TableHeaderCell>
                                <TableHeaderCell>Grado escolar</TableHeaderCell>
                                <TableHeaderCell>Escuela de procedencia</TableHeaderCell>
                                <TableHeaderCell>Tipo de escuela</TableHeaderCell>
                                <TableHeaderCell>Medio de contacto</TableHeaderCell>
                                <TableHeaderCell>Aset Name</TableHeaderCell>
                                <TableHeaderCell>Campaña</TableHeaderCell>
                                <TableHeaderCell>País</TableHeaderCell>
                                <TableHeaderCell>Estado</TableHeaderCell>
                                <TableHeaderCell>Ciudad</TableHeaderCell>
                                <TableHeaderCell>Ciclo</TableHeaderCell>
                                <TableHeaderCell>Tipo de referido</TableHeaderCell>
                                <TableHeaderCell>Acciones</TableHeaderCell>
                            </TableRow>
                        </template>
                        <template #content>
                            <TableRow v-for="lead in leads" :key="lead.id">
                                <TableDataCell>{{ lead.id }}</TableDataCell>
                                <TableDataCell>{{ lead.name }}</TableDataCell>
                                <TableDataCell>{{ lead.followUp?.name }}</TableDataCell>
                                <TableDataCell>{{ lead.enrollmentStatus }}</TableDataCell>
                                <TableDataCell>{{ lead.tel }}</TableDataCell>
                                <TableDataCell>{{ lead.telOptional }}</TableDataCell>
                                <TableDataCell>{{ lead.email }}</TableDataCell>
                                <TableDataCell>{{ lead.emailOptional }}</TableDataCell>
                                <TableDataCell>{{ lead.career }}</TableDataCell>
                                <TableDataCell>{{ lead.grade?.name }}</TableDataCell>
                                <TableDataCell>{{ lead.formerSchool }}</TableDataCell>
                                <TableDataCell>{{ lead.typeSchool }}</TableDataCell>
                                <TableDataCell>{{ lead.contactMedium?.type }}</TableDataCell>
                                <TableDataCell>{{ lead.asetName?.name }}</TableDataCell>
                                <TableDataCell>{{ lead.campaign?.name }}</TableDataCell>
                                <TableDataCell>{{ lead.country }}</TableDataCell>
                                <TableDataCell>{{ lead.state }}</TableDataCell>
                                <TableDataCell>{{ lead.city }}</TableDataCell>
                                <TableDataCell>{{ lead.schoolYear?.cicle }}</TableDataCell>
                                <TableDataCell>{{ lead.referenceType }}</TableDataCell>

                                <!-- Acciones -->
                                <TableDataCell class="flex flex-col gap-2 text-center">

                                    <router-link 
                                        title="Mostrar datos"
                                        :to="{ path: '/promoter/lead/show/' + lead.id }"
                                        class="py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-md duration-200"
                                    >
                                        <i class="bi bi-eye-fill"></i>
                                    </router-link>

                                    <router-link 
                                        title="Editar"
                                        :to="{ path: '/promoter/lead/edit/' + lead.id }"
                                        class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200"
                                    >
                                        <i class="bi bi-pencil-square"></i>
                                    </router-link>


                                    <router-link
                                        title="Comentarios"
                                        :to="{ path: '/promoter/comments/lead/' + lead.id }"
                                        class="py-2 px-4 text-white bg-green-500 hover:bg-green-600 rounded-md duration-200"
                                    >
                                        <i class="bi bi-chat-right-dots-fill"></i>                               
                                    </router-link>


                                </TableDataCell>
                            </TableRow>
                        </template>
                    </Table>

                    <div class="flex justify-center mx-auto max-w-xl">
                        <template v-if="totalItems > 0">
                            <vue-awesome-paginate
                            :total-items="totalItems"
                            :items-per-page="pageSize"
                            :max-pages-shown="totalPages"
                            v-model="currentPage"
                            :on-click="onClickHandler"
                            />
                        </template>
                    </div>

                </section>
            </template>

            <template #fallback>
                <TableSkeleton />
            </template>
        </Suspense>
    </DashboardLayout>
</template>

<style>
  .pagination-container {
    display: flex;
    column-gap: 10px;
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
</style>