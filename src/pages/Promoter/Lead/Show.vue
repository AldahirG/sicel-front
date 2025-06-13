<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import leadService from "../../../services/lead.service";

import BentoItem from "../../../components/BentoItem.vue";
import BentoItemTitle from "../../../components/BentoItemTitle.vue";
import BentoList from "../../../components/BentoList.vue";
import Chat from "../../../components/Chat.vue";

const route = useRoute();
const { id } = route.params;

const lead = ref({});

onMounted(async () => {
  try {
    const { data } = await leadService.getById(id, {
      comments: true,
    });

    const info = data.data.information;
    const address = data.data.address;
    const ref = data.data.reference;
    const aset = data.data.asetName;
    const promoter = data.data.promoter;

    lead.value = {
      name: info?.name,
      phones: data.data?.phones,
      emails: data.data?.emails,
      country: address.country?.name,
      state: address?.state,
      city: address?.city,
      genre: info?.genre,

      careerInterest: info?.careerInterest,
      grade: data.data.grade?.name,
      cycle: data.data.cycle?.cycle,
      formerSchool: info?.formerSchool,
      typeSchool: info?.typeSchool,

      asetType: aset?.contactType,
      asetName: aset?.name,
      campaign: data.data.campaign?.name,

      enrollmentStatus: info?.enrollmentStatus,
      followUp: info?.followUp?.name,

      type: ref?.type,
      nameReference: ref?.name,
      dataSource: ref?.dataSource,

      dateContact: data.data.dateContact,
      scholarship: data.data.scholarship,
      semester: data.data.semester,
      promoterName: `${promoter?.name || ''} ${promoter?.paternalSurname || ''} ${promoter?.maternalSurname || ''}`.trim(),

      comments: data.meta?.timeline,
    };
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="mx-auto max-w-[1400px] my-3 px-5">
    <router-link
      :to="{ path: '/promoter/leads' }"
      class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200"
    >
      Volver a la página anterior
    </router-link>
  </div>

  <section class="w-full mx-auto max-w-[1400px] grid grid-cols-10 auto-rows-auto gap-2 p-5">
    <div class="col-span-10 mb-3">
      <div class="flex flex-col md:flex-row justify-center md:justify-end gap-2">
        <span class="inline-flex bg-gray-100 text-gray-800 text-xs font-medium items-center px-5 py-3.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          <i class="bi bi-calendar-event-fill mr-2"></i>
          Fecha primer contacto:
          <b class="ml-1 text-black dark:text-white">{{ new Date(lead.dateContact).toLocaleDateString() }}</b>
        </span>

        <span class="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
          Seguimiento: <b class="text-black dark:text-white">{{ lead.followUp }}</b>
        </span>

        <span class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
          Status: <b class="text-black dark:text-white">{{ lead.enrollmentStatus }}</b>
        </span>

        <div>
          <router-link
            :to="{ path: `/promoter/leads/${id}/edit` }"
            class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium me-2 px-5 py-3.5 rounded"
          >
            Editar Lead
          </router-link>
        </div>
      </div>
    </div>

    <BentoItem colSpan="col-span-10 lg:col-span-4">
      <BentoItemTitle>
        <i class="bi bi-person-circle mr-1"></i> Datos personales
      </BentoItemTitle>

      <ul class="py-4 space-y-3">
        <BentoList field="Nombre">{{ lead.name }}</BentoList>
        <BentoList field="Teléfonos">{{ lead.phones?.join(", ") }}</BentoList>
        <BentoList field="Correo electrónico">{{ lead.emails?.join(", ") }}</BentoList>
        <BentoList field="País">{{ lead.country }}</BentoList>
        <BentoList field="Estado">{{ lead.state }}</BentoList>
        <BentoList field="Ciudad">{{ lead.city }}</BentoList>
        <BentoList field="Sexo">{{ lead.genre }}</BentoList>
        <BentoList field="Promotor">{{ lead.promoterName }}</BentoList>
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
        <BentoList field="Semestre">{{ lead.semester }}</BentoList>
        <BentoList field="Beca ofrecida">{{ lead.scholarship ? `${lead.scholarship}%` : 'N/A' }}</BentoList>
        <BentoList field="Escuela de procedencia">{{ lead.formerSchool }}</BentoList>
        <BentoList field="Tipo de escuela">{{ lead.typeSchool }}</BentoList>
      </ul>
    </BentoItem>

      <BentoItem colSpan="col-span-10 lg:col-span-5">
        <BentoItemTitle>
          <i class="bi bi-journal-album mr-2"></i> Medio de contacto
        </BentoItemTitle>
      
        <ul class="py-4 space-y-3">
          <BentoList field="Medio de Contacto">{{ lead.asetType }}</BentoList>
          <BentoList field="Asset Name">{{ lead.asetName }}</BentoList>
          <BentoList field="Campaña">{{ lead.campaign }}</BentoList>
        </ul>
      </BentoItem>


    <BentoItem colSpan="col-span-10 lg:col-span-5">
      <BentoItemTitle>
        <i class="bi bi-archive-fill mr-2"></i> Referido
      </BentoItemTitle>

      <ul class="py-4 space-y-3">
        <BentoList field="Tipo de referido">{{ lead.type }}</BentoList>
        <BentoList field="Nombre del referido">{{ lead.nameReference }}</BentoList>
        <BentoList field="Donde obtuvo el dato">{{ lead.dataSource }}</BentoList>
      </ul>
    </BentoItem>

    <BentoItem colSpan="col-span-10 lg:col-span-10">
      <BentoItemTitle>
        <i class="bi bi-chat-right-dots-fill mr-2"></i> Comentarios
      </BentoItemTitle>

      <ul class="py-4 space-y-2">
        <li v-for="comment in lead.comments" :key="comment.id">
          <Chat position="chat-end" :date="comment.createAt" :text="comment.description" />
        </li>
      </ul>
    </BentoItem>
  </section>
</template>
