import estados from './estados.json';
import estadosMunicipios from './estados-municipios.json';

// Solo los nombres de los estados
export const mexicoStates = estados.map(e => e.nombre);

// Objeto con nombre del estado y su lista de ciudades
export const mexicoStateCities = estadosMunicipios;
