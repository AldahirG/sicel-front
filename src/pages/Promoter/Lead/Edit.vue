<script setup>
import Swal from "sweetalert2";
import { inject, onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import enrollment from "../../../services/enrollment.service";
import lead from "../../../services/lead.service";
import { LeadResource } from "../../Admin/Lead/mapper/lead.mapper";
import asetName from "../../../services/asetName.service";
import campaign from "../../../services/campaign.service";
import career from "../../../services/career.service";
import channel from "../../../services/channel.service";
import city from "../../../services/city.service";
import cycle from "../../../services/cycle.service";
import followUp from "../../../services/followUp.service";
import grade from "../../../services/grade.service";
import list from "../../../services/list.service";
import promotion from "../../../services/promotion.service";

import FormContainer from "../../../components/FormContainer.vue";
import FormRow from "../../../components/FormRow.vue";
import InputGroup from "../../../components/InputGroup.vue";

const toast = inject("toast");
const route = useRoute();
const router = useRouter();
const { id } = route.params;

const followUps = ref([]);
const grades = ref([]);
const asetNames = ref([]);
const campaigns = ref([]);
const cities = ref([]);
const cycles = ref([]);
const lists = ref([]);
const channels = ref([]);
const careers = ref([]);
const promotions = ref([]);
const enrollmentData = ref(null);
const isLoadingEnrollment = ref(false);
const isSaving = ref(false);

// Objeto base para resetear el formulario de inscripción
const baseEnrollmentForm = {
    programa: "",
    estrategia: "",
    canalVenta: "",
    numeroLista: "",
    matricula: "",
    beca: "",
    curp: "",
};

const form = ref({
    enrollmentStatus: "",
    showAdditionalFields: false,
    showNameReferenceField: false,
    showNameReferenceSelect: false,
    ...baseEnrollmentForm, // Inicializa con campos de inscripción vacíos
});

const personalUninterList = [
    "ADRIAN MOLINA", "ALEJANDRA RIVAS", "ALDAHIR GOMEZ", "ANALIT ROMAN ARCE", "ANGELICA NIETO",
    "AXEL ESPINOSA", "BETSABE FLORES", "BRYAN MURGA", "CESAR SANTA OLALLA", "CLAUDIA GALAN",
    "EMMA ARRIAGA", "ISIS CORTES", "JAVIER DE JESUS", "JAVIER ESPINOSA", "JESUS GUZMAN",
    "JESUS TRILLO", "JORGE NARVAEZ", "JOSE JAVIER DEL CASTILLO", "KEREN GOMEZ", "MARIAN SALGADO",
    "MARCO SALGADO", "MELYSSA MONROY", "RAUL CASTILLEJA", "THALIA SANCHEZ", "XIMENA MARTINEZ",
    "YOALI APARICIO", "YANIN VAZQUEZ", "NINGUNO DE LOS ANTERIORES",
];

const isFormDisabled = computed(() => {
    return enrollmentData.value !== null || isLoadingEnrollment.value;
});

const handleSubmit = async (form) => {
    try {
        const mapper = LeadResource(form);
        const { data } = await lead.update(id, mapper);

        toast.open({ message: data.http.message, type: "success" });
        router.push({ name: "promoter/leads" });
    } catch (error) {
        toast.open({ message: error.response.data.message, type: "error" });
    }
};

const fetchEnrollmentData = async () => {
    try {
        isLoadingEnrollment.value = true;
        const response = await enrollment.getByLeadId(route.params.id);

if (response && response.data && Array.isArray(response.data.data)) {
  // Buscar la inscripción que coincida con este leadId
  const matchingEnrollment = response.data.data.find(
    (enr) => enr.leadId === route.params.id
  );

  if (matchingEnrollment) {
    enrollmentData.value = matchingEnrollment;

    form.value.programa = matchingEnrollment.Career?.id || "";
    form.value.estrategia = matchingEnrollment.Promotion?.id || "";
    form.value.canalVenta = matchingEnrollment.Channel?.id || "";
    form.value.numeroLista = matchingEnrollment.List?.id || "";
    form.value.matricula = matchingEnrollment.enrollment_folio || "";
    form.value.beca = matchingEnrollment.scholarship || "";
    form.value.curp = matchingEnrollment.curp || "";
  } else {
    enrollmentData.value = null;
    Object.assign(form.value, baseEnrollmentForm);
  }
}

    } catch (error) {
        console.error('Error al obtener datos de inscripción:', error);
        toast.open({ message: 'Error al cargar los datos de inscripción.', type: 'error' });
        enrollmentData.value = null;
        Object.assign(form.value, baseEnrollmentForm); // En caso de error, también limpiar los campos
    } finally {
        isLoadingEnrollment.value = false;
    }
};

const normalizeAlpha = (value) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z_\s]/gi, "")
    .trim()
    .toUpperCase() || "";

    const normalizeAlphanumeric = (value) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/gi, "")  // Permite solo letras y números
    .trim()
    .toUpperCase() || "";

    const normalizeBeta = (value) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^A-Z0-9_]/gi, "") // Permitir solo letras (mayúsculas), números y guiones bajos
    .toUpperCase() || "";


watch(form, (val) => {
  form.value.name = normalizeAlpha(val.name);
  form.value.careerInterest = normalizeAlpha(val.careerInterest);
  form.value.formerSchool = normalizeBeta(val.formerSchool);
  form.value.comments = normalizeAlpha(val.comments);
  form.value.dataSource = normalizeAlpha(val.dataSource);

  form.value.matricula = normalizeAlphanumeric(val.matricula);
  form.value.folio = normalizeAlphanumeric(val.folio);
  form.value.curp = normalizeAlphanumeric(val.curp);
}, { deep: true });




const handleSaveAsEnrollment = async () => {
    if (isFormDisabled.value) {
        toast.open({ message: "Este prospecto ya ha sido inscrito.", type: "warning" });
        return;
    }

    isSaving.value = true;
    try {
        const { data: updatedLead } = await lead.update(
            id,
            LeadResource(form.value)
        );

       const enrollmentDataToSend = {
        leadId: id,
        careersId: form.value.programa,
        channelId: form.value.canalVenta,
        listId: form.value.numeroLista,
        promotionId: form.value.estrategia,
        enrollment_folio: form.value.folio, // ✅ aquí debe ir el folio
        matricula: form.value.matricula,     // ✅ aquí ahora sí se manda la matrícula
        scholarship: form.value.beca,
        curp: form.value.curp,
      };
      console.log("Payload a enviar:", enrollmentDataToSend);



        const { data: enrollmentCreated } = await enrollment.create(enrollmentDataToSend);

        toast.open({
            message: "Inscripción y lead actualizados correctamente.",
            type: "success",
        });

        // Forzar la recarga de datos para mostrar la nueva inscripción
        await fetchEnrollmentData();

        router.push({ name: "promoter/leads" });
    } catch (error) {
        const messages = error.response?.data?.message;
        const errorText = Array.isArray(messages)
            ? messages.join("\n")
            : messages || "Error desconocido";

        toast.error("🚨 Error en inscripción:\n" + errorText);
    } finally {
        isSaving.value = false;
    }
};

const addComment = () => {
    Swal.fire({
        title: "Crear comentario",
        html: '<textarea id="swal-textarea" class="swal2-textarea" placeholder="Escribe un comentario" rows="4" cols="30"></textarea>',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Enviar",
        preConfirm: () => {
            const description = document.getElementById("swal-textarea").value;
            if (!description) {
                Swal.showValidationMessage("Es necesario escribir un comentario");
            }
            return { description };
        },
    }).then(async (result) => {
        if (result.isConfirmed) {
            await lead.comments({
                description: result.value.description,
                leadId: id,
            });
            Swal.fire("Enviado!", "Comentario creado con éxito", "success");
            router.push({ name: "showLeadPromotor", params: { id } });
        }
    });
};

watch(
    () => form.value.followUpId,
    (newFollowUp) => {
        const followUpName = followUps.value.find(
            (f) => f.id === newFollowUp
        )?.name;
        form.value.showAdditionalFields = followUpName === "INSC-INSCRIPCIÓN";
        
        // Si el seguimiento cambia y NO es INSC-INSCRIPCIÓN, o si CAMBIA A INSC-INSCRIPCIÓN pero NO HAY INSCRIPCION PREVIA
        // Necesitamos asegurar que los campos de inscripción estén limpios si se van a usar para una nueva inscripción.
        if (followUpName === "INSC-INSCRIPCIÓN" && enrollmentData.value === null) {
            // Si el seguimiento es INSC pero NO HAY INSCRIPCIÓN previa, limpiar campos para nueva entrada
            Object.assign(form.value, baseEnrollmentForm);
        } else if (followUpName !== "INSC-INSCRIPCIÓN") {
            // Si el seguimiento NO es INSC, limpiar campos y data de inscripción
            Object.assign(form.value, baseEnrollmentForm);
            enrollmentData.value = null;
        }
    }
);

watch(
    () => form.value.type,
    (newType) => {
        form.value.showNameReferenceField = ["ALUMNO", "FAMILIAR_ALUMNO"].includes(
            newType
        );
        form.value.showNameReferenceSelect = newType === "PERSONAL_UNINTER";
        if (newType === "NINGUNO") {
            form.value.nameReference = "";
            form.value.dataSource = "";
        }
    }
);

// NUEVO WATCHER: Observa los cambios en el ID de la ruta
watch(
    () => route.params.id,
    async (newId, oldId) => {
        if (newId !== oldId) {
            // *** CRÍTICO: Resetear TODO el estado del formulario aquí ***
            // Vuelve a inicializar el formulario con sus valores por defecto
            form.value = {
                enrollmentStatus: "",
                showAdditionalFields: false,
                showNameReferenceField: false,
                showNameReferenceSelect: false,
                ...baseEnrollmentForm, // Asegura que los campos de inscripción estén limpios
            };
            enrollmentData.value = null; // Limpiar la data de inscripción anterior
            isLoadingEnrollment.value = false;
            isSaving.value = false;

            // Recargar todos los datos del lead y su posible inscripción para el nuevo ID
            await loadLeadAndEnrollmentData();
        }
    }
);

// Función para cargar todos los datos necesarios en onMounted y en el watcher
const loadLeadAndEnrollmentData = async () => {
  try {
    if (followUps.value.length === 0) followUps.value = (await followUp.getAll()).data.data.sort((a, b) => a.name.localeCompare(b.name));
    if (grades.value.length === 0) grades.value = (await grade.getAll()).data.data.sort((a, b) => a.name.localeCompare(b.name));
    if (asetNames.value.length === 0) asetNames.value = (await asetName.getAll()).data.data.sort((a, b) => {
      const aFull = `${a.contactType.name} - ${a.name}`;
      const bFull = `${b.contactType.name} - ${b.name}`;
      return aFull.localeCompare(bFull);
    });
    if (campaigns.value.length === 0) campaigns.value = (await campaign.getAll()).data.data.sort((a, b) => a.name.localeCompare(b.name));
    if (cities.value.length === 0) cities.value = (await city.getAll()).data.data.sort((a, b) => a.name.localeCompare(b.name));
    if (cycles.value.length === 0) cycles.value = (await cycle.getAll()).data.data.sort((a, b) => a.cycle.localeCompare(b.cycle));
    if (lists.value.length === 0) lists.value = (await list.getAll()).data.data.sort((a, b) => a.noLista.localeCompare(b.noLista));
    if (channels.value.length === 0) channels.value = (await channel.getAll()).data.data.sort((a, b) => a.name.localeCompare(b.name));
    if (careers.value.length === 0) careers.value = (await career.getAll()).data.data.sort((a, b) => a.program.localeCompare(b.program));
    if (promotions.value.length === 0) promotions.value = (await promotion.getAll()).data.data.sort((a, b) => a.name.localeCompare(b.name));

    const { data } = await lead.getById(route.params.id);
    const leadInfo = data.data;
    const followUpName = leadInfo?.information?.followUp?.name;

    form.value.name = leadInfo.information?.name;
    form.value.genre = leadInfo.information?.genre;
    form.value.enrollmentStatus = leadInfo.information?.enrollmentStatus;
    form.value.followUpId = leadInfo?.information?.followUp?.id;
    form.value.phone = leadInfo?.phones;
    form.value.email = leadInfo?.emails;
    form.value.careerInterest = leadInfo.information?.careerInterest;
    form.value.gradeId = leadInfo.grade?.id;
    form.value.scholarship = leadInfo?.scholarship;
    form.value.formerSchool = leadInfo.information?.formerSchool;
    form.value.typeSchool = leadInfo.information?.typeSchool;
    form.value.asetNameId = leadInfo.asetName?.id;
    form.value.campaignId = leadInfo.campaign?.id;
    form.value.city = leadInfo.address?.city;
    form.value.cycleId = leadInfo.cycle?.id;
    form.value.semester = leadInfo?.semester || "";
    form.value.type = leadInfo.reference?.type || "NINGUNO";
    form.value.nameReference = leadInfo.reference?.name || "";
    form.value.dataSource = leadInfo.reference?.dataSource || "";
    form.value.showNameReferenceField = ["ALUMNO", "FAMILIAR_ALUMNO"].includes(leadInfo.reference?.type);
    form.value.showNameReferenceSelect = leadInfo.reference?.type === "PERSONAL_UNINTER";
    form.value.showAdditionalFields = followUpName === "INSC-INSCRIPCIÓN";

    // 🔥 Asegurar que los datos de inscripción viejos no contaminen
    enrollmentData.value = null;

    // ✅ Si se va a mostrar formulario de inscripción pero aún no hay inscripción previa, limpiar campos
    if (form.value.showAdditionalFields) {
      Object.assign(form.value, baseEnrollmentForm);
    }

    // 🧠 Ahora sí, busca si realmente hay inscripción registrada
    await fetchEnrollmentData();

  } catch (error) {
    console.error('Error al cargar datos del lead o listas:', error);
    toast.open({ message: 'Error al cargar los datos del prospecto o sus listas.', type: 'error' });

    form.value = {
      enrollmentStatus: "",
      showAdditionalFields: false,
      showNameReferenceField: false,
      showNameReferenceSelect: false,
      ...baseEnrollmentForm,
    };
    enrollmentData.value = null;
  }
};


onMounted(async () => {
    await loadLeadAndEnrollmentData();
});
</script>

<template>
  <FormContainer maxWidth="max-w-5xl">
    <div class="flex justify-end mt-2 mb-4">
      <button
        class="btn bg-[#219C90] hover:bg-[#1a877e] text-white"
        @click="addComment"
      >
        Añadir comentario <i class="bi bi-plus-circle-dotted text-xl"></i>
      </button>
    </div>

    <div class="text-sm text-gray-500 mb-4">
      Edita los datos del lead y guarda los cambios.<br />
      Si deseas crear una inscripción, completa los campos y da click en
      <b>"Guardar como Inscripción"</b>.
    </div>

    <FormKit
      id="edit"
      type="form"
      v-model="form"
      :actions="false"
      incomplete-message="Lo sentimos hubo un error al editar el lead."
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        name="name"
        label="Nombre"
        placeholder="Nombre completo"
      />

      <FormKit
        type="select"
        name="genre"
        label="Sexo"
        placeholder="Selecciona un sexo"
        :options="['FEMENINO', 'MASCULINO']"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            label="Status"
            name="enrollmentStatus"
            placeholder="Selecciona un status"
            :options="['INS', 'INSO', 'REZA']"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Seguimiento"
            name="followUpId"
            placeholder="Selecciona un seguimiento"
            :options="followUps.map((f) => ({ label: f.name, value: f.id }))"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="tel"
        name="phone"
        label="Teléfono"
        placeholder="Número de contacto"
      />
      <FormKit
        type="email"
        name="email"
        label="Correo electrónico"
        placeholder="Correo electrónico"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="text"
            name="careerInterest"
            label="Carrera de interés"
            placeholder="Ej. Derecho"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Grado escolar"
            name="gradeId"
            placeholder="Selecciona un grado escolar"
            :options="grades.map((g) => ({ label: g.name, value: g.id }))"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        label="Beca ofrecida"
        name="scholarship"
        placeholder="Selecciona una beca"
        :options="[
          '0',
          '5',
          '10',
          '15',
          '20',
          '25',
          '30',
          '35',
          '40',
          '45',
          '50',
          '55',
          '60',
          'APOYO TRABAJADOR',
          'ORFANDAD',
          'PATRONATO',
          'PRACTICANTE RH',
        ]"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="text"
            name="formerSchool"
            label="Escuela de procedencia"
            placeholder="Ej. Preparatoria UNINTER"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Tipo de escuela"
            name="typeSchool"
            placeholder="Selecciona un tipo"
            :options="['PUBLICA', 'PRIVADA']"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        label="Medio de contacto"
        name="asetNameId"
        placeholder="Selecciona un medio"
        :options="
          asetNames.map((a) => ({
            label: `${a.contactType.name} - ${a.name}`,
            value: a.id,
          }))
        "
      />

      <FormKit
        type="select"
        label="Campaña"
        name="campaignId"
        placeholder="Selecciona una campaña"
        :options="campaigns.map((c) => ({ label: c.name, value: c.id }))"
      />

      <FormKit
        type="select"
        label="Ciudad"
        name="cityId"
        placeholder="Selecciona una ciudad"
        :options="cities.map((c) => ({ label: c.name, value: c.id }))"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            label="Ciclo escolar"
            name="cycleId"
            placeholder="Selecciona un ciclo"
            :options="cycles.map((c) => ({ label: c.cycle, value: c.id }))"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Semestre de ingreso"
            name="semester"
            placeholder="Selecciona un semestre"
            :options="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'NO ESPECIFICADO', 'OTRO']"
            validation="optional"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        label="Tipo de referido"
        name="type"
        placeholder="Selecciona un tipo de referido"
        :options="['NINGUNO', 'ALUMNO', 'PERSONAL_UNINTER', 'FAMILIAR_ALUMNO']"
      />

      <InputGroup v-if="form.type !== 'NINGUNO'">
        <FormRow v-if="form.showNameReferenceSelect">
          <FormKit
            type="select"
            label="Nombre del referido"
            name="nameReference"
            placeholder="Selecciona un nombre"
            :options="personalUninterList"
          />
        </FormRow>

        <FormRow v-if="form.showNameReferenceField">
          <FormKit
            type="text"
            label="Nombre del referido"
            name="nameReference"
            placeholder="Ej. María González"
          />
        </FormRow>

        <FormRow>
          <FormKit
            type="text"
            label="Dónde obtuvo el dato"
            name="dataSource"
            placeholder="Ej. Evento de bienvenida"
          />
        </FormRow>
      </InputGroup>

      <!-- // <-- Aquí comienza la sección de inscripción -- > -->
<div
  v-if="form.showAdditionalFields"
  class="border-t pt-6 mt-6 space-y-4"
>
  <div class="text-lg font-semibold">Datos de Inscripción</div>

  <p v-if="isLoadingEnrollment" class="text-gray-600">Cargando datos de inscripción...</p>

  <div
    v-else-if="enrollmentData"
    class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200"
  >
    <h3 class="md:col-span-2 text-xl font-bold text-blue-800 mb-2">
      Inscripción Existente:
    </h3>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Programa (carrera):</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.Career?.program || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Promoción:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.Promotion?.name || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Canal de venta:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.Channel?.name || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Lista de comisión:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.List?.noLista || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Matrícula Alumno:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.matricula || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Recibo:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.enrollment_folio || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">Beca asignada:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.scholarship || 'N/A' }}</p>
    </div>
    <div>
      <label class="block text-blue-700 text-sm font-bold mb-1">CURP:</label>
      <p class="bg-blue-100 p-2 rounded">{{ enrollmentData.curp || 'N/A' }}</p>
    </div>
  </div>

  <div v-else>
    <FormKit
      type="select"
      label="Programa (carrera)"
      name="programa"
      placeholder="Selecciona un programa"
      :options="careers.map((c) => ({ label: c.program, value: c.id }))"
      validation="required"
      :validation-messages="{ required: 'Debes seleccionar un programa.' }"
      v-model="form.programa"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="select"
      label="Promoción"
      name="estrategia"
      placeholder="Selecciona una promoción"
      :options="promotions.map((p) => ({ label: p.name, value: p.id }))"
      validation="required"
      :validation-messages="{ required: 'Debes seleccionar una promoción.' }"
      v-model="form.estrategia"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="select"
      label="Canal de venta"
      name="canalVenta"
      placeholder="Selecciona un canal"
      :options="channels.map((ch) => ({ label: ch.name, value: ch.id }))"
      validation="required"
      :validation-messages="{ required: 'Debes seleccionar un canal de venta.' }"
      v-model="form.canalVenta"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="select"
      label="Lista de comisión"
      name="numeroLista"
      placeholder="Selecciona una lista"
      :options="lists.map((l) => ({ label: l.noLista, value: l.id }))"
      validation="required"
      :validation-messages="{ required: 'Debes seleccionar una lista de comisión.' }"
      v-model="form.numeroLista"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="text"
      name="matricula"
      label="Matrícula"
      placeholder="Número de matrícula"
      validation="required|length:6"
      :validation-messages="{
        required: 'La matrícula es obligatoria.',
        length: 'La matrícula debe tener 6 caracteres.',
      }"
      v-model="form.matricula"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="text"
      name="folio"
      label="Folio"
      placeholder="Número de folio"
      validation="required"
      :validation-messages="{ required: 'El folio es obligatorio.' }"
      v-model="form.folio"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="select"
      name="beca"
      label="Beca asignada"
      placeholder="Selecciona una beca"
      :options="[
        '0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60',
        'APOYO TRABAJADOR', 'ORFANDAD', 'PATRONATO', 'PRACTICANTE RH',
      ]"
      validation="required"
      :validation-messages="{ required: 'Debes seleccionar una beca.' }"
      v-model="form.beca"
      :disabled="isFormDisabled"
    />
    <FormKit
      type="text"
      label="CURP"
      name="curp"
      placeholder="Clave Única de Registro de Población (CURP)"
      validation="required|matches:/^[A-Z]{4}\\d{6}[HM][A-Z]{5}[A-Z\\d]{2}$/"
      :validation-messages="{
        // required: 'La CURP es obligatoria.',
        // matches: 'Formato de CURP inválido.',
      }"
      v-model="form.curp"
      :disabled="isFormDisabled"
    />
  </div>

  <div class="flex justify-between gap-4 mt-6">
    <button
      type="button"
      class="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      @click="handleSaveAsEnrollment"
      :disabled="isSaving || isFormDisabled"
      :class="{ 'opacity-50 cursor-not-allowed': isSaving || isFormDisabled }"
    >
      <i class="bi bi-check2-square"></i>
      {{ isSaving ? 'Guardando...' : (isFormDisabled ? 'Inscripción Existente' : 'Guardar como Inscripción') }}
    </button>

    <button
      type="button"
      class="btn bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
      @click="router.back()"
    >
      <i class="bi bi-x-circle"></i>
      Cancelar
    </button>
  </div>
</div>

      
      <FormKit
        type="submit"
        input-class="w-full bg-green-500 hover:bg-green-600 text-white mt-8"
      >
        Actualizar Lead
      </FormKit>
    </FormKit>
  </FormContainer>
</template>