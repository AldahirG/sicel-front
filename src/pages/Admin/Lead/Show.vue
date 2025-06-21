<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import leadService from '../../../services/lead.service';
import enrollmentService from '../../../services/enrollment.service';

import BentoItem from '../../../components/BentoItem.vue';
import BentoItemTitle from '../../../components/BentoItemTitle.vue';
import BentoList from "../../../components/BentoList.vue";
import Chat from "../../../components/Chat.vue";

const route = useRoute();
const { id } = route.params;

const lead = ref({});
const enrollment = ref({});

onMounted(async () => {
  try {
    // 📦 Traer Lead con info extendida y comentarios
    const { data } = await leadService.getById(id, {
      comments: true
    });

    const leadData = data.data;

    lead.value = {
      name: leadData.information?.name,
      phones: leadData.phones || [],
      emails: leadData.emails || [],
      country: leadData.address.country?.name,
      state: leadData.address?.state,
      city: leadData.address?.city,
      genre: leadData.information?.genre,

      careerInterest: leadData.information?.careerInterest,
      grade: leadData.grade?.name,
      dateContact: leadData?.dateContact,
      cycle: leadData.cycle?.cycle,
      semester: leadData.semester,
      scholarship: leadData.scholarship,
      formerSchool: leadData.information?.formerSchool,
      typeSchool: leadData.information?.typeSchool,

      asetName: leadData.asetName?.name,
      contactType: leadData.asetName?.contactType || 'SIN MEDIO',
      campaign: leadData.campaign?.name,

      enrollmentStatus: leadData.information?.enrollmentStatus,
      followUp: leadData.information.followUp?.name,

      type: leadData.reference?.type,
      nameReference: leadData.reference?.name,
      dataSource: leadData.reference?.dataSource,

      promoter: `${leadData.promoter?.name || 'SIN'} ${leadData.promoter?.paternalSurname || ''}`,

      comments: data.meta?.timeline
    };

    // 📦 Si hay inscripción registrada, obtenerla
    if (leadData.enrollmentId) {
      const { data: enrollmentData } = await enrollmentService.getById(leadData.enrollmentId);
      enrollment.value = {
        folio: enrollmentData.data?.enrollment_folio,
        matricula: enrollmentData.data?.matricula,
        curp: enrollmentData.data?.curp,
        program: enrollmentData.data?.Career?.program,
        promotion: enrollmentData.data?.Promotion?.name,
        channel: enrollmentData.data?.Channel?.name,
        list: enrollmentData.data?.List?.noLista,
        comments: enrollmentData.data?.comments
      };
    }

  } catch (error) {
    console.error(error);
  }
});
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
        <span
          class="inline-block bg-gray-100 text-gray-800 text-xs font-medium items-center px-5 py-3.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          <i class="bi bi-calendar-event-fill mr-2"></i>
          Fecha primer contacto:
          <b class="ml-1 text-black dark:text-white">
            <relative-time no-title format="datetime" tense="auto" :datetime="lead.dateContact" />
            {{ lead.dateContact }}
          </b>
        </span>

        <span
          class="inline-block bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
          Seguimiento: <b class="text-black dark:text-white">{{ lead.followUp }}</b>
        </span>

        <span
          class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
          Status: <b class="text-black dark:text-white">{{ lead.enrollmentStatus }}</b>
        </span>

        <div>
          <router-link :to="{ path: `/promoter/leads/${id}/edit` }"
            class="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-medium me-2 px-5 py-3.5 rounded">
            Editar Lead
          </router-link>
        </div>
      </div>
    </div>

    <BentoItem colSpan="col-span-10 lg:col-span-4">
      <BentoItemTitle><i class="bi bi-person-circle mr-1"></i> Datos personales</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <BentoList field="Nombre">{{ lead.name }}</BentoList>
        <BentoList field="Telefónos">{{ lead.phones?.join(", ") }}</BentoList>
        <BentoList field="Correo electrónico">{{ lead.emails?.join(", ") }}</BentoList>
        <BentoList field="País">{{ lead.country }}</BentoList>
        <BentoList field="Estado">{{ lead.state }}</BentoList>
        <BentoList field="Ciudad">{{ lead.city }}</BentoList>
        <BentoList field="Sexo">{{ lead.genre }}</BentoList>
        <BentoList field="Promotor">{{ lead.promoter }}</BentoList>
      </ul>
    </BentoItem>

    <BentoItem colSpan="col-span-10 lg:col-span-6">
      <BentoItemTitle><i class="bi bi-mortarboard-fill mr-2"></i> Datos académicos</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <BentoList field="Carrera de interés">{{ lead.careerInterest }}</BentoList>
        <BentoList field="Grado escolar">{{ lead.grade }}</BentoList>
        <BentoList field="Ciclo escolar">{{ lead.cycle }}</BentoList>
        <BentoList field="Semestre">{{ lead.semester }}</BentoList>
        <BentoList field="Beca del lead">{{ lead.scholarship }}</BentoList>
        <BentoList field="Escuela de procedencia">{{ lead.formerSchool }}</BentoList>
        <BentoList field="Tipo de escuela">{{ lead.typeSchool }}</BentoList>
      </ul>
    </BentoItem>

    <BentoItem colSpan="col-span-10 lg:col-span-5">
      <BentoItemTitle><i class="bi bi-journal-album mr-2"></i> Medio de contacto</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <BentoList field="Medio">{{ lead.contactType }}</BentoList>
        <BentoList field="Asset Name">{{ lead.asetName }}</BentoList>
        <BentoList field="Campaña">{{ lead.campaign }}</BentoList>
      </ul>
    </BentoItem>

    <BentoItem colSpan="col-span-10 lg:col-span-5">
      <BentoItemTitle><i class="bi bi-archive-fill mr-2"></i> Referido</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <BentoList field="Tipo de referido">{{ lead.type }}</BentoList>
        <BentoList field="Nombre del referido">{{ lead.nameReference }}</BentoList>
        <BentoList field="Donde obtuvo el dato">{{ lead.dataSource }}</BentoList>
      </ul>
    </BentoItem>


    <BentoItem colSpan="col-span-10 lg:col-span-10">
      <BentoItemTitle><i class="bi bi-chat-right-dots-fill mr-2"></i> Comentarios</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <li v-for="comment in lead.comments" :key="comment.id">
          <Chat :date="comment.createAt" :text="comment.description" bgColor="bg-green-500" textColor="text-black" />
        </li>
      </ul>
    </BentoItem>

    </section>
    </template>


    <!-- <BentoItem colSpan="col-span-10 lg:col-span-10" v-if="Object.keys(enrollment).length > 0">
      <BentoItemTitle><i class="bi bi-card-checklist mr-2">
        
        
        </i> Datos de Inscripción</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <BentoList field="Folio">{{ enrollment.folio }}</BentoList>
        <BentoList field="Matrícula">{{ enrollment.matricula }}</BentoList>
        <BentoList field="CURP">{{ enrollment.curp }}</BentoList>
        <BentoList field="Programa">{{ enrollment.program }}</BentoList>
        <BentoList field="Promoción">{{ enrollment.promotion }}</BentoList>
        <BentoList field="Canal de venta">{{ enrollment.channel }}</BentoList>
        <BentoList field="Lista de comisión">{{ enrollment.list }}</BentoList>
        <BentoList field="Comentarios">{{ enrollment.comments }}</BentoList>
      </ul>
    </BentoItem>

    <BentoItem colSpan="col-span-10 lg:col-span-10">
      <BentoItemTitle><i class="bi bi-chat-right-dots-fill mr-2"></i> Comentarios</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <li v-for="comment in lead.comments" :key="comment.id">
          <Chat :date="comment.createAt" :text="comment.description" bgColor="bg-green-500" textColor="text-black" />
        </li>
      </ul>
    </BentoItem>
  </section>
</template> -->
