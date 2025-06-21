import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./Admin/admin.routes.js";
import { promoterRoutes } from "./Promoter/promoter.routes.js";
import Login from '../pages/Home.vue';
import authGuard from "../core/guards/auth.guard.js";

const routes = [
    // Página de inicio de sesión
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    // Página para usuarios no autenticados
    {
        path: '/not-logged-in',
        name: 'NotLoggedIn',
        component: () => import('../pages/Errors/NotLoggedIn.vue'),
    },
    // Página para usuarios con roles no autorizados
    {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('../pages/Errors/Unauthorized.vue'),
    },
    // Página de error 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/Errors/NotFound.vue'),
    },

    // Rutas del administrador (¡deben tener meta: { roles: ['Administrador'] } en cada archivo!)
    ...adminRoutes,

    // Rutas del promotor (¡deben tener meta: { roles: ['Promotor'] } en cada archivo!)
    ...promoterRoutes,
];

// Crear el router con historial HTML5
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ✅ Activar el guardia de autenticación
router.beforeEach(authGuard);

export default router;
