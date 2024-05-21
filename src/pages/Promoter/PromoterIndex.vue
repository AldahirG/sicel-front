<template>
  <DashboardLayout :breadcrumbs="bread">
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">

      <!-- Gráfica Total por Status -->
      <div v-if="totalPorStatusDataProm" class="chart-container">
        <h2>Total por Status</h2>

        <ChartComponent 
          :chartType="'doughnut'" 
          :chartData="totalPorStatusDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por % de Beca -->
      <div v-if="totalPorBecaDataProm" class="chart-container">
        <h2>Total por % de Beca</h2>

        <ChartComponent 
          :chartType="'doughnut'" 
          :chartData="totalPorBecaDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por País -->
      <div v-if="totalPorPaisDataProm">
        <h2>Total por País</h2>

        <ChartComponent 
          :chartType="'bar'" 
          :chartData="totalPorPaisDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por Estado -->
      <div v-if="totalPorEstadoDataProm">
        <h2>Total por Estado</h2>

        <ChartComponent 
          :chartType="'bar'" 
          :chartData="totalPorEstadoDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por Municipio -->
      <div v-if="totalPorMunicipioDataProm">
        <h2>Total por Municipio</h2>

        <ChartComponent 
          :chartType="'bar'" 
          :chartData="totalPorMunicipioDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total de Inscripciones por Promotor -->
      <div v-if="totalInscripcionesPromotorDataProm">
        <h2>Total de Inscripciones por Promotor</h2>

        <ChartComponent 
          :chartType="'bar'" 
          :chartData="totalInscripcionesPromotorDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por Programa -->
      <div v-if="totalPorProgramaDataProm" class="chart-container">
        <h2>Total por Programa</h2>

        <ChartComponent 
          :chartType="'pie'" 
          :chartData="totalPorProgramaDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por Tipo de Referencia -->
      <div v-if="totalReferenciaDataProm" class="chart-container">
        <h2>Total por Tipo de Referencia</h2>

        <ChartComponent 
          :chartType="'doughnut'" 
          :chartData="totalReferenciaDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total por Semestre de Admisión -->
      <div v-if="totalSemestreAdmisionDataProm">
        <h2>Total por Semestre de Admisión</h2>

        <ChartComponent 
          :chartType="'bar'" 
          :chartData="totalSemestreAdmisionDataProm" 
          :chartOptions="{}" 
        />
      </div>


      <!-- Gráfica Total de Inscripciones por Edad -->
      <div v-if="totalInscripcionesPorEdadDataProm">
        <h2>Total de Inscripciones por Edad</h2>

        <ChartComponent 
          :chartType="'line'" 
          :chartData="totalInscripcionesPorEdadDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total de Inscripciones por Año -->
      <div v-if="totalInscripcionePorAñoDataProm" class="chart-container">
        <h2>Total de Inscripciones por Año</h2>

        <ChartComponent 
          :chartType="'pie'" 
          :chartData="totalInscripcionePorAñoDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Gráfica Total de Inscripciones por Mes -->
      <div v-if="totalInscripcionesPorMesDataProm">
        <h2>Total de Inscripciones por Mes</h2>

        <ChartComponent 
          :chartType="'line'" 
          :chartData="totalInscripcionesPorMesDataProm" 
          :chartOptions="{}" 
        />
      </div>

      <!-- Otras gráficas... -->

    </section>
  </DashboardLayout>
</template>


<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ChartComponent from '../../components/ChartComponent.vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import { getId } from '../../routes/auth';

export default {
  components: {
    ChartComponent,
    DashboardLayout
  },
  data() {
    return {
      // Paths for breadcrumbs
      bread: [
          { label: "Dashboard", name: 'promoter' },
      ]
    };
  },
  setup() {
    const totalPorStatusDataProm = ref(null);
    // const totalPorCicloData = ref(null);
    const totalPorBecaDataProm = ref(null);
    const totalPorPaisDataProm = ref(null);
    const totalPorEstadoDataProm = ref(null);
    const totalPorMunicipioDataProm = ref(null);
    const totalInscripcionesPromotorDataProm = ref(null);
    const totalPorProgramaDataProm = ref(null);
    const totalReferenciaDataProm = ref(null);
    const totalSemestreAdmisionDataProm = ref(null);
    const totalInscripcionesPorEdadDataProm = ref(null);
    const totalInscripcionePorAñoDataProm = ref(null);
    const totalInscripcionesPorMesDataProm = ref(null);

    onMounted(async () => {
      try {
        // Obtener el userId del usuario logeado
        const userId = await getId();
        const totalPorStatusResponse = await axios.get(`http://localhost:3000/api/total-status/${userId}`);
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

        totalPorStatusDataProm.value = totalPorStatusChartData;

        // const totalPorCicloResponse = await axios.get('http://localhost:3000/api/total-ciclo');
        // const leadsPorCiclo = totalPorCicloResponse.data;

        // const labelsCiclo = leadsPorCiclo.map(item => item.cycle);
        // const dataCiclo = leadsPorCiclo.map(item => item._count.id);

        // const totalPorCicloChartData = {
        //   labels: labelsCiclo,
        //   datasets: [
        //     {
        //       label: 'Cantidad de Leads',
        //       backgroundColor: 'blue',
        //       data: dataCiclo,
        //     }
        //   ]
        // };

        // totalPorCicloData.value = totalPorCicloChartData;

        const totalPorBecaResponse = await axios.get(`http://localhost:3000/api/porcentaje-beca/${userId}`);
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

        totalPorBecaDataProm.value = totalPorBecaChartData;

        const totalPorPaisResponse = await axios.get(`http://localhost:3000/api/total-pais/${userId}`);
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

        totalPorPaisDataProm.value = totalPorPaisChartData;

        const totalPorEstadoResponse = await axios.get(`http://localhost:3000/api/total-estado/${userId}`);
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

        totalPorEstadoDataProm.value = totalPorEstadoChartData;

        const totalPorMunicipioResponse = await axios.get(`http://localhost:3000/api/total-municipio/${userId}`);
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

        totalPorMunicipioDataProm.value = totalPorMunicipioChartData;

        const totalInscripcionesPromotorResponse = await axios.get(`http://localhost:3000/api/total-inscripciones-promotor/${userId}`);
        const inscripcionesPromotor = totalInscripcionesPromotorResponse.data;

        let labelsPromotor = [];
        let dataPromotor = [];

        // Verificar si inscripcionesPromotor es un array
        if (Array.isArray(inscripcionesPromotor)) {
          // Si es un array, mapear los datos
          labelsPromotor = inscripcionesPromotor.map(item => item.name);
          dataPromotor = inscripcionesPromotor.map(item => item.totalInscripciones);
        } else {
          // Si no es un array, asumir que es un solo objeto y agregar sus datos
          labelsPromotor.push(inscripcionesPromotor.name);
          dataPromotor.push(inscripcionesPromotor.totalInscripciones);
        }

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

        totalInscripcionesPromotorDataProm.value = totalInscripcionesPromotorChartData;


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

        totalPorProgramaDataProm.value = totalPorProgramaChartData;


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

        totalReferenciaDataProm.value = totalReferenciaChartData;

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

        totalSemestreAdmisionDataProm.value = totalSemestreAdmisionChartData;

        const totalInscripcionesPorEdadResponse = await axios.get('http://localhost:3000/api/age');
        const inscripcionesPorEdad = totalInscripcionesPorEdadResponse.data;

        const labelsEdadInscripciones = inscripcionesPorEdad.map(item => item.age);
        const dataEdadInscripciones = inscripcionesPorEdad.map(item => item._count.id);

        const totalInscripcionesPorEdadChartData = {
          labels: labelsEdadInscripciones,
          datasets: [
            {
              label: 'Cantidad de Inscripciones',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataEdadInscripciones,
            }
          ]
        };

        totalInscripcionesPorEdadDataProm.value = totalInscripcionesPorEdadChartData;


        const response = await axios.get('http://localhost:3000/api/inscripciones-por-anio');
        const inscripcionesPorAño = response.data;

        const labelsAñoInscripciones = inscripcionesPorAño.map(item => item.year);
        const dataAñoInscripciones = inscripcionesPorAño.map(item => item.count);

        const totalInscripcionesPorAñoChartData = {
          labels: labelsAñoInscripciones,
          datasets: [
            {
              label: 'Cantidad de Inscripciones',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataAñoInscripciones,
            }
          ]
        };

        totalInscripcionePorAñoDataProm.value = totalInscripcionesPorAñoChartData;


        const totalInscripcionesPorMesResponse = await axios.get('http://localhost:3000/api/inscripciones-por-mes');
        const inscripcionesPorMes = totalInscripcionesPorMesResponse.data;

        const labelsMesInscripciones = inscripcionesPorMes.map(item => item.month);
        const dataMesInscripciones = inscripcionesPorMes.map(item => item.count);

        const totalInscripcionesPorMesChartData = {
          labels: labelsMesInscripciones,
          datasets: [
            {
              label: 'Cantidad de Inscripciones',
              backgroundColor: ['#004662', '#00A0DE', '#CCCDCD', '#F2F2F2'],
              data: dataMesInscripciones,
            }
          ]
        };

        totalInscripcionesPorMesDataProm.value = totalInscripcionesPorMesChartData;

      } catch (error) {
        console.error('Error al obtener los datos para las gráficas:', error);
      }
    });

    return {
      totalPorStatusDataProm,
      // totalPorCicloData,
      totalPorBecaDataProm,
      totalPorPaisDataProm,
      totalPorEstadoDataProm,
      totalPorMunicipioDataProm,
      totalInscripcionesPromotorDataProm,
      totalPorProgramaDataProm,
      totalReferenciaDataProm,
      totalSemestreAdmisionDataProm,
      totalInscripcionesPorEdadDataProm,
      totalInscripcionePorAñoDataProm,
      totalInscripcionesPorMesDataProm



    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 230px;
  height: 300px;
}
</style>