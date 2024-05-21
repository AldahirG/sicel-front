<script>
import { defineAsyncComponent } from 'vue';
import axios from 'axios';

const DashboardLayout = defineAsyncComponent(() =>
    import('../../../layouts/DashboardLayout.vue')
)

const Table = defineAsyncComponent(() =>
    import('../../../components/Lead/Assignment/Table.vue')
)

const TableRow = defineAsyncComponent(() =>
    import('../../../components/Lead/Assignment/TableRow.vue')
)

const TableHeaderCell = defineAsyncComponent(() =>
    import('../../../components/Lead/Assignment/TableHeaderCell.vue')
)

const TableDataCell = defineAsyncComponent(() =>
    import('../../../components/Lead/Assignment/TableDataCell.vue')
)

const InputLabel = defineAsyncComponent(() =>
    import('../../../components/InputLabel.vue')
)

const Badge = defineAsyncComponent(() =>
    import('../../../components/Badge.vue')
)

const Indicator = defineAsyncComponent(() =>
    import('../../../components/Indicator.vue')
)

const Alert = defineAsyncComponent(() =>
    import('../../../components/Alert.vue')
)

// URL de API
const url = import.meta.env.VITE_API_URL;

export default {
    components: {
        Alert,
        Badge,
        DashboardLayout,
        Indicator,
        InputLabel,
        Table,
        TableDataCell,
        TableHeaderCell,
        TableRow,
    },
    data() {
        return {
            lead: [],
            assignments: [],
            currentPromoterId: null,
            promoters: [],
            userId: '',
            successMessage: '',
            errorMessage: '',

            // Paths for breadcrumbs
            bread: [
                { label: "Dashboard", name: 'admin' },
                { label: "Leads", name: 'admin/leads' },
                { label: "Asignación y reasignación", name: "assignmentLead" }
            ]
        };
    },
    methods: {
        getLead(id){
            axios.get(`${url}/lead/${id}`)
                .then(res => {
                    this.lead.name = res.data.name;
                    this.lead.dateFirstContact = res.data.dateFirstContact;
                    this.lead.followId = res.data.followId;
                    this.lead.userId = res.data.userId;
                })
                .catch(error => {
                    console.error('Error al obtener el lead:', error);
                });
        },
        historyAssignments() {
            const leadId = this.$route.params.id;
            axios.get(`${url}/lead/history/${leadId}`)
                .then(response => {
                    this.assignments = response.data;
                })
                .catch(error => {
                    console.error('Error al obtener las asignaciones del lead:', error);
                });
        },
        async getPromoters() {
            try {
                const response = await axios.get(`${url}/promoters`);
                this.promoters = response.data;
            } catch (error) {
                console.error('Error al obtener los promotores:', error);
            }
        },
        async assignment() {
            try {
                const leadId = parseInt(this.$route.params.id);
                const response = await axios.post(`${url}/lead/assign`, {
                    userId: this.userId,
                    leadId: leadId
                });

                this.$router.push('/admin/leads');
                
            } catch (error) {
                console.error('Error en el server:', error);
            }
        },
        async reassign() {
            try {
                const leadId = parseInt(this.$route.params.id);
                const response = await axios.put(`${url}/lead/reassign/${leadId}`, {
                    userId: this.lead.userId
                });

                await this.getLead(leadId);
                await this.historyAssignments();

                // Asignar mensaje de éxito si la reasignación fue exitosa
                this.successMessage = 'Promotor reasignado correctamente';
                console.clear();

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    this.errorMessage = 'No puedes reasignar al mismo promotor';
                } else {
                    console.error('Error en el server:', error);
                }
            }
        },
    },
    mounted() {
        const id = this.$route.params.id;
        this.getLead(id);
        this.historyAssignments();
        this.getPromoters();
    },
}

</script>

<template>
    <DashboardLayout :breadcrumbs="bread">
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">

            <!-- Mensajes de alerta -->
            <Alert
                v-if="successMessage"
            >
                {{ successMessage }}
            </Alert>

            <Alert 
                v-if="errorMessage"
                bgColor="bg-red-50 dark:bg-gray-800"
                textColor="text-red-800 dark:text-red-400"
            >
                {{ errorMessage }}
            </Alert>
            <!-- Mensajes de alerta -->

            <section class="flex flex-col items-center justify-center text-center text-black dark:text-gray-300">

                <div class="my-4">
                    <h3 class="text-sm md:text-xl tracking-tighter">Nombre de lead</h3>
                    <h4 class="text-lg md:text-3xl font-bold tracking-wider line-clamp-2">{{ lead.name }}</h4>
                </div>

                <!-- Si no tiene promotor se puede asignar un promotor -->
                <template v-if="lead.userId == null">
                    <div>
                        <Indicator 
                            margin="mb-8"
                            validation="Se puede asignar un promotor" 
                        />

                        <InputLabel value="Promotor" />

                        <select 
                            id="promoters" 
                            v-model="userId"
                            class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option v-for="promoter in promoters" :key="promoter.id" :value="promoter.id">
                                {{ promoter.name }}
                            </option>
                        </select>

                        <div class="flex justify-center lg:justify-end mt-4">
                            <button 
                                @click="assignment" 
                                class="py-2 px-4 text-white bg-green-600 hover:bg-green-700 rounded-md duration-150"
                            >
                                Asignar
                            </button>
                        </div>
                    </div>
                </template>

                <!-- Si tiene un promotor asignado -->
                <template v-else>
                    <!-- Si no tiene una fecha de primer contacto o un Pseguimiento se puede reasignar-->
                    <template v-if="lead.dateFirstContact === null || lead.followId === null">
                        <form @submit.prevent="reassign">
                            <Indicator
                                margin="mb-8"
                                bgColor="bg-indigo-600"
                                textColor="text-indigo-800 dark:text-indigo-300"
                                validation="Puede ser reasignado" 
                            />

                            <InputLabel value="Promotor" />

                            <select 
                                id="promoters" 
                                v-model="lead.userId"
                                class="cursor-pointer px-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option v-for="promoter in promoters" :key="promoter.id" :value="promoter.id">
                                    {{ promoter.name }}
                                </option>
                            </select>

                            <div class="flex justify-center lg:justify-end mt-4">
                                <button 
                                    type="submit"
                                    class="py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md duration-150"
                                >
                                    Reasignar
                                </button>
                            </div>
                        </form>
                    </template>

                    <!-- Si tiene fecha de primer contacto y Pseguimiento no se puede reasignar -->
                    <template v-else>
                        <Indicator
                            bgColor="bg-red-600"
                            textColor="text-red-600 dark:text-red-300"
                            validation="No se puede reasignar" 
                        />

                        <div class="text-left text-black dark:text-gray-300">
                            <p class="mt-6 mb-2 text-sm md:text-lg font-semibold text-gray-900 dark:text-white">Debido a las siguientes razones:</p>

                            <ul class="text-xs md:text-base list-disc list-inside">
                                <li>Fecha de primer contacto asignada</li>
                                <li>PSeguimiento asignado</li>
                            </ul>
                        </div>
                    </template>
                </template>
            </section>

            <section class="flex items-start lg:items-center justify-center mt-6">
                <Table>
                    <template #header>
                        <TableRow>
                            <TableHeaderCell>Promotores Asignados</TableHeaderCell>
                            <TableHeaderCell>Estado</TableHeaderCell>
                        </TableRow>
                    </template>
                    <template #content>
                        <TableRow v-for="(assignment, index) in assignments" :key="index">
                            <TableDataCell>{{ assignment.name }}</TableDataCell>
                            <TableDataCell v-if="index === assignments.length - 1">
                                <Badge 
                                    bgColor="bg-blue-300 dark:bg-blue-900"
                                    textColor="text-blue-800 dark:text-blue-300"
                                    status="Promotor Original" 
                                />
                            </TableDataCell>
                            <template v-else>
                                <TableDataCell v-if="index === 0">
                                    <Badge 
                                        status="Promotor Actual" 
                                    />
                                </TableDataCell>
                            </template>
                        </TableRow>
                    </template>
                </Table>
            </section>
        </div>
    </DashboardLayout>
</template>