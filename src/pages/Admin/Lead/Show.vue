<script setup>
import BentoItem from '../../../components/BentoItem.vue';
import BentoItemTitle from '../../../components/BentoItemTitle.vue';

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
                <li><span>Nombre completo:</span> </li>
                <li><span>Teléfono:</span> </li>
                <li><span>Teléfono (Opcional):</span> </li>
                <li><span>Correo electrónico:</span> </li>
                <li><span>Correo electrónico (Opcional):</span> </li>
                <li><span>País:</span> </li>
                <li><span>Estado:</span> </li>
                <li><span>Ciudad:</span> </li>
                <li><span>Fecha de nacimiento:</span> </li>
                <li><span>Sexo: </span> </li>
            </ul>
        </BentoItem>

        <BentoItem colSpan="col-span-10 lg:col-span-6">
            <BentoItemTitle>
                <i class="bi bi-mortarboard-fill mr-2"></i> Datos académicos
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <li><span>Carrera de interés:</span> </li>
                <li><span>Grado escolar:</span> </li>
                <li><span>Programa:</span> </li>
                <li><span>Ciclo escolar:</span> </li>
                <li><span>Escuela de procedencia:</span> </li>
                <li><span>Tipo de escuela:</span> </li>
                <li><span>Beca ofrecida:</span> </li>
            </ul>
        </BentoItem>

        <BentoItem colSpan="col-span-10 lg:col-span-5">
            <BentoItemTitle>
                <i class="bi bi-journal-album mr-2"></i> Medio de contacto
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <li><span>Medio:</span> </li>
                <li><span>AsetNameForm:</span> </li>
                <li><span>Campaña:</span> </li>
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

        <BentoItem colSpan="col-span-10 lg:col-span-10">
            <BentoItemTitle>
                <i class="bi bi-award-fill mr-2"></i> Datos inscripción
            </BentoItemTitle>

            <ul class="py-4 space-y-3">
                <li><span>Fecha de inscripción:</span> </li>
                <li><span>Beca:</span> </li>
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
                
            </ul>
        </BentoItem>

        </section>

</template>

<style>
span {
    font-weight: 600;
}
</style>