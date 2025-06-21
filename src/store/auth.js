import { defineStore } from "pinia";
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '../routes/routes'; // Ajusta esta ruta según tu estructura

// URL de API
const baseURL = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
  }),
  actions: {
    async signIn(data) {
      try {
        const response = await axios.post(`${baseURL}/auth/login`, {
          email: data.email,
          password: data.password,
        });

        // Guarda el token en cookies y localStorage
        Cookies.set('token', response.data.data.token, { expires: 1 });
        localStorage.setItem('token', response.data.data.token);

        const roles = response.data.data.roles;

        // 🔐 Redirección basada en el rol
        if (roles.includes('Administrador')) {
          router.push('/admin');
        } else if (roles.includes('Promotor')) {
          router.push('/promoter');
        } else {
          router.push('/unauthorized');
        }

        return true;
      } catch (error) {
        console.log('Error al iniciar sesión', error);
        return false;
      }
    },

    async getAuthUser() {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`${baseURL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.authUser = response.data.data;
        console.log('Auth User desde getAuthUser:', this.authUser);

        return response.data.data.roles;
        
      } catch (error) {
        console.log('Error al obtener datos del usuario autenticado', error);
        return [];
      }
    },

    async logout() {
      try {
        const token = Cookies.get('token');

        if (!token) {
          console.error('No se encontró un token en las cookies');
          return;
        }

        await axios.post(`${baseURL}/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        Cookies.remove('token');
        localStorage.removeItem('token');

        router.push("/");
      } catch (error) {
        console.error('Error al cerrar sesión', error);
      }
    },
  },
});
