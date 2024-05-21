import { defineStore } from "pinia";
import axios from 'axios';
import Cookies from 'js-cookie';

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
                
                Cookies.set('token', response.data.data.token, { expires: 1 });
                
                const roles = response.data.data.roles;

                if (roles.includes('Administrador')) {
                    this.router.push('/admin');
                } else if (roles.includes('Promotor')) {
                    this.router.push('/promoter');
                }

            } catch (error) {
                console.log('Error al iniciar sesión', error);
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
    
                this.router.push("/");
            } catch (error) {
                console.error('Error al cerrar sesión', error);
            }
        },
    },
})