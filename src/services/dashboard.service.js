import api from "../lib/axios";

const getHeaders = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;
  
    if (!token) {
      console.error('Error: No se encontró el token en las cookies.');
      return {};
    }
  
    return {
      Authorization: `Bearer ${token}`,
    };
  };
  
  

export default {
   // Obtener datos del dashboard para el administrador
   getTotalByStatus() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/status', { headers });
  },
  

  getTotalByCycle() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/cycle', { headers }); // Cambiar "cycles" a "cycle"
  },

  getTotalByCountry() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/country', { headers }); // Cambiar "countries" a "country"
  },

  getTotalByState() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/state', { headers }); // Cambiar "states" a "state"
  },

  getTotalByCity() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/city', { headers }); // Cambiar "cities" a "city"
  },

  getTotalByGrade() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/grade', { headers });
  },

  getTotalBySemester() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/semester', { headers });
  },

  getTotalByScholarship() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/scholarship', { headers });
  },

  getTotalBySchoolType() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/school-type', { headers });
  },

  getTotalByContactMedium() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return api.get('/dashboard/contact-medium', { headers });
  },

  // Obtener datos del dashboard para el promotor
  // Métodos para el promotor
  getTotalByStatusForPromoter() {
    return api.get(`/dashboard/promoter/status`, { headers: getHeaders() });
  },

  getTotalByFollowUpForPromoter() {
    return api.get(`/dashboard/promoter/followup`, { headers: getHeaders() });
  },

  getTotalByCycleForPromoter() {
    return api.get(`/dashboard/promoter/cycle`, { headers: getHeaders() });
  },

  getTotalByCityForPromoter() {
    return api.get(`/dashboard/promoter/city`, { headers: getHeaders() });
  },

  getTotalByProgramForPromoter() {
    return api.get(`/dashboard/promoter/program`, { headers: getHeaders() });
  },

  getTotalByCampaignForPromoter() {
    return api.get(`/dashboard/promoter/campaign`, { headers: getHeaders() });
  },

  getTotalBySchoolTypeForPromoter() {
    return api.get(`/dashboard/promoter/school-type`, { headers: getHeaders() });
  },

  getTotalBySemesterForPromoter() {
    return api.get(`/dashboard/promoter/semester`, { headers: getHeaders() });
  },

  getTotalByScholarshipForPromoter() {
    return api.get(`/dashboard/promoter/scholarship`, { headers: getHeaders() });
  },
  

  getTotalByContactMediumForPromoter() {
    return api.get(`/dashboard/promoter/contact-type`, { headers: getHeaders() });
  },
};
