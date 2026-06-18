import { defineStore } from "pinia";
import Cookies from 'js-cookie';
import router from '../routes/routes';
import { DEMO_TOKEN, DEMO_USER } from '../data/mock.js';

const DEMO_EMAIL = 'demo@sicel.mx'
const DEMO_PASSWORD = 'demo1234'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
  }),
  actions: {
    async signIn(data) {
      try {
        if (data.email !== DEMO_EMAIL || data.password !== DEMO_PASSWORD) {
          return false
        }

        Cookies.set('token', DEMO_TOKEN, { expires: 1 })
        localStorage.setItem('token', DEMO_TOKEN)

        this.authUser = { ...DEMO_USER }

        const roles = this.authUser.roles
        if (roles.includes('Administrador')) {
          router.push('/admin')
        } else if (roles.includes('Promotor')) {
          router.push('/promoter')
        } else {
          router.push('/unauthorized')
        }

        return true
      } catch (error) {
        console.log('Error al iniciar sesión', error)
        return false
      }
    },

    async getAuthUser() {
      try {
        const token = Cookies.get('token')
        if (!token) return []

        // Demo mode — always return the demo user
        this.authUser = { ...DEMO_USER }
        return this.authUser.roles
      } catch (error) {
        console.log('Error al obtener usuario autenticado', error)
        return []
      }
    },

    async logout() {
      Cookies.remove('token')
      localStorage.removeItem('token')
      this.authUser = null
      router.push('/')
    },
  },
})
