// src/composables/useFilterMapping.js
import { format } from "date-fns";

const fieldMap = {
  "dateContact": ["startDate", "endDate"],

  "information.genre": "genre",
  "information.followUp.name": "followUp",
  "information.enrollmentStatus": "enrollmentStatus",
  "information.careerInterest": "careerInterest",

  "grade.name": "gradeId",
  "program": "program",
  "information.formerSchool": "formerSchool",
  "information.typeSchool": "typeSchool",
  "semester": "semester",
  "intern": "intern",

  "asetName.contactType": "medioContacto",
  "asetName.name": "asetnameId",
  "campaign.name": "campaignId",

  "city.state.country.name": "countryId",
  "city.state.name": "stateId",
  "city.name": "cityId",
  "cycle.cycle": "cycleId",

  "reference.type": "referenceType",
  "reference.name": "referenceName"
};

function mapFilterToBackendParams(key, value) {
  const result = {};

  const backendKey = fieldMap[key] || key;

  if (key === "dateContact") {
    if (value.length) {
      const sorted = value
        .map((d) => new Date(d))
        .sort((a, b) => a - b);
      result.startDate = sorted[0].toISOString();
      result.endDate = sorted[sorted.length - 1].toISOString();
    }
  } else {
    result[backendKey] = value;
  }

  return result;
}

function getFilterLabel(key, value) {
  if (key === "dateContact") {
    if (!value.length) return null;

    const sorted = value.map((d) => new Date(d)).sort((a, b) => a - b);
    const start = format(sorted[0], "dd/MM/yyyy");
    const end = format(sorted[sorted.length - 1], "dd/MM/yyyy");
    return `Fecha de primer contacto: del ${start} al ${end}`;
  }

  const labelMap = {
    "information.genre": "Género",
    "information.followUp.name": "Seguimiento",
    "information.enrollmentStatus": "Status",
    "information.careerInterest": "Carrera de interés",
    "grade.name": "Grado escolar",
    "program": "Programa",
    "information.formerSchool": "Escuela de procedencia",
    "information.typeSchool": "Tipo de escuela",
    "semester": "Semestre a ingresar",
    "intern": "Interno/Externo",
    "asetName.contactType": "Medio de contacto",
    "asetName.name": "Asset Name",
    "campaign.name": "Campaña",
    "city.state.country.name": "País",
    "city.state.name": "Estado",
    "city.name": "Ciudad",
    "cycle.cycle": "Ciclo",
    "reference.type": "Tipo de referido",
    "reference.name": "Nombre de referido",
  };

  const labelTitle = labelMap[key] || key;
  return `${labelTitle}: ${value.join(", ")}`;
}

export function useFilterMapping() {
  return {
    fieldMap,
    mapFilterToBackendParams,
    getFilterLabel
  };
}
