import { defineStore } from 'pinia'
import leadService from '../../services/lead.service.js'

export const useFilterStore = defineStore('filterStore', {
  state: () => ({
    options: {
      followUp: [],
      genre: ['FEMENINO', 'MASCULINO'],
      enrollmentStatus: ['INS', 'INSO', 'REZA'],
      typeSchool: ['PRIVADA', 'PUBLICA'],
      intern: ['INTERNO', 'EXTERNO'],
      semester: ['1','2','3','4','5','6','7','8','9','10','NO ESPECIFICADO','OTRO'],
      program: [],
      careerInterest: [],
      formerSchool: [],
      referenceType: ['NINGUNO', 'ALUMNO', 'FAMILIAR_ALUMNO', 'PERSONAL_UNINTER'],
      referenceName: [],
      medioContacto: [],
      gradeId: [],
      asetnameId: [],
      campaignId: [],
      userId: [],
      countryId: [],
      stateId: [],
      cityId: [],
      cycleId: [],
    }
  }),

  actions: {
    async loadFilterOptions() {
      const keys = Object.keys(this.options)

      await Promise.all(keys.map(async (key) => {
        try {
          // Solo pedimos al backend si no es un filtro fijo (como enum)
          const skipServer = ['genre', 'enrollmentStatus', 'typeSchool', 'intern', 'semester', 'referenceType']
          if (skipServer.includes(key)) return

          const res = await leadService.getFilterOptions(key)
          this.options[key] = res.data.map(item => ({
            label: item.name,
            value: item.id || item.name
          }))
        } catch (error) {
          console.warn(`Error cargando opciones de filtro para ${key}:`, error)
        }
      }))
    }
  }
})
