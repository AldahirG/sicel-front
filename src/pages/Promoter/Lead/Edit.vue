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
import cycle from "../../../services/cycle.service";
import followUp from "../../../services/followUp.service";
import grade from "../../../services/grade.service";
import list from "../../../services/list.service";
import promotion from "../../../services/promotion.service";
import LocationSelect from "../../../components/LocationSelect.vue";
import { useSortedFormData } from "../../../composables/useSortedFormData";
import FormContainer from "../../../components/FormContainer.vue";
import FormRow from "../../../components/FormRow.vue";
import InputGroup from "../../../components/InputGroup.vue";
import countryService from "../../../services/country.service";
import stateService from "../../../services/state.service";
import cityService from "../../../services/city.service";
import { schoolOptions } from "../../../data/schoolOptions.js";

const toast = inject("toast");
const route = useRoute();
const router = useRouter();
const { id } = route.params;

const followUps = ref([]);
const grades = ref([]);
const asetNames = ref([]);
const campaigns = ref([]);
const cycles = ref([]);
const lists = ref([]);
const channels = ref([]);
const careers = ref([]);
const promotions = ref([]);
const enrollmentData = ref(null);
const isLoadingEnrollment = ref(false);
const isSaving = ref(false);
const countries = ref([]);
const states = ref([]);
const cities = ref([]);

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
  countryId: "",
  stateId: "",
  cityId: "",
  location: { countryId: '', stateId: '', cityId: '' },
  program: "",
  intern: "",
  ...baseEnrollmentForm, // otros campos
});

const personalUninterList = [
  "ADRIAN MOLINA",
  "ALEJANDRA RIVAS",
  "ALDAHIR GOMEZ",
  "ANALIT ROMAN ARCE",
  "ANGELICA NIETO",
  "AXEL ESPINOSA",
  "BETSABE FLORES",
  "BRYAN MURGA",
  "CESAR SANTA OLALLA",
  "CLAUDIA GALAN",
  "EMMA ARRIAGA",
  "ISIS CORTES",
  "JAVIER DE JESUS",
  "JAVIER ESPINOSA",
  "JESUS GUZMAN",
  "JESUS TRILLO",
  "JORGE NARVAEZ",
  "JOSE JAVIER DEL CASTILLO",
  "KEREN GOMEZ",
  "MARIAN SALGADO",
  "MARCO SALGADO",
  "MELYSSA MONROY",
  "RAUL CASTILLEJA",
  "THALIA SANCHEZ",
  "XIMENA MARTINEZ",
  "YOALI APARICIO",
  "YANIN VAZQUEZ",
]
  .sort((a, b) => a.localeCompare(b))
  .concat("NINGUNO DE LOS ANTERIORES");

const isFormDisabled = computed(() => {
  return (
    enrollmentData.value !== null ||
    isLoadingEnrollment.value ||
    blockForm.value
  );
});

const handleSubmit = async (form) => {
  // Verifica si el valor de formerSchool existe en schoolOptions
  const isSchoolValid = existsInList(form.formerSchool, schoolOptions);

  if (form.formerSchool && !isSchoolValid) {
    await Swal.fire({
      title: "Escuela de procedencia inválida",
      text: "Debes seleccionar una opción válida de la lista de escuelas.",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  // Validar también si es PERSONAL_UNINTER y el nombre no pertenece a la lista
  if (form.type === "PERSONAL_UNINTER") {
    const isRefValid = personalUninterList.includes(
      form.nameReference?.toUpperCase()
    );

    if (!isRefValid) {
      const confirmRef = await Swal.fire({
        title:
          "Estas actualizando la información de: 'Nombre del referido' con un valor no listado",
        text: "¿Estás seguro de actualizarlo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmRef.isConfirmed) return;
    }
  }

  try {
    const mapper = LeadResource(form);
    const { data } = await lead.update(id, mapper);

    toast.open({ message: data.http.message, type: "success" });
    router.push({ name: "promoter/leads" });
  } catch (error) {
    toast.open({
      message: error.response?.data?.message || "Error inesperado",
      type: "error",
    });
  }
};

const selectedCountry = computed(() =>
  countries.value.find((c) => c.id === form.value.countryId)
);

const isMexico = computed(() => {
  const name = selectedCountry.value?.name || "";
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase() === "MEXICO"
  );
});

// ✅ Agrega esta línea junto a otras refs
const blockForm = ref(false);

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
    console.error("Error al obtener datos de inscripción:", error);
    toast.open({
      message: "Error al cargar los datos de inscripción.",
      type: "error",
    });
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
    .replace(/[^A-Z0-9]/gi, "") // Permite solo letras y números
    .trim()
    .toUpperCase() || "";

const normalizeBeta = (value) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^A-Z0-9_\s]/gi, "") // Permitir solo letras (mayúsculas), números y guiones bajos
    .toUpperCase() || "";
    

watch(
  form,
  (val) => {
    form.value.name = normalizeBeta(val.name);
    form.value.phone = normalizePhone(val.phone);
    form.value.careerInterest = normalizeAlpha(val.careerInterest);
    form.value.comments = normalizeAlpha(val.comments);
    form.value.formerSchool = normalizeBeta(val.formerSchool);
    form.value.dataSource = normalizeBeta(val.dataSource);
    form.value.matricula = normalizeAlphanumeric(val.matricula);
    form.value.folio = normalizeAlphanumeric(val.folio);
    form.value.curp = normalizeAlphanumeric(val.curp);
    form.value.nameReference = normalizeBeta(val.nameReference);
  },
  { deep: true }
);

const handleSaveAsEnrollment = async () => {
  if (isFormDisabled.value) {
    toast.open({
      message: "Este prospecto ya ha sido inscrito.",
      type: "warning",
    });
    return;
  }

  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Verifica que todos los datos estén completos. Después de guardar como inscripción, los campos no podrán ser editados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

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
      enrollment_folio: form.value.folio,
      matricula: form.value.matricula,
      scholarship: form.value.beca,
      curp: form.value.curp,
    };

    const { data: enrollmentCreated } = await enrollment.create(
      enrollmentDataToSend
    );

    toast.open({
      message: "Inscripción y lead actualizados correctamente.",
      type: "success",
    });

    await fetchEnrollmentData();
    blockForm.value = true; // ✅ Bloquea el formulario

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
      // router.push({ name: "showLeadPromotor", params: { id } });
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

// Mantén countryId/stateId/cityId sincronizados con location para el mapeo/submit
watch(() => form.value.location, (loc) => {
  form.value.countryId = loc?.countryId || '';
  form.value.stateId   = loc?.stateId   || '';
  form.value.cityId    = loc?.cityId    || '';
}, { deep: true, immediate: true });


const sortOptions = (arr, labelKey = "label") => {
  return [...arr].sort((a, b) => {
    const labelA = a[labelKey]?.toUpperCase?.() || "";
    const labelB = b[labelKey]?.toUpperCase?.() || "";
    return labelA.localeCompare(labelB);
  });
};

const existsInList = (value, list) => {
  return list.some((option) => {
    return (
      option.label?.toUpperCase?.() === value.toUpperCase() ||
      option.value?.toUpperCase?.() === value.toUpperCase()
    );
  });
};

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
const loadLeadAndEnrollmentData = async () => {
  try {
    followUps.value = (await followUp.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    grades.value = (await grade.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    asetNames.value = (await asetName.getAll()).data.data.sort((a, b) => {
      const aFull = `${a.contactType.name} - ${a.name}`;
      const bFull = `${b.contactType.name} - ${b.name}`;
      return aFull.localeCompare(bFull);
    });
    campaigns.value = (await campaign.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    cycles.value = (await cycle.getAll()).data.data.sort((a, b) =>
      a.cycle.localeCompare(b.cycle)
    );
    lists.value = (await list.getAll()).data.data.sort((a, b) =>
      a.noLista.localeCompare(b.noLista)
    );
    channels.value = (await channel.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    careers.value = (await career.getAll()).data.data.sort((a, b) =>
      a.program.localeCompare(b.program)
    );
    promotions.value = (await promotion.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // 🌍 Ubicación ordenada (asegúrate que tienes importado countryService, stateService, cityService)
    countries.value = (await countryService.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    states.value = (await stateService.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    cities.value = (await cityService.getAll()).data.data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const { data } = await lead.getById(route.params.id);
    const leadInfo = data.data;

    const followUpName = leadInfo?.information?.followUp?.name;

    form.value.name = leadInfo.information?.name;
    form.value.genre = leadInfo.information?.genre;
    form.value.enrollmentStatus = leadInfo.information?.enrollmentStatus;
    form.value.followUpId = leadInfo?.information?.followUp?.id;
    form.value.phone = Array.isArray(leadInfo?.phones)
      ? leadInfo.phones[0]
      : leadInfo?.phones || "";
    form.value.email = leadInfo?.emails;
    form.value.careerInterest = leadInfo.information?.careerInterest;
    form.value.gradeId = leadInfo.grade?.id;
    form.value.scholarship = leadInfo?.scholarship;
    form.value.formerSchool = leadInfo.information?.formerSchool;
    form.value.typeSchool = leadInfo.information?.typeSchool;
    form.value.asetNameId = leadInfo.asetName?.id;
    form.value.campaignId = leadInfo.campaign?.id;
    form.value.cycleId = leadInfo.cycle?.id;
    form.value.semester = leadInfo?.semester || "";
    form.value.type = leadInfo.reference?.type || "NINGUNO";
    form.value.nameReference = leadInfo.reference?.name || "";
    form.value.dataSource = leadInfo.reference?.dataSource || "";
    form.value.showNameReferenceField = ["ALUMNO", "FAMILIAR_ALUMNO"].includes(
      leadInfo.reference?.type
    );
    form.value.showNameReferenceSelect =
      leadInfo.reference?.type === "PERSONAL_UNINTER";
    form.value.showAdditionalFields = followUpName === "INSC-INSCRIPCIÓN";

    // Asignar correctamente la ubicación desde el lead
    form.value.location = {
      countryId: leadInfo.address?.country?.id || "",
      stateId: leadInfo.address?.state || "", // ← texto directo
      cityId: leadInfo.address?.city || "", // ← texto directo
    };

    // También reflejamos esos valores en los campos individuales (para compatibilidad)
    form.value.countryId = form.value.location.countryId;
    form.value.stateId = form.value.location.stateId;
    form.value.cityId = form.value.location.cityId;

    console.log("Ubicación del lead:", form.value.location);

    form.value.program = leadInfo?.program || "";
    form.value.intern = leadInfo?.intern || "";

    enrollmentData.value = null;

    if (form.value.showAdditionalFields) {
      Object.assign(form.value, baseEnrollmentForm);
    }

    await fetchEnrollmentData();
  } catch (error) {
    console.error("Error al cargar datos del lead o listas:", error);
    toast.open({
      message: "Error al cargar los datos del prospecto o sus listas.",
      type: "error",
    });

    form.value = {
      enrollmentStatus: "",
      showAdditionalFields: false,
      showNameReferenceField: false,
      showNameReferenceSelect: false,
      location: { countryId: "", stateId: "", cityId: "" },
      ...baseEnrollmentForm,
    };
    enrollmentData.value = null;
  }
  await resolveStateAndCityFromText();
};

const resolveStateAndCityFromText = async () => {
  if (!isMexico.value) return;

  // Solo si los valores son texto plano (no IDs)
  const currentStateText = form.value.stateId;
  const currentCityText = form.value.cityId;

  // Buscar estado por nombre
  const matchedState = states.value.find(
    (s) => s.name.toUpperCase() === currentStateText.toUpperCase()
  );

  if (matchedState) {
    form.value.stateId = matchedState.id;

    // Obtener ciudades si aún no se cargaron o no corresponden
    if (!cities.value.length || cities.value[0].stateId !== matchedState.id) {
      const cityRes = await cityService.getByState(matchedState.id);
      cities.value = cityRes.data.data;
    }

    const matchedCity = cities.value.find(
      (c) => c.name.toUpperCase() === currentCityText.toUpperCase()
    );

    if (matchedCity) {
      form.value.cityId = matchedCity.id;
    }
  }
};

const normalizePhone = (value) => {
  if (Array.isArray(value)) {
    value = value[0] || "";
  }
  return String(value).replace(/\D/g, "").slice(0, 15) || "";
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
    <p
      v-if="isFormDisabled"
      class="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-400 text-sm flex items-center gap-2"
    >
      <i class="bi bi-exclamation-triangle-fill text-lg"></i>
      Este lead ya fue inscrito. Los campos están bloqueados para edición.
    </p>

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
        label="Nombre completo"
        placeholder="Nombre completo"
        :disabled="isFormDisabled"
      />

      <FormKit
        type="select"
        name="genre"
        label="Sexo"
        placeholder="Selecciona un sexo"
        :options="['FEMENINO', 'MASCULINO']"
        :disabled="isFormDisabled"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            label="Status"
            name="enrollmentStatus"
            placeholder="Selecciona un status"
            :options="['INS', 'INSO', 'REZA']"
            :disabled="isFormDisabled"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Seguimiento"
            name="followUpId"
            placeholder="Selecciona un seguimiento"
            :options="followUps.map((f) => ({ label: f.name, value: f.id }))"
            :disabled="isFormDisabled"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="tel"
        name="phone"
        label="Teléfono"
        placeholder="Número de contacto"
        validation="required|length:10,15|number"
        :validation-messages="{
          required: 'El teléfono es obligatorio.',
          length: 'Debe tener entre 10 y 15 dígitos.',
          number: 'Solo se permiten números.',
        }"
        :disabled="isFormDisabled"
      />

      <FormKit
        type="email"
        name="email"
        label="Correo electrónico"
        placeholder="Correo electrónico"
        :disabled="isFormDisabled"
      />

      <InputGroup>
        <FormRow>
          <FormKit
            type="text"
            name="careerInterest"
            label="Carrera de interés"
            placeholder="Ej. Derecho"
            :disabled="isFormDisabled"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Grado escolar"
            name="gradeId"
            placeholder="Selecciona un grado escolar"
            :options="grades.map((g) => ({ label: g.name, value: g.id }))"
            :disabled="isFormDisabled"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Programa"
            name="program"
            placeholder="Selecciona una opción"
            :options="
              careers.map((c) => ({ label: c.program, value: c.program }))
            "
            v-model="form.program"
            :disabled="isFormDisabled"
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
        :disabled="isFormDisabled"
      />

      <InputGroup>
        <FormRow>
          <!-- Campo tipo texto con autocompletado -->
          <FormKit
            type="text"
            name="formerSchool"
            label="Escuela de procedencia"
            placeholder="Escribe o selecciona una escuela"
            list="school-options"
            v-model="form.formerSchool"
            :disabled="isFormDisabled"
            input-class="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-sm text-sm"
            @keydown.enter.prevent
          />

          <!-- Datalist que genera las opciones autocompletables -->
          <datalist id="school-options">
            <option
              v-for="school in sortOptions([
                { label: 'Selecciona una escuela', value: '' },
                ...schoolOptions,
              ])"
              :key="school.value"
              :value="school.label"
            />
          </datalist>
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Tipo de escuela"
            name="typeSchool"
            placeholder="Selecciona un tipo"
            :options="['PUBLICA', 'PRIVADA']"
            :disabled="isFormDisabled"
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
        :disabled="isFormDisabled"
      />

      <FormKit
        type="select"
        label="Campaña"
        name="campaignId"
        placeholder="Selecciona una campaña"
        :options="campaigns.map((c) => ({ label: c.name, value: c.id }))"
        :disabled="isFormDisabled"
      />

<!-- Sustituye todo el bloque de país/estado/ciudad por esto -->
<LocationSelect
  :key="`${form.location.countryId}|${form.location.stateId}|${form.location.cityId}`"
  v-model="form.location"
/>


      <InputGroup>
        <FormRow>
          <FormKit
            type="select"
            label="Ciclo escolar"
            name="cycleId"
            placeholder="Selecciona un ciclo"
            :options="cycles.map((c) => ({ label: c.cycle, value: c.id }))"
            :disabled="isFormDisabled"
          />
        </FormRow>
        <FormRow>
          <FormKit
            type="select"
            label="Semestre/Cuatrimestre/Año de ingreso"
            name="semester"
            placeholder="Selecciona un semestre"
            :options="[
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              'NO ESPECIFICADO',
              'OTRO',
            ]"
            validation="optional"
            :disabled="isFormDisabled"
          />
        </FormRow>

        <FormRow>
          <FormKit
            type="select"
            label="Interno/Externo"
            name="intern"
            placeholder="Selecciona una opción"
            :options="['INTERNO', 'EXTERNO']"
            v-model="form.intern"
            :disabled="isFormDisabled"
          />
        </FormRow>
      </InputGroup>

      <FormKit
        type="select"
        label="Tipo de referido"
        name="type"
        placeholder="Selecciona un tipo de referido"
        :options="['NINGUNO', 'ALUMNO', 'PERSONAL_UNINTER', 'FAMILIAR_ALUMNO']"
        :disabled="isFormDisabled"
      />

      <InputGroup v-if="form.type !== 'NINGUNO'">
        <FormRow v-if="form.showNameReferenceSelect">
          <FormKit
            type="text"
            name="nameReference"
            label="Nombre del referido"
            placeholder="Escribe o selecciona un nombre"
            list="ref-options"
            v-model="form.nameReference"
            :disabled="isFormDisabled"
            input-class="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-sm text-sm"
            @keydown.enter.prevent
          />

          <datalist id="ref-options">
            <option
              v-for="ref in personalUninterList"
              :key="ref"
              :value="ref"
            />
          </datalist>
        </FormRow>

        <FormRow v-if="form.showNameReferenceField">
          <FormKit
            type="text"
            label="Nombre del referido"
            name="nameReference"
            placeholder="Ej. María González"
            :disabled="isFormDisabled"
          />
        </FormRow>

        <FormRow>
          <FormKit
            type="text"
            label="Dónde obtuvo el dato"
            name="dataSource"
            placeholder="Ej. Evento de bienvenida"
            :disabled="isFormDisabled"
          />
        </FormRow>
      </InputGroup>

      <!-- // <-- Aquí comienza la sección de inscripción -- > -->
      <div
        v-if="form.showAdditionalFields"
        class="border-t pt-6 mt-6 space-y-4"
      >
        <div class="text-lg font-semibold">Datos de Inscripción</div>

        <p v-if="isLoadingEnrollment" class="text-gray-600">
          Cargando datos de inscripción...
        </p>

        <div
          v-else-if="enrollmentData"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <h3 class="md:col-span-2 text-xl font-bold text-blue-800 mb-2">
            Inscripción Existente:
          </h3>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Programa (carrera):</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.Career?.program || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Promoción:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.Promotion?.name || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Canal de venta:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.Channel?.name || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Lista de comisión:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.List?.noLista || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Matrícula Alumno:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.matricula || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Recibo:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.enrollment_folio || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >Beca asignada:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.scholarship || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-blue-700 text-sm font-bold mb-1"
              >CURP:</label
            >
            <p class="bg-blue-100 p-2 rounded">
              {{ enrollmentData.curp || "N/A" }}
            </p>
          </div>
        </div>

        <div v-else>
          <FormKit
            type="select"
            label="Programa (carrera)"
            name="programa"
            placeholder="Selecciona un programa"
            :options="careers.map((c) => ({ label: c.program, value: c.id }))"
            v-model="form.programa"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="select"
            label="Promoción"
            name="estrategia"
            placeholder="Selecciona una promoción"
            :options="promotions.map((p) => ({ label: p.name, value: p.id }))"
            v-model="form.estrategia"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="select"
            label="Canal de venta"
            name="canalVenta"
            placeholder="Selecciona un canal"
            :options="channels.map((ch) => ({ label: ch.name, value: ch.id }))"
            v-model="form.canalVenta"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="select"
            label="Lista de comisión"
            name="numeroLista"
            placeholder="Selecciona una lista"
            :options="lists.map((l) => ({ label: l.noLista, value: l.id }))"
            v-model="form.numeroLista"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="text"
            name="matricula"
            label="Matrícula"
            placeholder="Número de matrícula"
            v-model="form.matricula"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="text"
            name="folio"
            label="Recibo"
            placeholder="Número de Recibo"
            v-model="form.folio"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="select"
            name="beca"
            label="Beca asignada"
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
            v-model="form.beca"
            :disabled="isFormDisabled"
          />
          <FormKit
            type="text"
            label="CURP"
            name="curp"
            placeholder="Clave Única de Registro de Población (CURP)"
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
            :class="{
              'opacity-50 cursor-not-allowed': isSaving || isFormDisabled,
            }"
          >
            <i class="bi bi-check2-square"></i>
            {{
              isSaving
                ? "Guardando..."
                : isFormDisabled
                ? "Inscripción Existente"
                : "Guardar como Inscripción"
            }}
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
        :disabled="isFormDisabled"
        input-class="w-full bg-green-500 hover:bg-green-600 text-white mt-8"
      >
        Actualizar Lead
      </FormKit>
    </FormKit>
  </FormContainer>
</template>

<style scoped>
/* Estilo global para campos deshabilitados de FormKit */
input[disabled],
select[disabled],
textarea[disabled] {
  background-color: #e0efff !important; /* Azul claro */
  color: #1e3a8a !important; /* Azul oscuro */
  border-color: #cbd5e0 !important; /* Borde gris claro */
  opacity: 1 !important;
  cursor: not-allowed;
}
</style>
