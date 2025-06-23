import { useAuthStore } from '../../store/auth';

const hasRole = (requiredRole) => {
  const authStore = useAuthStore();
  const userRoles = authStore.authUser?.roles || [];
  return userRoles.includes(requiredRole);
};

const adminGuard = (to, from, next) => {
  if (hasRole('Administrador')) {
    return next();
  }
  return next({ name: 'Unauthorized' });
};

const promoterGuard = (to, from, next) => {
  if (hasRole('Promotor')) {
    return next();
  }
  return next({ name: 'Unauthorized' });
};

export { adminGuard, promoterGuard };
