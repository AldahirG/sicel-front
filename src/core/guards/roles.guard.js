import { useAuthStore } from '../../store/auth.js';

const adminGuard = async (to, from, next) => {
    try {
        const authStore = useAuthStore();
        const roles = await authStore.getAuthUser();

        if (roles.includes('Administrador')) {
            next();
        } else {
            next({ name: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Error al obtener los roles del usuario:', error);
        next({ name: 'Unauthorized' });
    }
};

export default adminGuard;