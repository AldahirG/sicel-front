<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import leadService from '../../../services/lead.service';
import { CreateInformationLeadDto } from '../../../pages/Admin/Lead/dto/create-information-lead.dto';

const route = useRoute();

const { id } = route.params;

const lead = ref({});

onMounted(async () => {
    try {
        const { data } = await leadService.getById(id);
        lead.value = CreateInformationLeadDto(data);
        console.log(lead.value);
    } catch (error) {
        console.log(error);
    }
})

</script>

<template>
    <section class="flex items-center justify-center size-full">
        {{ lead.name }}
    </section>
</template>