<script setup>
import { useAuthStore } from '../store/auth';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import SideBarLink from '../components/SideBarLink.vue';

const route = useRoute();

const props = defineProps({
    breadcrumbs: {
        type: Array,
    }
})

const theme = ref(localStorage.getItem('theme') || 'light');
const isChecked = ref(theme.value === 'dark');
const handleToggle = () => {
    isChecked.value = !isChecked.value;
    theme.value = isChecked.value ? 'dark' : 'light';
};

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")
const toggleMenu = () => {
    is_expanded.value = !is_expanded.value
    localStorage.setItem("is_expanded", is_expanded.value)
}

// Colorea la ruta actual
const isLinkActive = (path) => {
    return route.path === path;
}

const authStore = useAuthStore();
const authUser = authStore.authUser;

const isAdmin = authUser.roles.includes('Administrador');
const isPromoter = authUser.roles.includes('Promotor');


// Metodo cerrar sesión
const handleLogout = async () => {
    await authStore.logout();
};


watchEffect(() => {
    localStorage.setItem('theme', theme.value);
    document.querySelector('html').setAttribute('data-theme', theme.value);
});
</script>

<template>
    <div 
        id="app" 
        class="relative h-full transition-all duration-200 ease-in-out" 
        :class="`${is_expanded ? 'is-expanded' : ''}`"
    >
        <aside 
            :class="is_expanded ? 'max-w-[200px]' : 'max-w-[calc(2rem+32px)]'"
            class="[grid-area:aside] fixed top-0 flex flex-col max-h-dvh p-[1rem] bg-primary-950 text-white z-50"
        >
            <figure 
                class="mb-[1rem] w-[2rem]"
            >
                <img 
                    src="/logo-dashboard.png" 
                    alt="Logo-Uninter" 
                    class="rounded-full"
                >
            </figure>

            <div 
                :class="is_expanded ? 'justify-end -top-12' : 'justify-center top-0'"
                class="relative flex mb-[1rem] transition-all duration-200 ease-in-out"
            >
                <button 
                    type="button" 
                    @click="toggleMenu" 
                    v-if="!is_expanded"
                    class="hover:text-green-500"
                >
                    <i class="bi bi-arrows-angle-expand text-2xl transition-all duration-300 ease-in-out"></i>
                </button>

                <button 
                    type="button" 
                    @click="toggleMenu" 
                    v-else
                    class="hover:text-green-500"
                >
                    <i class="bi bi-arrows-angle-contract text-2xl transition-all duration-300 ease-in-out"></i>
                </button>
            </div>

            <h3 
                :class="is_expanded ? 'opacity-100' : 'opacity-0'" 
                class="mb-2 text-gray-300 text-[0.875rem] uppercase transition-all duration-200 ease-in-out"
            >
                Menú
            </h3>

            <ul>
                <!-- Enlaces de administrador -->
                <div
                    v-if="isAdmin"
                    :class="is_expanded ? 'grid-cols-3' : 'grid-cols-1'"
                    class="grid pt-6 items-center text-center"
                >
                    <hr class="border-gray-400">
                    <p :class="is_expanded ? 'text-sm' : 'text-xs'">Admin</p>
                    <hr class="border-gray-400">
                </div>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin" 
                        :active="isLinkActive('/admin')"
                        class="link"
                    >
                        <i 
                            class="bi bi-house-door-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Inicio
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/users" 
                        :active="isLinkActive('/admin/users')"
                        class="link"
                    >
                        <i 
                            class="bi bi-people-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Usuarios
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/countries" 
                        :active="isLinkActive('/admin/countries')"
                        class="link"
                    >
                        <i 
                            class="bi bi-flag-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            País
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/states" 
                        :active="isLinkActive('/admin/states')"
                        class="link"
                    >
                        <i 
                            class="bi bi-map-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Estado
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/cities" 
                        :active="isLinkActive('/admin/cities')"
                        class="link"
                    >
                        <i 
                            class="bi bi-building transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Ciudad
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/careers" 
                        :active="isLinkActive('/admin/careers')"
                        class="link"
                    >
                        <i 
                            class="bi bi-flag-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Carreras
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/campaigns" 
                        :active="isLinkActive('/admin/campaigns')"
                        class="link"
                    >
                        <i 
                            class="bi bi-megaphone-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Campaign_name
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/follow-ups" 
                        :active="isLinkActive('/admin/follow-ups')"
                        class="link"
                    >
                        <i 
                            class="bi bi-journal-text transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Seguimientos
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/grades" 
                        :active="isLinkActive('/admin/grades')"
                        class="link"
                    >
                        <i 
                            class="bi bi-mortarboard-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Grados escolares
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/contact-mediums" 
                        :active="isLinkActive('/admin/contact-mediums')"
                        class="link"
                    >
                        <i 
                            class="bi bi-book-half transition-all duration-200 ease-out"
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Medios de contacto
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/aset-names" 
                        :active="isLinkActive('/admin/aset-names')"
                        class="link"
                    >
                        <i 
                            class="bi bi-alphabet-uppercase transition-all duration-200 ease-out"
                            :class="is_expanded ? 'mr-4' : 'mr-0'">

                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Aset Names
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/cycles" 
                        :active="isLinkActive('/admin/cycles')"
                        class="link"
                    >
                        <i 
                            class="bi bi-calendar2-event-fill transition-all duration-200 ease-out"
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Ciclos escolares
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/leads" 
                        :active="isLinkActive('/admin/leads')"
                        class="link"
                    >
                        <i 
                            class="bi bi-person-workspace transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Leads
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isAdmin">
                    <SideBarLink
                        to="/admin/enrollments" 
                        :active="isLinkActive('/admin/enrollments')"
                        class="link"
                    >
                        <i 
                            class="bi bi-star-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Inscripciones
                        </span>
                    </SideBarLink>
                </li>

                <!-- Enlaces de promotor -->
                <div
                    v-if="isPromoter"
                    :class="is_expanded ? 'grid-cols-3' : 'grid-cols-1'"
                    class="grid pt-6 items-center text-center"
                >
                    <hr class="border-gray-400">
                    <p :class="is_expanded ? 'text-sm' : 'text-xs'">Promotor</p>
                    <hr class="border-gray-400">
                </div>

                <li v-if="isPromoter">
                    <SideBarLink
                        to="/promoter" 
                        :active="isLinkActive('/promoter')"
                        class="link"
                    >
                        <i 
                            class="bi bi-house-door-fill transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Inicio
                        </span>
                    </SideBarLink>
                </li>

                <li v-if="isPromoter">
                    <SideBarLink
                        to="/promoter/leads" 
                        :active="isLinkActive('/promoter/leads')"
                        class="link"
                    >
                        <i 
                            class="bi bi-person-workspace transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Leads
                        </span>
                    </SideBarLink>
                </li>
                
                <li v-if="isPromoter">
                    <SideBarLink
                        to="/promoter/enrollments" 
                        :active="isLinkActive('/promoter/enrollments')"
                        class="link"
                >
                        <i 
                            class="bi bi-clipboard-check transition-all duration-200 ease-out" 
                            :class="is_expanded ? 'mr-4' : 'mr-0'">
                        </i>
                        <span
                            :class="is_expanded ? 'opacity-100' : 'opacity-0'"
                            class="transition-all duration-200 ease-in-out"
                        >
                            Inscripciones
                        </span>
                    </SideBarLink>
                </li>
            </ul>
        </aside>

        <header
            class="[grid-area:header] h-[60px] px-3 md:px-6 bg-white dark:bg-[#1D232A] border-b border-b-[#d1d0d0] sticky top-0 z-30"
        >
            <nav class="flex items-center justify-end h-full w-full">
                <div class="flex flex-row items-center gap-6">
                    <div>
                        <label class="flex cursor-pointer gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                            <input 
                                type="checkbox"
                                @change="handleToggle"
                                :checked="isChecked"
                                class="toggle theme-controller"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        </label>
                    </div>

                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online placeholder">
                            <div class="bg-gray-300 dark:bg-[#2a323c] rounded-full w-16">
                                <span class="text-xs">{{ authUser.name[0] }}</span>
                            </div>
                        </div>

                        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-300 dark:bg-[#2a323c] rounded-box w-52">
                            <li>
                                <button 
                                    @click="handleLogout"
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        <main 
            class="[grid-area:main] bg-white dark:bg-[#1D232A] px-4 py-6"
        >
            <RouterView />
        </main>
    </div>
</template>

<style lang="scss" scoped>

#app {
    display: grid;
    grid-template-areas:
        "aside header header"
        "aside main main";
    grid-template-columns: 64px 1fr;
    grid-template-rows: auto 1fr;

    &.is-expanded {
        grid-template-columns: 200px 1fr;
        grid-template-rows: auto 1fr ;
    }
}

aside {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    transition: 0.2s ease-in-out;

    scrollbar-color: #7D7C7C transparent;
    scrollbar-width: thin;

    ul {
        margin: 0 -1rem;

        li {
            .link {
                display: flex;
                align-items: center;
                text-decoration: none;
                padding: 0.5rem 1rem;
                transition: 0.2s ease-out;
            }

            i {
                font-size: 1.25rem;
            }

            span {
                font-size: 0.8rem;
            }

            &:hover {
                background-color: #334155;
                color: #22c55e;
                transition: 0.3s ease-out;
            }
        }
    }
}
</style>