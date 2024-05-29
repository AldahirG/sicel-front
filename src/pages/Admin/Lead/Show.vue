<script setup>
import { inject , onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import leadService from '../../../services/lead.service';

import BentoItem from '../../../components/BentoItem.vue';
import BentoItemTitle from '../../../components/BentoItemTitle.vue';
import BentoList from "../../../components/BentoList.vue";

const route = useRoute();

const { id } = route.params;

const lead = ref({});

onMounted(async () => {
    try {
        const { data } = await leadService.getById(id);
        lead.value = {
            name: data.data.information?.name,
            phones: data.data?.phones,
            emails: data.data?.emails,
            country: data.data.address?.country,
            state: data.data.address?.state,
            city: data.data.address?.city,
            genre: data.data.information?.genre,

            careerInterest: data.data.information?.careerInterest,
            grade: data.data.grade?.name,
            // cycle: data.data.cycle.cycle,
            formerSchool: data.data.information?.formerSchool,
            typeSchool: data.data.information?.typeSchool,

            asetName: data.data.asetName?.name,
            campaign: data.data.campaign?.name,

            enrollmentStatus: data.data.information?.enrollmentStatus,
            followUp: data.data.information.followUp?.name,
            
        };
    } catch (error) {
        console.log(error);
    }
})

</script>

<template>

    <div class="mx-auto max-w-[1400px] my-3 px-5">
        <router-link :to="{ path: '/admin/leads' }"
            class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200">
            Volver a la página anterior
        </router-link>
    </div>

    <section class="w-full mx-auto max-w-[1400px] grid grid-cols-10 auto-rows-auto gap-2 p-5">
        <div class="col-span-10 mb-3">
            <div class="flex flex-col md:flex-row justify-center md:justify-end gap-2">
                <span class="inline-flex bg-gray-100 text-gray-800 text-xs font-medium items-center px-5 py-3.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 ">
                    <i class="bi bi-calendar-event-fill mr-2"></i>
                    Fecha primer contacto: <b class="ml-1 text-black dark:text-white"></b>
                </span>

                <span class="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
                    Seguimiento: <b class="text-black dark:text-white"></b>
                </span>

                <span class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
                    Status: <b class="text-black dark:text-white"></b>
                </span>

            </div>
        </div>

        <BentoItem colSpan="col-span-10 lg:col-span-4">
            <BentoItemTitle>
                <i class="bi bi-person-circle mr-1"></i> Datos personales
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <BentoList field="Nombre">{{ lead.name }}</BentoList>
                <BentoList field="Telefónos">{{ lead.phones }}</BentoList>
                <BentoList field="Correo electrónico">{{ lead.emails }}</BentoList>
                <BentoList field="País">{{ lead.country }}</BentoList>
                <BentoList field="Estado">{{ lead.state }}</BentoList>
                <BentoList field="Ciudad">{{ lead.city }}</BentoList>
                <BentoList field="Sexo">{{ lead.genre }}</BentoList>
            </ul>
        </BentoItem>

        <BentoItem colSpan="col-span-10 lg:col-span-6">
            <BentoItemTitle>
                <i class="bi bi-mortarboard-fill mr-2"></i> Datos académicos
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <BentoList field="Carrera de interés">{{ lead.careerInterest }}</BentoList>
                <BentoList field="Grado escolar">{{ lead.grade }}</BentoList>
                <BentoList field="Ciclo escolar">{{ lead.cycle }}</BentoList>
                <BentoList field="Escuela de procedencia">{{ lead.formerSchool }}</BentoList>
                <BentoList field="Tipo de escuela">{{ lead.typeSchool }}</BentoList>
                <BentoList field="Escuela de procedencia">{{ lead.formerSchool }}</BentoList>
            </ul>
        </BentoItem>

        <BentoItem colSpan="col-span-10 lg:col-span-5">
            <BentoItemTitle>
                <i class="bi bi-journal-album mr-2"></i> Medio de contacto
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <li><span>Medio:</span> </li>
                <BentoList field="Aset Name">{{ lead.asetName }}</BentoList>
                <BentoList field="Campaña">{{ lead.campaign }}</BentoList>
            </ul>
        </BentoItem>

        <BentoItem colSpan="col-span-10 lg:col-span-5">
            <BentoItemTitle>
                <i class="bi bi-archive-fill mr-2"></i> Referido
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <li><span>Tipo de referido:</span> </li>
                <li><span>Nombre de referido:</span> </li>
                <li><span>Donde obtuvo el dato:</span> </li>
            </ul>
        </BentoItem>

        <BentoItem  colSpan="col-span-10 lg:col-span-10">
            <BentoItemTitle>
                <i class="bi bi-chat-right-dots-fill mr-2"></i> Comentarios
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <li><span>Comentarios:</span> </li>
                
            </ul>
        </BentoItem>

        </section>

</template>