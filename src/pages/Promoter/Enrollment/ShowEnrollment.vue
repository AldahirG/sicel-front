<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import enrollmentService from '../../../services/enrollment.service';
import leadService from '../../../services/lead.service';

import BentoItem from '../../../components/BentoItem.vue';
import BentoItemTitle from '../../../components/BentoItemTitle.vue';
import BentoList from "../../../components/BentoList.vue";
import SolicitudPDF from '../../../components/SolicitudPDF.vue';


const route = useRoute();
const { id } = route.params;

const enrollment = ref({});
const lead = ref({});

onMounted(async () => {
  try {
    // 📦 1. Obtener inscripción
    const { data } = await enrollmentService.getById(id);
    const enrollmentData = data.data;
    const leadId = enrollmentData.leadId;

    enrollment.value = {
      id: enrollmentData.id,
      date: enrollmentData.createAt,
      updateAt: enrollmentData.updateAt,
      career: enrollmentData.Career?.program,
      promotion: enrollmentData.Promotion?.name,
      channel: enrollmentData.Channel?.name,
      scholarship: enrollmentData.scholarship,
      list: enrollmentData.List?.noLista,
      comments: enrollmentData.comments,
      folio: enrollmentData.enrollment_folio,
      matricula: enrollmentData.matricula,
      curp: enrollmentData.curp,
      available: enrollmentData.available,
    };

    // 📦 2. Obtener info extendida del lead
    const leadResponse = await leadService.getById(leadId);
    const leadData = leadResponse.data.data;

    lead.value = {
      id: leadData.id,
      name: leadData.information?.name,
      genre: leadData.information?.genre,
      careerInterest: leadData.information?.careerInterest,
      formerSchool: leadData.information?.formerSchool,
      typeSchool: leadData.information?.typeSchool,
      enrollmentStatus: leadData.information?.enrollmentStatus,
      followUp: leadData.information?.followUp?.name || '',

      phones: leadData.phones || [],
      emails: leadData.emails || [],

      country: leadData.address?.country?.name,
      state: leadData.address?.state,
      city: leadData.address?.city,

      grade: leadData.grade?.name,
      cycle: leadData.cycle?.cycle,
      semester: leadData.semester,
      scholarship: leadData.scholarship,
      dateContact: leadData.dateContact,

      asetName: leadData.asetName?.name,
      contactType: leadData.asetName?.contactType,
      campaign: leadData.campaign?.name,

      type: leadData.reference?.type,
      nameReference: leadData.reference?.name,
      dataSource: leadData.reference?.dataSource,

      // ✅ Aquí sí viene el promotor
      promoterName: leadData.promoter?.name || 'SIN INFORMACIÓN',
      promoterPaternalSurname: leadData.promoter?.paternalSurname || '',

      available: leadData.available,
      createAt: leadData.createAt,
      updateAt: leadData.updateAt,
    };

  } catch (error) {
    console.error('❌ Error al cargar inscripción o lead:', error);
  }
});
</script>

<template>
  <div class="mx-auto max-w-[1400px] my-3 px-5">
    <router-link :to="{ path: '/admin/enrollments' }"
      class="px-3 py-2 text-white font-semibold bg-sky-700 hover:bg-sky-800 rounded duration-200">
      Volver a la página anterior
    </router-link>

    <div class="col-span-10 flex justify-end mt-4">
  <SolicitudPDF :lead="lead" :enrollment="enrollment" />
</div>

  </div>

  <section class="w-full mx-auto max-w-[1400px] grid grid-cols-10 auto-rows-auto gap-2 p-5">
    <div class="col-span-10 mb-3">
      <div class="flex flex-col md:flex-row justify-center md:justify-end gap-2">
        <span class="inline-block bg-gray-100 text-gray-800 text-xs font-medium items-center px-5 py-3.5 rounded me-2">
          <i class="bi bi-calendar-event-fill mr-2"></i>
          Fecha inscripción:
          <b class="ml-1 text-black">{{ new Date(enrollment.date).toLocaleDateString() }}</b>
        </span>
        <span class="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-5 py-3.5 rounded">
          Seguimiento: <b class="text-black">{{ lead.followUp }}</b>
        </span>
        <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium me-2 px-5 py-3.5 rounded">
          Status: <b class="text-black">{{ lead.enrollmentStatus }}</b>
        </span>
      </div>
    </div>

    <BentoItem colSpan="col-span-10 lg:col-span-4">
      <BentoItemTitle><i class="bi bi-person-circle mr-1"></i> Datos personales</BentoItemTitle>
      <ul class="py-4 space-y-3">
        <BentoList field="Nombre">{{ lead.name }}</BentoList>
        <BentoList field="Teléfonos">{{ lead.phones?.join(', ') }}</BentoList>
        <BentoList field="Correo electrónico">{{ lead.emails?.join(', ') }}</BentoList>
        <BentoList field="País">{{ lead.country }}</BentoList>
        <BentoList field="Estado">{{ lead.state }}</BentoList>
        <BentoList field="Ciudad">{{ lead.city }}</BentoList>
        <BentoList field="Sexo">{{ lead.genre }}</BentoList>
        <BentoList field="Promotor">{{ lead.promoterName }} {{ lead.promoterPaternalSurname }}</BentoList>
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
        <BentoList field="Fecha de contacto">{{ new Date(lead.dateContact).toLocaleDateString() }}</BentoList>
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
        <BentoList field="Dónde obtuvo el dato">{{ lead.dataSource }}</BentoList>
      </ul>
    </BentoItem>

    <BentoItem colSpan="col-span-10 lg:col-span-10">
      <BentoItemTitle><i class="bi bi-card-checklist mr-2"></i> Datos de Inscripción</BentoItemTitle>
      <ul class="py-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        <li><BentoList field="Recibo">{{ enrollment.folio }}</BentoList></li>
        <li><BentoList field="Matrícula Alumno">{{ enrollment.matricula }}</BentoList></li>
        <li><BentoList field="CURP">{{ enrollment.curp }}</BentoList></li>
        <li><BentoList field="Programa">{{ enrollment.career }}</BentoList></li>
        <li><BentoList field="Promoción">{{ enrollment.promotion }}</BentoList></li>
        <li><BentoList field="Canal de venta">{{ enrollment.channel }}</BentoList></li>
        <li><BentoList field="Beca asignada">{{ enrollment.scholarship }}</BentoList></li>
        <li><BentoList field="Lista de comisión">{{ enrollment.list }}</BentoList></li>
        <li class="md:col-span-2"><BentoList field="Comentarios">{{ enrollment.comments }}</BentoList></li>
      </ul>
    </BentoItem>

  </section>
</template>
