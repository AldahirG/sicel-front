<template>
  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 ">
      <!-- Gráfica Total por Status -->
      <div class="chart-wrapper" >
        <h2>Total por Status</h2>

        <div v-if="totalPorStatusData" class="chart-container ">
          <ChartComponent 
          :chartType="'pie'" 
          :chartData="totalPorStatusData" 
          :chartOptions="{}" 
          />
        </div>
      </div>

      <!-- Gráfica Total por Ciclo -->
      <div class="chart-wrapper" >
        <h2>Total por Ciclo</h2>

        <div v-if="totalPorCicloData" class="chart-container ">
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalPorCicloData" 
            :chartOptions="{}" 
          />
        </div>
    </div>


      <!-- Gráfica Total por % de Beca -->
      <div class="chart-wrapper" >
        <h2>Total por % de Beca</h2>

        <div v-if="totalPorBecaData" class="chart-container">
          <ChartComponent 
            :chartType="'doughnut'" 
            :chartData="totalPorBecaData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total de inscripcion por Promotor -->
      <div class="chart-wrapper" >
        <h2>Inscripciones por Promotor</h2>

        <div v-if="totalInscripcionesPromotorData" class="chart-container">
          <ChartComponent 
            :chartType="'line'" 
            :chartData="totalInscripcionesPromotorData" 
            :chartOptions="{}" 
          />
      </div>
    </div>
      
      <!-- Gráfica Total por País -->
      <div class="chart-wrapper" >
        <h2>Total por País</h2>

        <div v-if="totalPorPaisData" class="chart-container">
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalPorPaisData" 
            :chartOptions="{}" 
          />
        </div>
    </div>
      <!-- Gráfica Total por Estado -->
      <div class="chart-wrapper" >
        <h2>Total por Estado</h2>

        <div v-if="totalPorEstadoData" class="chart-container">
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalPorEstadoData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total por Municipio -->
      <div class="chart-wrapper" >
        <h2>Total por Municipio</h2>

        <div v-if="totalPorMunicipioData" class="chart-container">
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalPorMunicipioData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total por Programa -->
      <div class="chart-wrapper" >
        <h2>Total por Programa</h2>

        <div v-if="totalPorProgramaData" class="chart-container">
          <ChartComponent 
            :chartType="'pie'" 
            :chartData="totalPorProgramaData" 
            :chartOptions="{}" 
          />
        </div>
    </div>
      <!-- Gráfica Total por Tipo de Referencia -->
      <div class="chart-wrapper" >
        <h2>Total por Tipo de Referencia</h2>

        <div v-if="totalReferenciaData" class="chart-container">
          <ChartComponent 
            :chartType="'doughnut'" 
            :chartData="totalReferenciaData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total por Semestre de Admisión -->
      <div class="chart-wrapper" >
        <h2>Total por Semestre de Admisión</h2>

        <div v-if="totalSemestreAdmisionData" class="chart-container">
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalSemestreAdmisionData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total de Inscripciones por Edad -->
      <div class="chart-wrapper" >
        <h2>Total de Inscripciones por Edad</h2>

        <div v-if="totalInscripcionesPorEdadData" class="chart-container">
          <ChartComponent 
            :chartType="'line'" 
            :chartData="totalInscripcionesPorEdadData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

    
    <!-- Gráfica Total de Inscripciones por Año -->
    <div class="chart-wrapper" >
      <h2>Total de Inscripciones por Año</h2>

      <div v-if="totalInscripcionePorAñoData" class="chart-container">
          <ChartComponent 
            :chartType="'pie'" 
            :chartData="totalInscripcionePorAñoData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

    
    <!-- Gráfica Total de Inscripciones por Mes -->
    <div class="chart-wrapper" >
      <h2>Total de Inscripciones por Mes</h2>

      <div v-if="totalInscripcionesPorMesData" class="chart-container">
          <ChartComponent 
            :chartType="'line'" 
            :chartData="totalInscripcionesPorMesData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total por Tipo de Escuela -->
      <div class="chart-wrapper" >
        <h2>Total por Tipo de Escuela</h2>

        <div v-if="totalTipoEscuela" class="chart-container"  >
          <ChartComponent 
            :chartType="'doughnut'" 
            :chartData="totalTipoEscuela" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      
    <!-- Gráfica Total por Medio de Contacto -->
    <div class="chart-wrapper" >
      <h2>Total por Medio de Contacto</h2>

      <div v-if="totalMedioContactoData" class="chart-container" >
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalMedioContactoData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Gráfica Total por Donde Obtuvo Datos -->
      <div class="chart-wrapper" >
        <h2>¿Dónde Obtuvo el Dato?</h2>

        <div v-if="totalDondeObtuvoDatosData" class="chart-container">
          <ChartComponent 
            :chartType="'bar'" 
            :chartData="totalDondeObtuvoDatosData" 
            :chartOptions="{}" 
          />
        </div>
    </div>

      <!-- Otras gráficas... -->
    </section>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ChartComponent from '../../components/ChartComponent.vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';

export default {
  components: {
    ChartComponent,
    DashboardLayout
  },

  methods: {
    async filterLeads() {
      try {
        const response = await axios.get('http://localhost:3000/api/leads-filtrados', {
          params: this.filters
        });
        // Actualizar los datos de las gráficas con los resultados filtrados
        this.totalPorStatusData = response.data;
      } catch (error) {
        console.error('Error al filtrar los leads:', error);
      }
    },
    
    // Otros métodos del componente
  },

  data() {
    return {
      // Paths for breadcrumbs
      bread: [
          { label: "Dashboard", name: 'admin' },
      ],
      filters: {
        country: '',
        enrollmentStatus: '',
        userId: ''
      },
      totalPorStatusData: null,
      totalPorCicloData: null,
      totalPorBecaData: null,
      totalPorPaisData: null,
      totalPorEstadoData: null,
      totalPorMunicipioData: null,
      totalInscripcionesPromotorData: null,
      totalPorProgramaData: null,
      totalReferenciaData: null,
      totalSemestreAdmisionData: null,
      totalInscripcionesPorEdadData: null,
      totalInscripcionePorAñoData: null,
      totalInscripcionesPorMesData: null,
      totalTipoEscuela: null,
      totalMedioContacto: null,
      totalDondeObtuvoDatos: null,
    };
  },
  setup() {
    const totalPorStatusData = ref(null);
    const totalPorCicloData = ref(null);
    const totalPorBecaData = ref(null);
    const totalPorPaisData = ref(null);
    const totalPorEstadoData = ref(null);
    const totalPorMunicipioData = ref(null);
    const totalInscripcionesPromotorData = ref(null);
    const totalPorProgramaData = ref(null);
    const totalReferenciaData = ref(null);
    const totalSemestreAdmisionData = ref(null);
    const totalInscripcionesPorEdadData = ref(null);
    const totalInscripcionePorAñoData = ref(null);
    const totalInscripcionesPorMesData = ref(null);
    const totalTipoEscuela = ref(null);
    const totalMedioContactoData = ref(null);
    const totalDondeObtuvoDatosData = ref(null);

    onMounted(async () => {
      try {
        const totalPorStatusResponse = await axios.get('http://localhost:3000/api/total-status');
        console.log(totalPorStatusResponse)
        const leadsPorStatus = totalPorStatusResponse.data;

        const labels = leadsPorStatus.map(item => item.enrollmentStatus);
        const data = leadsPorStatus.map(item => item._count.id);


        const totalPorStatusChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: data,
            }
          ],

          toolbar: {
            show: true

          }
        };

        totalPorStatusData.value = totalPorStatusChartData;

// Obtener los datos de recuento de leads por ciclo escolar
const totalPorCicloResponse = await axios.get('http://localhost:3000/api/recuento-leads-por-schoolYear');
const leadsPorCiclo = totalPorCicloResponse.data;

// Obtener los nombres de los ciclos escolares
const labelsCiclo = leadsPorCiclo.map(item => item.schoolYear);

// Obtener el recuento de leads por ciclo escolar
const dataCiclo = leadsPorCiclo.map(item => item.count);

// Configurar los datos para el gráfico
const totalPorCicloChartData = {
  labels: labelsCiclo,
  datasets: [
    {
      label: 'Cantidad de Leads',
      backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'], // Colores de fondo para cada barra
      data: dataCiclo, // Datos de recuento de leads por ciclo escolar
    }
  ]
};

// Asignar los datos del gráfico al objeto totalPorCicloData
totalPorCicloData.value = totalPorCicloChartData;



        const totalPorBecaResponse = await axios.get('http://localhost:3000/api/porcentaje-beca'); 
        console.log(totalPorBecaResponse)
        const leadsPorBeca = totalPorBecaResponse.data;

        const labelsBeca = leadsPorBeca.map(item => item.scholarship);
        const dataBeca = leadsPorBeca.map(item => item._count.id);

        const totalPorBecaChartData = {
          labels: labelsBeca,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#CCCDCD', '#00A0DE', '#F29F05'],
              data: dataBeca,
            }
          ]
        };

        totalPorBecaData.value = totalPorBecaChartData;

        const totalPorPaisResponse = await axios.get('http://localhost:3000/api/total-pais');
        const leadsPorPais = totalPorPaisResponse.data;

        const labelsPais = leadsPorPais.map(item => item.country);
        const dataPais = leadsPorPais.map(item => item._count.id);

        const totalPorPaisChartData = {
          labels: labelsPais,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataPais,
            }
          ]
        };

        totalPorPaisData.value = totalPorPaisChartData;

        const totalPorEstadoResponse = await axios.get('http://localhost:3000/api/total-estado');
        const leadsPorEstado = totalPorEstadoResponse.data;

        const labelsEstado = leadsPorEstado.map(item => item.state);
        const dataEstado = leadsPorEstado.map(item => item._count.id);

        const totalPorEstadoChartData = {
          labels: labelsEstado,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataEstado,
            }
          ]
        };

        totalPorEstadoData.value = totalPorEstadoChartData;

        const totalPorMunicipioResponse = await axios.get('http://localhost:3000/api/total-municipio');
        const leadsPorMunicipio = totalPorMunicipioResponse.data;

        const labelsMunicipio = leadsPorMunicipio.map(item => item.city);
        const dataMunicipio = leadsPorMunicipio.map(item => item._count.id);

        const totalPorMunicipioChartData = {
          labels: labelsMunicipio,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataMunicipio,
            }
          ]
        };

        totalPorMunicipioData.value = totalPorMunicipioChartData;

        const totalInscripcionesPromotorResponse = await axios.get('http://localhost:3000/api/total-inscripciones-por-promotor');
        const inscripcionesPromotor = totalInscripcionesPromotorResponse.data;

        const labelsPromotor = inscripcionesPromotor.map(item => item.name);
        const dataPromotor = inscripcionesPromotor.map(item => item.totalInscripciones);

        const totalInscripcionesPromotorChartData = {
          labels: labelsPromotor,
          datasets: [
            {
              label: 'Cantidad de Inscripciones',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataPromotor,
            }
          ]
        };

        totalInscripcionesPromotorData.value = totalInscripcionesPromotorChartData;



        const totalPorProgramaResponse = await axios.get('http://localhost:3000/api/programa');
        const leadsPorPrograma = totalPorProgramaResponse.data;

        const labelsPrograma = leadsPorPrograma.map(item => item.programa); // Utilizamos item.programa en lugar de item.program
        const dataPrograma = leadsPorPrograma.map(item => item._count.id);

        const totalPorProgramaChartData = {
          labels: labelsPrograma,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataPrograma,
            }
          ]
        };

        totalPorProgramaData.value = totalPorProgramaChartData;


        const totalReferenciaResponse = await axios.get('http://localhost:3000/api/reference-type');
        const leadsPorReferencia = totalReferenciaResponse.data;

        const labelsReferencia = leadsPorReferencia.map(item => item.referenceType);
        const dataReferencia = leadsPorReferencia.map(item => item._count.id);

        const totalReferenciaChartData = {
          labels: labelsReferencia,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataReferencia,
            }
          ]
        };

        totalReferenciaData.value = totalReferenciaChartData;

        const totalSemestreAdmisionResponse = await axios.get('http://localhost:3000/api/admission-semester');
        const leadsPorSemestreAdmision = totalSemestreAdmisionResponse.data;

        const labelsSemestreAdmision = leadsPorSemestreAdmision.map(item => item.admissionSemester);
        const dataSemestreAdmision = leadsPorSemestreAdmision.map(item => item._count.id);

        const totalSemestreAdmisionChartData = {
          labels: labelsSemestreAdmision,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataSemestreAdmision,
            }
          ]
        };

        totalSemestreAdmisionData.value = totalSemestreAdmisionChartData;

        // const totalInscripcionesPorEdadResponse = await axios.get('http://localhost:3000/api/age');
        // const inscripcionesPorEdad = totalInscripcionesPorEdadResponse.data;

        // const labelsEdadInscripciones = inscripcionesPorEdad.map(item => item.age);
        // const dataEdadInscripciones = inscripcionesPorEdad.map(item => item._count.id);

        // const totalInscripcionesPorEdadChartData = {
        //   labels: labelsEdadInscripciones,
        //   datasets: [
        //     {
        //       label: 'Cantidad de Inscripciones',
        //       backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
        //       data: dataEdadInscripciones,
        //     }
        //   ]
        // };

        // totalInscripcionesPorEdadData.value = totalInscripcionesPorEdadChartData;


        // const response = await axios.get('http://localhost:3000/api/inscripciones-por-anio');
        // const inscripcionesPorAño = response.data;

        // const labelsAñoInscripciones = inscripcionesPorAño.map(item => item.year);
        // const dataAñoInscripciones = inscripcionesPorAño.map(item => item.count);

        // const totalInscripcionesPorAñoChartData = {
        //   labels: labelsAñoInscripciones,
        //   datasets: [
        //     {
        //       label: 'Cantidad de Inscripciones',
        //       backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
        //       data: dataAñoInscripciones,
        //     }
        //   ]
        // };

        // totalInscripcionePorAñoData.value = totalInscripcionesPorAñoChartData;


        // const totalInscripcionesPorMesResponse = await axios.get('http://localhost:3000/api/inscripciones-por-mes');
        // const inscripcionesPorMes = totalInscripcionesPorMesResponse.data;

        // const labelsMesInscripciones = inscripcionesPorMes.map(item => item.month);
        // const dataMesInscripciones = inscripcionesPorMes.map(item => item.count);

        // const totalInscripcionesPorMesChartData = {
        //   labels: labelsMesInscripciones,
        //   datasets: [
        //     {
        //       label: 'Cantidad de Inscripciones',
        //       backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
        //       data: dataMesInscripciones,
        //     }
        //   ]
        // };

        // totalInscripcionesPorMesData.value = totalInscripcionesPorMesChartData;


        const totalTipoEscuelaResponse = await axios.get('http://localhost:3000/api/recuento-leads-por-typeSchool');
        const leadsPorTipoEscuela = totalTipoEscuelaResponse.data;

        const labelsTipoEscuela = leadsPorTipoEscuela.map(item => item.typeSchool);
        const dataTipoEscuela = leadsPorTipoEscuela.map(item => item._count.id);

        const totalTipoEscuelaChartData = {
          labels: labelsTipoEscuela,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataTipoEscuela,
            }
          ]
        };

        totalTipoEscuela.value = totalTipoEscuelaChartData;

        // Obtener los datos de recuento de leads por medio de contacto
        const totalMedioContactoResponse = await axios.get('http://localhost:3000/api/recuento-leads-por-contactMedium');
        const leadsPorMedioContacto = totalMedioContactoResponse.data;

        // Obtener los nombres de los medios de contacto
        const labelsMedioContacto = leadsPorMedioContacto.map(item => item.contactMediumType);

        // Obtener el recuento de leads por medio de contacto
        const dataMedioContacto = leadsPorMedioContacto.map(item => item.count);

        // Configurar los datos para el gráfico
        const totalMedioContactoChartData = {
          labels: labelsMedioContacto,
          datasets: [
            {
              label: 'Cantidad de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'], // Colores de fondo para cada barra
              data: dataMedioContacto, // Datos de recuento de leads por medio de contacto
            }
          ]
        };

        // Asignar los datos del gráfico al objeto totalMedioContactoData
        totalMedioContactoData.value = totalMedioContactoChartData;

        // Consumir el endpoint para obtener el recuento de leads por fuente de datos
        const totalDondeObtuvoDatosResponse = await axios.get('http://localhost:3000/api/recuento-leads-por-dataSource');
        const recuentoLeadsPorDataSource = totalDondeObtuvoDatosResponse.data;
              
        // Extraer las categorías de fuente de datos y los recuentos de leads
        const labelsDondeObtuvoDatos = recuentoLeadsPorDataSource.map(item => item.dataSource);
        const dataRecuentosLeads = recuentoLeadsPorDataSource.map(item => item._count.id);
              
        // Configurar los datos para el gráfico
        const totalDondeObtuvoDatosChartData = {
          labels: labelsDondeObtuvoDatos,
          datasets: [
            {
              label: 'Recuento de Leads',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'], // Colores de fondo para cada barra
              data: dataRecuentosLeads, // Datos de recuento de leads por fuente de datos
            }
          ]
        };
        
        // Asignar los datos del gráfico al objeto totalDondeObtuvoDatosData
        totalDondeObtuvoDatosData.value = totalDondeObtuvoDatosChartData;


        

      } catch (error) {
        console.error('Error al obtener los datos para las gráficas:', error);
      }
    });

    const handleSubmit = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/leads-filtrados', {
          params: this.filters
        });
        console.log('params');
        console.log(this.filters);

        // Actualizar los datos de las gráficas con los resultados filtrados
        totalPorStatusData.value = response.data;
        console.log('data filtered');
        console.log(totalPorStatusData);

      } catch (error) {
        console.error('Error al filtrar los leads:', error);
      }
    };

    return {
      totalPorStatusData,
      totalPorCicloData,
      totalPorBecaData,
      totalPorPaisData,
      totalPorEstadoData,
      totalPorMunicipioData,
      totalInscripcionesPromotorData,
      totalPorProgramaData,
      totalReferenciaData,
      totalSemestreAdmisionData,
      totalInscripcionesPorEdadData,
      totalInscripcionePorAñoData,
      totalInscripcionesPorMesData,
      handleSubmit,
      totalTipoEscuela,
      totalMedioContactoData,
      totalDondeObtuvoDatosData
    };
  }
};
</script>


<style scoped>

.chart-wrapper {
    text-align: center; /* Centra el texto horizontalmente */
    margin-bottom: 20px; /* Espacio inferior para separar las gráficas */

}

.chart-wrapper h2 {
    margin-bottom: 1px; /* Espacio entre el título y la gráfica */
    font-size: 1.5rem; /* Tamaño de letra del título */
    font-weight: bold; /* Texto en negritas */
    color: #004662; /* Color del texto */
}

.chart-container {
    border-radius: 10px; /* Radio de borde para darle forma redondeada */
    box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1); /* Sombreado */
    padding: 30px; /* Espacio interno para separar el contenido del borde */
    margin-bottom: 10px; /* Espacio inferior para separar las gráficas */
    height: 300px; /* Altura fija para todas las gráficas */
    width: 100%;
    display: flex;
    justify-content: center; /* Centra horizontalmente */
    align-items: center; /* Centra verticalmente */
  
}


.button {
  background-color: #004662;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.label {
  font-size: 1.2rem;
  font-weight: bold;
}
.input {
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>