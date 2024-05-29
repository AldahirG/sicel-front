import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./Admin/admin.routes.js";
import { promoterRoutes } from "./Promoter/promoter.routes.js";
import Login from '../pages/Home.vue';
import authGuard from "../core/guards/auth.guard.js";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    // Error 403
    {
        path: '/not-logged-in',
        name: 'NotLoggedIn',
        component: () => import('../pages/Errors/NotLoggedIn.vue'),
    },
    {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('../pages/Errors/Unauthorized.vue'),
    },
    // Error 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/Errors/NotFound.vue'),
    },
    
    ...adminRoutes,

    ...promoterRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// router.beforeEach(authGuard);

export default router