<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import leadService from '../../../services/lead.service';
import user from '../../../services/user.service';
import { CreateInformationLeadDto } from '../../../pages/Admin/Lead/dto/create-information-lead.dto';

const toast = inject('toast');
const route = useRoute();
const router = useRouter();

const { id } = route.params;

const lead = ref({});
const users = ref([]);

const handleSubmit = async () => {
    try {
        const { data } = await leadService.assignment(id, lead.value.userId);
        const message = data.http.message;

        toast.open({
            message: message,
            type: 'success'
        });

        router.push({ name: 'admin/leads' });

    } catch (error) {
        toast.open({
            message: error.response.data.message,
            type: 'error'
        });
    }
};

onMounted(async () => {
    const response = await user.getAll({role: 2});
    users.value = response.data.data;

    try {
        const { data } = await leadService.getById(id);
        lead.value = CreateInformationLeadDto(data);
    } catch (error) {
        console.log(error);
    }
})

</script>

<template>
    <section class="grid grid-cols-2 place-items-center size-full">
        <div class="flex flex-col items-center justify-center text-center text-black dark:text-gray-300">
            <div class="my-4">
                <h3 class="text-sm md:text-xl tracking-tighter">Nombre de lead</h3>
                <h4 class="text-lg text-green-600 dark:text-green-400 md:text-3xl font-bold tracking-wider line-clamp-2">{{ lead.name }}</h4>

                <div class="mt-4 text-left">
                    <form @submit.prevent="handleSubmit">

                        <label class="form-control w-full max-w-xs mb-4">
                            <div class="label">
                                <span class="label-text">Promotor</span>
                            </div>
                            <select
                                v-model="lead.userId" 
                                class="select select-bordered"
                            >
                                <option disabled selected>Selecciona un promotor</option>
                                <option v-for="user in users" :value="user.id">{{ user.name }}</option>
                            </select>
                        </label>

                        <div class="flex justify-end">
                            <button 
                                type="submit"
                                class="btn bg-green-500 hover:bg-green-600 text-white"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>