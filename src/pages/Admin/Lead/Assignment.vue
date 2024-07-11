<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import leadService from '../../../services/lead.service';
import user from '../../../services/user.service';
import { CreateInformationLeadDto } from '../../../pages/Admin/Lead/dto/create-information-lead.dto';

import Table from "../../../components/Table.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableRow from "../../../components/TableRow.vue";
import TableDataCell from "../../../components/TableDataCell.vue";

const toast = inject('toast');
const route = useRoute();

const { id } = route.params;

const lead = ref({});
const users = ref([]);
const selectedPromoter = ref(null);
const promoterNames = ref({});

const handleAssignment = async () => {
    try {
        lead.value.userId = selectedPromoter.value;
        const { data } = await leadService.assignment(id, lead.value.userId);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        });

    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        });
    }
};


onMounted(async () => {
    const response = await user.getAll({ role: 2 });
    users.value = response.data.data;

    /*
        Compara el uid del timeline con el response de users
        para encontrar el nombre del promotor con ese id
    */
    users.value.forEach(user => {
        promoterNames.value[user.id] = user.name;
    });

    try {
        const { data } = await leadService.getById(id, {
            'with-timeline': true
        });
        lead.value = CreateInformationLeadDto(data);
    } catch (error) {
        console.log(error);
    }
})

</script>

<template>
    <section class="grid grid-cols-1 lg:grid-cols-2 size-full h-[calc(100dvh-120px)]">

        <article class="flex flex-col items-center justify-center text-center text-black dark:text-gray-300">
            <div class="my-4">
                <h3 class="text-sm md:text-xl tracking-tighter">Nombre de lead</h3>

                <h4
                    class="text-lg text-green-600 dark:text-green-400 md:text-3xl font-bold tracking-wider line-clamp-2">
                    {{ lead.name }}
                </h4>

                <div class="mt-2">
                    <div v-if="!lead.userId" class="badge badge-primary dark:badge-outline">No asignado</div>
                    <div v-else-if="lead.dateContact == null || lead.followUp == null" class="badge badge-warning dark:badge-outline">Se puede reasignar</div>
                    <div v-else class="badge badge-error dark:badge-outline">No se puede reasignar</div>
                </div>

                <div class="flex justify-center mt-4">
                    <form v-if="!lead.userId" @submit.prevent="handleAssignment">
                        <label class="form-control w-full max-w-xs mb-4">
                            <div class="label">
                                <span class="label-text">Promotor</span>
                            </div>

                            <select 
                                v-model="selectedPromoter"
                                class="select select-bordered"
                            >
                                <option disabled selected>Selecciona un promotor</option>
                                <option v-for="user in users" :value="user.id">{{ user.name }}</option>
                            </select>
                        </label>

                        <div class="flex justify-end">
                            <button type="submit" class="btn bg-green-500 hover:bg-green-600 text-white">
                                Guardar
                            </button>
                        </div>  
                    </form>
                </div>

            </div>
        </article>

        <article class="flex flex-col items-center justify-center text-center text-black dark:text-gray-300">
            <Table>
                <template #header>
                    <TableRow>
                        <TableHeaderCell>Título</TableHeaderCell>
                        <TableHeaderCell>Promotor asignado</TableHeaderCell>
                        <TableHeaderCell>Fecha de asignación/reasignación</TableHeaderCell>
                    </TableRow>
                </template>
                <template #content>
                    <TableRow v-for="timeline in lead.timelines" :key="timeline.timelineId">
                        <TableDataCell>{{ timeline.timelineTitle }}</TableDataCell>
                        <TableDataCell>{{ promoterNames[timeline.timelineTimeableId] || 'Desconocido' }}</TableDataCell>
                        <TableDataCell><relative-time :datetime="timeline.timelineCreateAt" tense="past"></relative-time></TableDataCell>
                    </TableRow>
                </template>
            </Table>
        </article>
    </section>
</template>