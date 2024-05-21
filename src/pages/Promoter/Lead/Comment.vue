<template>
  <DashboardLayout :breadcrumbs="bread">
    <section class="flex justify-center items-center h-full mx-auto max-w-sm md:max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

        <!-- Sección de agregar comentario -->
        <section class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 class="text-gray-950 dark:text-white text-lg font-semibold mb-4">Agregar comentario</h2>
          <!-- Aquí puedes agregar los campos y botones para agregar un nuevo comentario -->
          <form @submit.prevent="addComment">
            <div class="mb-4">
              <label 
                for="new-comment" 
                class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
              >
                Nuevo comentario
              </label>

              <textarea 
                id="new-comment" 
                v-model="newComment" rows="4"
                class="textarea textarea-bordered w-full" 
                placeholder="Agrega un comentario"
                required
              >
              </textarea>
            </div>

            <div class="flex justify-end">
              <button 
                type="submit"
                class="inline-block py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md duration-200"
              >
                Crear comentario
              </button>
            </div>
          </form>
        </section>

        <!-- Sección de comentarios existentes -->
        <section class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 class="text-gray-950 dark:text-white text-lg font-semibold mb-4">Comentarios anteriores</h2>

          <div class="overflow-x-auto overflow-y-auto h-56">
            <table class="table table-xs">
              <thead>
                <tr>
                  <th>ID</th> 
                  <th>Comentario</th> 
                  <th>Fecha</th> 
                </tr>
              </thead> 
              <tbody v-for="comment in comments" :key="comment.id">
                <tr>
                  <th>{{ comment.id }}</th> 
                  <td class="w-72 text-pretty">{{ comment.comment }}</td> 
                  <td class="capitalize">{{ formatDate(comment.date_contact) }}</td>
                </tr>
              </tbody> 
            </table>
          </div>

        </section>
      </div>
    </section>
  </DashboardLayout>
</template>

<script>
import axios from 'axios';
import DashboardLayout from '../../../layouts/DashboardLayout.vue';

// URL de API
const url = import.meta.env.VITE_API_URL;

export default {
  components: {
    DashboardLayout
  },
  data() {
    return {
      comments: [],
      newComment: '',
      leadId: null, // Aquí almacenaremos el ID del lead

      // Paths for breadcrumbs
      bread: [
        { label: "Dashboard", name: 'promoter' },
        { label: "Leads", name: 'promoter/leads' },
        { label: "Comentarios", name: "commentsLeadPromotor" },

      ]
    };
  },
  methods: {
    async getLead(id) {
      try {
        const res = await axios.get(`${url}/lead/${id}`);
        this.lead = res.data;
        this.leadId = id;
      } catch (error) {
        console.error('Error fetching lead:', error);
      }
    },

    async fetchComments() {
      const id = this.$route.params.id; // Obtener el ID del lead de la ruta
      try {
        // Verificar si leadId no es null o undefined antes de hacer la solicitud
        if (!this.leadId) {
          const response = await axios.get(`${url}/admin/lead/${id}/comments`);
          this.comments = response.data;
        } else {
          console.error('El ID del lead no está definido.');
        }
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    },

    async addComment() {
      try {
        // Hacer la solicitud para agregar el nuevo comentario a la base de datos
        const response = await axios.post(`${url}/lead/${this.leadId}/comment`, { // Usar this.leadId
          comment: this.newComment
        });
        
        // Agregar el nuevo comentario a la lista de comentarios
        this.comments.push(response.data);
        // Limpiar el campo de texto del nuevo comentario
        this.newComment = '';
      } catch (error) {
        console.error('Error al agregar el comentario:', error);
      }
    },

  },

  computed: {
    formatDate() {
      return (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
      };
    }
  },

  mounted() {
    const id = this.$route.params.id;
    this.getLead(id);
    this.fetchComments();
  }
};
</script>
