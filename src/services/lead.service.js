import api from "../lib/axios";

export default {
    // Función para obtener todos los leads con filtros opcionales
    getAll(page = 1, filters = {}) {
        const params = {
            paginated: true,
            'per-page': 60,
            page,
            ...filters // Incluye los filtros aplicados
        };

        // Elimina claves con valores vacíos o nulos y codifica los valores de los parámetros
        Object.keys(params).forEach(key => {
            if (params[key] === "" || params[key] === null) {
                delete params[key];
            }
        });

        // Añadir token de autenticación en los headers
        const token = localStorage.getItem('token'); // Suponiendo que el token se guarda en localStorage
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.get('/leads', { params, headers });
    },

    getById(id, params) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.get(`/leads/${id}`, { params, headers });
    },

    create(data) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.post('/leads', data, { headers });
    },

update(id, data) {
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Limpiar valores vacíos en UUIDs
    const cleanData = { ...data };
    const uuidFields = ['cityId', 'gradeId', 'asetNameId', 'campaignId', 'userId', 'cycleId'];

    uuidFields.forEach(key => {
        if (cleanData[key] === '' || cleanData[key] === null) {
            delete cleanData[key];
        }
    });

    return api.patch(`/leads/${id}`, cleanData, { headers });
},


    delete(id) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.delete(`/leads/${id}`, { headers });
    },

    upload(data) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };

        return api.post('/leads/file-share', data, { headers });
    },

    assignment(leadId, userId) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.patch(`/leads/${leadId}/assignment/${userId}`, {}, { headers });
    },

    reassignment(leadId, userId) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.patch(`/leads/${leadId}/reassignment/${userId}`, {}, { headers });
    },

    multi_select(data) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.patch('/leads/muti-select/update-promotor', data, { headers });
    },

    comments(data) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.post('/comments', data, { headers });
    },

    // Leads que le fueron asignados a un promotor
    leads_promoter(id, page = 1) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.get(`/leads/get-by-user/${id}`, { 
            params: {
                paginated: true,
                'per-page': 60,
                page,
            },
            headers
        });
    },

    // Función para obtener las opciones de filtros disponibles
    getFilterOptions(filter) {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        return api.get(`/leads/filters/${filter}`, { headers });
    },

    getFilteredLeads(params) {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
      
        // Enviar únicamente los filtros
        return api.get("/leads/filtered", { params, headers });
      },
      
      getFilteredLeadsByUser(params) {
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
        };
    
        return api.get(`/leads/get-by-user`, { params, headers });
    },

    getSearchByPhoneOrName(query) {
    if (!query || query.trim() === "") {
        console.warn("Query vacío. No se envía la búsqueda.");
        return Promise.resolve(); // o lanza un error personalizado si prefieres
    }

    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    return api.get(`/leads/search-by-phone-or-name`, {
        params: { query },
        headers,
    });
},

getSearchByPhoneOrNameForUser(query) {
    if (!query || query.trim() === "") {
        console.warn("Query vacío. No se envía la búsqueda.");
        return Promise.resolve();
    }

    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    return api.get(`/leads/search-my-leads`, {
        params: { query },
        headers,
    });
}

};
