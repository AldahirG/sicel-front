// src/core/guards/auth.guard.js
import { useAuthStore } from '../../store/auth';
import Cookies from 'js-cookie';

const authGuard = async (to, from, next) => {
  const token = Cookies.get('token');
  const auth = useAuthStore();

  if (!token && to.name !== 'Login') {
    return next({ name: 'NotLoggedIn' });
  }

  if (token && !auth.authUser) {
    try {
      await auth.getAuthUser();
    } catch (error) {
      Cookies.remove('token');
      return next({ name: 'NotLoggedIn' });
    }
  }

  // 🔍 Obtener todos los roles requeridos por la ruta y subrutas
  const routeRoles = to.matched
    .flatMap(r => r.meta?.roles || [])
    .filter(Boolean);

  const userRoles = Array.isArray(auth.authUser?.roles)
    ? auth.authUser.roles.map(r => String(r))
    : [];

  console.log('Ruta requiere roles:', routeRoles);
  console.log('Usuario tiene roles:', userRoles);

  // ✅ Si hay roles requeridos, verificar que el usuario tenga alguno
  if (routeRoles.length > 0 && !routeRoles.some(role => userRoles.includes(role))) {
    return next({ name: 'Unauthorized' });
  }

  // 🎯 Redirección desde Login si ya está autenticado
  if (to.name === 'Login' && token) {
    const mainRole = userRoles.includes('Administrador')
      ? 'Administrador'
      : userRoles.includes('Promotor')
      ? 'Promotor'
      : null;

    if (mainRole === 'Administrador') return next({ name: 'admin' });
    if (mainRole === 'Promotor') return next({ name: 'promoter' });
    return next({ name: 'Unauthorized' });
  }

  return next();
};

export default authGuard;
