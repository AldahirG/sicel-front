<script>
import { defineAsyncComponent } from 'vue';
import axios from 'axios';

const DashboardLayout = defineAsyncComponent(() =>
  import('../../../layouts/DashboardLayout.vue')
);

const BentoItem = defineAsyncComponent({
  loader: () => import('../../../components/BentoItem.vue'),
  delay: 2000,
  timeout: 3000,
  suspensible: true,
});

const BentoItemTitle = defineAsyncComponent(() =>
  import('../../../components/BentoItemTitle.vue')
);

// URL de API
const url = import.meta.env.VITE_API_URL;

export default {
    components: {
        BentoItem,
        BentoItemTitle,
        DashboardLayout,
    },
    data() {
        return {
            lead: {
                dateFirstContact: '',
                name: '',
                genre: '',
                enrollmentStatus: '',
                tel: '',
                telOptional: '',
                email: '',
                emailOptional: '',
                career: '',
                formerSchool: '',
                typeSchool: '',
                scholarship: '',
                country: '',
                state: '',
                city: '',
                referenceType: '',
                referenceName: '',
                dataSource: '',
                admissionSemester: '',
                created_at: '',

                campaign: {},
                followUp: {},
                grade: {},
                user: {},
                contactMedium: {},
                asetName: {},
                schoolYear: {},
            },
            comments: [],
            leadId: null, 


            // Paths for breadcrumbs
            bread: [
                { label: "Dashboard", name: 'admin' },
                { label: "Leads", name: 'admin/leads' },
                { label: "Mostrar datos", name: "showLead" }
            ]
        };
    },
    methods: {
        async getLead(id) {
            try {
                const res = await axios.get(`${url}/lead/${id}`);
                this.lead.dateFirstContact = res.data.dateFirstContact; // Fecha de primer contacto
                this.lead.name = res.data.name;
                this.lead.genre = res.data.genre; //Sexo
                this.lead.enrollmentStatus = res.data.enrollmentStatus; // Status
                this.lead.followUp.name = res.data.followUp?.name; // Seguimiento
                this.lead.tel = res.data.tel;
                this.lead.telOptional = res.data.telOptional;
                this.lead.email = res.data.email;
                this.lead.emailOptional = res.data.emailOptional;
                this.lead.career = res.data.career; // Carrera
                // this.lead.carreer.slug = res.data.carreer?.slug; // Programa
                this.lead.grade.name = res.data.grade?.name; // Grado escolar
                this.lead.scholarship = res.data.scholarship; // Beca ofrecida
                this.lead.formerSchool = res.data.formerSchool; // Escuela de procedencia
                this.lead.typeSchool = res.data.typeSchool; // Tipo de escuela
                this.lead.contactMedium.type = res.data.contactMedium?.type; // Medio de contacto
                this.lead.asetName.name = res.data.asetName?.name; // Aset Name
                this.lead.campaign.name = res.data.campaign?.name; // Campaña
                this.lead.country = res.data.country; // País
                this.lead.state = res.data.state; // Estado
                this.lead.city = res.data.city; // Ciudad
                this.lead.schoolYear.cicle = res.data.schoolYear?.cicle; // Ciclo escolar
                this.lead.referenceType = res.data.referenceType; // Tipo de referido
                this.lead.referenceName = res.data.referenceName; // Nombre del referido
                this.lead.dataSource = res.data.dataSource; // Donde obtuvo el dato
                this.lead.admissionSemester = res.data.admissionSemester; // Semestre de ingreso
                this.lead.created_at = res.data.created_at;        

                this.lead.user.name = res.data.user?.name;

                // this.lead.dateBirth = res.data.dateBirth;
            } catch (error) {
                console.error('Error al obtener el lead:', error);
            }
        },

        async fetchComments() {
          const id = this.$route.params.id; // Obtener el ID del lead de la ruta
          console.log(id)
          try {
            // Verificar si leadId no es null o undefined antes de hacer la solicitud
            if (!this.leadId){
              const response = await axios.get(`http://localhost:3000/api/admin/lead/${id}/comments`);
              this.comments = response.data;
            } else {
              console.error('El ID del lead no está definido.');
            }
          } catch (error) {
            console.error('Error al obtener los comentarios:', error);
          }
        },

    },
    created() {
        const id = this.$route.params.id;
        this.getLead(id);
    },
    mounted() {
    const id = this.$route.params.id; // Obtener el ID del lead de la ruta
    this.getLead(id); // Llamar a getLead para obtener el lead y su ID
    this.fetchComments();
  },
    computed: {
        formatDate() {
            return (dateString) => {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const date = new Date(dateString);
                return date.toLocaleDateString('es-ES', options);
            };
        }
    }
};
</script>

<template>
    <DashboardLayout :breadcrumbs="bread">

        <div class="mx-auto max-w-[1400px] my-3 px-5">
            <router-link :to="{ path: '/admin/leads' }"
                class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200">
                Volver a la página anterior
            </router-link>
        </div>

        <Suspense>
            <template #default>
   
                <section class="w-full mx-auto max-w-[1400px] grid grid-cols-10 auto-rows-auto gap-2 p-5">

                    <div class="col-span-10 mb-3">
                        <div class="flex flex-col md:flex-row justify-center md:justify-end gap-2">
                            <span class="inline-flex bg-gray-100 text-gray-800 text-xs font-medium items-center px-5 py-3.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ">
                                <i class="bi bi-calendar-event-fill mr-2"></i>
                                Fecha primer contacto: <b class="ml-1 text-black dark:text-white">{{ lead.dateFirstContact }}</b>
                            </span>

                            <span class="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
                                Seguimiento: <b class="text-black dark:text-white">{{ lead.followUp.name }}</b>
                            </span>

                            <span class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
                                Status: <b class="text-black dark:text-white">{{ lead.enrollmentStatus }}</b>
                            </span>

                        </div>
                    </div>
                    
                    <BentoItem colSpan="col-span-10 lg:col-span-4">
                        <BentoItemTitle>
                            <i class="bi bi-person-circle mr-1"></i> Datos personales
                        </BentoItemTitle>

                        <ul class="py-4 space-y-3">
                            <li><span>Nombre completo:</span> {{ lead.name }}</li>
                            <li><span>Teléfono:</span> {{ lead.tel }}</li>
                            <li><span>Teléfono (Opcional):</span> {{ lead.telOptional }}</li>
                            <li><span>Correo electrónico:</span> {{ lead.email }}</li>
                            <li><span>Correo electrónico (Opcional):</span> {{ lead.emailOptional }}</li>
                            <li><span>País:</span> {{ lead.country }}</li>
                            <li><span>Estado:</span> {{ lead.state }}</li>
                            <li><span>Ciudad:</span> {{ lead.city }}</li>
                            <li><span>Fecha de nacimiento:</span> {{ lead.dateBirth }}</li>
                            <li><span>Sexo: </span> {{ lead.genre }}</li>
                        </ul>
                    </BentoItem>

                    <BentoItem colSpan="col-span-10 lg:col-span-6">
                        <BentoItemTitle>
                            <i class="bi bi-mortarboard-fill mr-2"></i> Datos académicos
                        </BentoItemTitle>

                        <ul class="py-4 space-y-3">
                            <li><span>Carrera de interés:</span> {{ lead.career }}</li>
                            <li><span>Grado escolar:</span> {{ lead.grade.name }}</li>
                            <li><span>Programa:</span> </li>
                            <li><span>Ciclo escolar:</span> {{ lead.schoolYear?.cicle }}</li>
                            <li><span>Escuela de procedencia:</span> {{ lead.formerSchool }}</li>
                            <li><span>Tipo de escuela:</span> {{ lead.typeSchool }}</li>
                            <li><span>Beca ofrecida:</span> {{ lead.scholarship }}</li>
                        </ul>
                    </BentoItem>

                    <BentoItem colSpan="col-span-10 lg:col-span-5">
                        <BentoItemTitle>
                            <i class="bi bi-journal-album mr-2"></i> Medio de contacto
                        </BentoItemTitle>

                        <ul class="py-4 space-y-3">
                            <li><span>Medio:</span> {{ lead.contactMedium.type }}</li>
                            <li><span>AsetNameForm:</span> {{ lead.asetName.name }}</li>
                            <li><span>Campaña:</span> {{ lead.campaign.name }}</li>
                        </ul>
                    </BentoItem>

                    <BentoItem colSpan="col-span-10 lg:col-span-5">
                        <BentoItemTitle>
                            <i class="bi bi-archive-fill mr-2"></i> Referido
                        </BentoItemTitle>

                        <ul class="py-4 space-y-3">
                            <li><span>Tipo de referido:</span> {{ lead.referenceType }}</li>
                            <li><span>Nombre de referido:</span> {{ lead.referenceName }}</li>
                            <li><span>Donde obtuvo el dato:</span> {{ lead.dataSource }}</li>
                        </ul>
                    </BentoItem>

                    <BentoItem colSpan="col-span-10 lg:col-span-10">
                        <BentoItemTitle>
                            <i class="bi bi-award-fill mr-2"></i> Datos inscripción
                        </BentoItemTitle>

                        <ul class="py-4 space-y-3">
                            <li><span>Fecha de inscripción:</span> {{ lead.enrollmentDate }}</li>
                            <li><span>Beca:</span> {{ lead.scholarship }}</li>
                            <li><span>Promoción de inscripción:</span> </li>
                            <li><span>Comisión:</span> </li>
                            <li><span>Matrícula:</span> </li>
                            <li><span>No. recibo:</span> </li>
                            <li><span>Lista:</span> </li>
                            <li><span>Estrategia:</span> </li>
                        </ul>
                    </BentoItem>

                    <BentoItem  colSpan="col-span-10 lg:col-span-10">
                        <BentoItemTitle>
                            <i class="bi bi-chat-right-dots-fill mr-2"></i> Comentarios
                        </BentoItemTitle>

                        <ul class="py-4 space-y-3">
                            <li><span>Comentarios:</span> </li>
                            <ul>
                                <div v-if="comments.length > 0">
                                    <!-- Iterar sobre los comentarios existentes y mostrarlos -->
                                    <li v-for="comment in comments" :key="comment.id" class="mb-2">
                                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ comment.comment }} </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(comment.date_contact) }}</p>
                                    </li>
                                </div>

                                <div v-else>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">No hay comentarios existentes.</p>
                                </div>
                            </ul>                          
                        </ul>
                    </BentoItem>

                </section>
            </template>

            <template #fallback>
                Cargando datos...
            </template>
        </Suspense>
    </DashboardLayout>
</template>

<style>
span {
    font-weight: 600;
}
</style>