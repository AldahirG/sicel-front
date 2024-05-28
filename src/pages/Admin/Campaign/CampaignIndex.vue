<script setup>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useCampaignsStore } from "../../../store/Admin/campaigns";

import Button from "../../../components/Button.vue";
import TableRow from "../../../components/TableRow.vue";
import TableHeaderCell from "../../../components/TableHeaderCell.vue";
import TableDataCell from "../../../components/TableDataCell.vue";
const Table = defineAsyncComponent(() =>
    import('../../../components/Table.vue')
);

const store = useCampaignsStore();
const campaigns = ref([]);

onMounted(async () => {
    await store.getAll();
    campaigns.value = store.campaigns;
});

</script>

<template>
    <section class="flex items-end justify-end mb-6">
        
        <Button
            name="createCampaign"
            label="campaña"
        />
    </section>

    <section>
        <Table>
            <template #header>
                <TableRow>
                    <TableHeaderCell>Nombre</TableHeaderCell>
                    <TableHeaderCell>Tipo de campaña</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                </TableRow>
            </template>
            <template #content>
                <TableRow v-for="campaign in campaigns" :key="campaign.id">
                    <TableDataCell>{{ campaign.name }}</TableDataCell>
                    <TableDataCell>{{ campaign.type }}</TableDataCell>
                    <TableDataCell>

                        <router-link :to="{ path: '/admin/campaigns/' + campaign.id + '/edit/'}"
                            class="py-2 px-4 text-black bg-amber-400 hover:bg-amber-500 rounded-md duration-200">
                            <i class="bi bi-pencil-square"></i>
                        </router-link>

                    </TableDataCell>
                </TableRow>
            </template>
        </Table>
    </section>
</template>