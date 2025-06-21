import { useAuthStore } from '../../store/auth';
import Cookies from 'js-cookie';

const authGuard = async (to, from, next) => {
  const token = Cookies.get('token');
  const auth = useAuthStore();

  // Si no hay token, redirige al login
  if (!token && to.name !== 'Login') {
    return next({ name: 'NotLoggedIn' });
  }

  // Si hay token pero no authUser en el store, lo obtenemos
  if (token && !auth.authUser) {
    try {
      await auth.getAuthUser();
    } catch (error) {
      Cookies.remove('token');
      return next({ name: 'NotLoggedIn' });
    }
  }

  // 🔍 Aseguramos que roles sean strings simples
  const routeRoles = to.meta?.roles;
  const userRoles = Array.isArray(auth.authUser?.roles)
    ? auth.authUser.roles.map(r => String(r))
    : [];

  console.log('Ruta requiere roles:', routeRoles);
  console.log('Usuario tiene roles:', userRoles);

  // Validación por roles
  if (routeRoles && !routeRoles.some(role => userRoles.includes(role))) {
    return next({ name: 'Unauthorized' });
  }

  // Si está logueado y va a Login, redirige según rol
  if (to.name === 'Login' && token) {
    const target = userRoles.includes('Administrador') ? 'admin' : 'promoter';
    return next({ name: target });
  }

  return next();
};

export default authGuard;
