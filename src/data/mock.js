// Mock data — replace all API responses for demo mode

export const DEMO_TOKEN = 'demo-token-sicel-2025'

export const DEMO_USER = {
  id: 1,
  name: 'Demo Admin',
  email: 'demo@sicel.mx',
  roles: ['Administrador'],
}

export const mockLeads = [
  {
    id: 1,
    promoter: { id: 1, name: 'Carlos Ruiz' },
    information: {
      name: 'Ana Martínez López',
      genre: 'Femenino',
      followUp: { id: 2, name: 'Interesada' },
      careerInterest: 'Ing. en Software',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5512345678'],
    emails: ['ana.martinez@gmail.com'],
    asetName: { name: 'Facebook Lead', contactType: 'Digital' },
    campaign: { id: 1, name: 'Campus 2025' },
    address: { state: 'CDMX', city: 'Iztapalapa' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Ninguna',
    intern: 'Presencial',
    updateAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 2,
    promoter: { id: 2, name: 'María Pérez' },
    information: {
      name: 'Luis García Soto',
      genre: 'Masculino',
      followUp: { id: 3, name: 'Contactado' },
      careerInterest: 'Administración',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5587654321'],
    emails: ['lgarcia@hotmail.com'],
    asetName: { name: 'Instagram', contactType: 'Digital' },
    campaign: { id: 2, name: 'Expo Prepa' },
    address: { state: 'Estado de México', city: 'Naucalpan' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Beca 50%',
    intern: 'Semipresencial',
    updateAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 3,
    promoter: { id: 1, name: 'Carlos Ruiz' },
    information: {
      name: 'Paola Reyes Cruz',
      genre: 'Femenino',
      followUp: { id: 1, name: 'Sin información' },
      careerInterest: 'Psicología',
    },
    grade: { id: 4, name: 'Licenciatura trunca' },
    phones: ['5598765432'],
    emails: ['preyes@outlook.com'],
    asetName: { name: 'Referido', contactType: 'Orgánico' },
    campaign: { id: 1, name: 'Campus 2025' },
    address: { state: 'Morelos', city: 'Cuernavaca' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Ninguna',
    intern: 'En línea',
    updateAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 4,
    promoter: null,
    information: {
      name: 'Diego Hernández V.',
      genre: 'Masculino',
      followUp: { id: 1, name: 'Sin info' },
      careerInterest: 'Contaduría',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5511223344'],
    emails: ['dhernandez@gmail.com'],
    asetName: { name: 'WhatsApp', contactType: 'Digital' },
    campaign: { id: 3, name: 'WhatsApp Blast' },
    address: { state: 'Puebla', city: 'Puebla' },
    cycle: { id: 2, name: 'AGO-DIC 2025' },
    scholarship: 'Ninguna',
    intern: 'Presencial',
    updateAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 5,
    promoter: { id: 2, name: 'María Pérez' },
    information: {
      name: 'Sofía Mendoza R.',
      genre: 'Femenino',
      followUp: { id: 2, name: 'Interesada' },
      careerInterest: 'Ing. en Software',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5544556677'],
    emails: ['sofia.mendoza@gmail.com'],
    asetName: { name: 'Facebook Lead', contactType: 'Digital' },
    campaign: { id: 1, name: 'Campus 2025' },
    address: { state: 'CDMX', city: 'Xochimilco' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Beca 25%',
    intern: 'Presencial',
    updateAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 6,
    promoter: null,
    information: {
      name: 'Carlos Torres M.',
      genre: 'Masculino',
      followUp: { id: 1, name: 'Sin info' },
      careerInterest: 'Derecho',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5566778899'],
    emails: ['ctorres@yahoo.com'],
    asetName: { name: 'Llamada', contactType: 'Telefónico' },
    campaign: { id: 4, name: 'Llamadas Outbound' },
    address: { state: 'Jalisco', city: 'Guadalajara' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Ninguna',
    intern: 'En línea',
    updateAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 7,
    promoter: { id: 3, name: 'Juan López' },
    information: {
      name: 'Valentina Cruz Ríos',
      genre: 'Femenino',
      followUp: { id: 4, name: 'Inscrita' },
      careerInterest: 'Enfermería',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5577889900'],
    emails: ['vcruz@gmail.com'],
    asetName: { name: 'Evento', contactType: 'Presencial' },
    campaign: { id: 5, name: 'Feria Universitaria' },
    address: { state: 'Guerrero', city: 'Acapulco' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Beca 50%',
    intern: 'Presencial',
    updateAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 8,
    promoter: { id: 3, name: 'Juan López' },
    information: {
      name: 'Roberto Méndez P.',
      genre: 'Masculino',
      followUp: { id: 3, name: 'Contactado' },
      careerInterest: 'Negocios Internacionales',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5500112233'],
    emails: ['rmendez@gmail.com'],
    asetName: { name: 'Instagram', contactType: 'Digital' },
    campaign: { id: 2, name: 'Expo Prepa' },
    address: { state: 'Nuevo León', city: 'Monterrey' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Ninguna',
    intern: 'En línea',
    updateAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 9,
    promoter: { id: 2, name: 'María Pérez' },
    information: {
      name: 'Gabriela Santos L.',
      genre: 'Femenino',
      followUp: { id: 2, name: 'Interesada' },
      careerInterest: 'Medicina',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5533445566'],
    emails: ['gsantos@outlook.com'],
    asetName: { name: 'Facebook Lead', contactType: 'Digital' },
    campaign: { id: 1, name: 'Campus 2025' },
    address: { state: 'CDMX', city: 'Tlalpan' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Ninguna',
    intern: 'Presencial',
    updateAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 10,
    promoter: { id: 1, name: 'Carlos Ruiz' },
    information: {
      name: 'Emilio Vargas T.',
      genre: 'Masculino',
      followUp: { id: 1, name: 'Sin información' },
      careerInterest: 'Arquitectura',
    },
    grade: { id: 3, name: 'Bachillerato' },
    phones: ['5522334455'],
    emails: ['evargas@gmail.com'],
    asetName: { name: 'TikTok', contactType: 'Digital' },
    campaign: { id: 6, name: 'TikTok Ads' },
    address: { state: 'Querétaro', city: 'Querétaro' },
    cycle: { id: 1, name: 'ENE-JUN 2025' },
    scholarship: 'Beca 25%',
    intern: 'Semipresencial',
    updateAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
]

export const mockUsers = [
  { id: 1, name: 'Carlos Ruiz', email: 'cruiz@sicel.mx', roles: ['Promotor'], active: true },
  { id: 2, name: 'María Pérez', email: 'mperez@sicel.mx', roles: ['Promotor'], active: true },
  { id: 3, name: 'Juan López', email: 'jlopez@sicel.mx', roles: ['Promotor'], active: true },
  { id: 4, name: 'Demo Admin', email: 'demo@sicel.mx', roles: ['Administrador'], active: true },
]

export const mockCampaigns = [
  { id: 1, name: 'Campus 2025', active: true },
  { id: 2, name: 'Expo Prepa', active: true },
  { id: 3, name: 'WhatsApp Blast', active: true },
  { id: 4, name: 'Llamadas Outbound', active: true },
  { id: 5, name: 'Feria Universitaria', active: true },
  { id: 6, name: 'TikTok Ads', active: false },
]

export const mockCareers = [
  { id: 1, name: 'Ing. en Software' },
  { id: 2, name: 'Administración' },
  { id: 3, name: 'Psicología' },
  { id: 4, name: 'Contaduría' },
  { id: 5, name: 'Derecho' },
  { id: 6, name: 'Enfermería' },
  { id: 7, name: 'Medicina' },
  { id: 8, name: 'Negocios Internacionales' },
  { id: 9, name: 'Arquitectura' },
]

export const mockGrades = [
  { id: 1, name: 'Secundaria' },
  { id: 2, name: 'Preparatoria' },
  { id: 3, name: 'Bachillerato' },
  { id: 4, name: 'Licenciatura trunca' },
]

export const mockCycles = [
  { id: 1, name: 'ENE-JUN 2025', active: true },
  { id: 2, name: 'AGO-DIC 2025', active: false },
  { id: 3, name: 'AGO-DIC 2024', active: false },
]

export const mockFollowUps = [
  { id: 1, name: 'Sin información' },
  { id: 2, name: 'Interesada' },
  { id: 3, name: 'Contactado' },
  { id: 4, name: 'Inscrita' },
  { id: 5, name: 'No interesado' },
]

export const mockRoles = [
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Promotor' },
]

export const mockStates = [
  { id: 1, name: 'CDMX' },
  { id: 2, name: 'Estado de México' },
  { id: 3, name: 'Morelos' },
  { id: 4, name: 'Puebla' },
  { id: 5, name: 'Jalisco' },
  { id: 6, name: 'Nuevo León' },
]

export const mockAsetNames = [
  { id: 1, name: 'Facebook Lead', contactType: 'Digital' },
  { id: 2, name: 'Instagram', contactType: 'Digital' },
  { id: 3, name: 'TikTok', contactType: 'Digital' },
  { id: 4, name: 'WhatsApp', contactType: 'Digital' },
  { id: 5, name: 'Llamada', contactType: 'Telefónico' },
  { id: 6, name: 'Evento', contactType: 'Presencial' },
  { id: 7, name: 'Referido', contactType: 'Orgánico' },
]

export const mockContactMedium = [
  { id: 1, name: 'Digital' },
  { id: 2, name: 'Telefónico' },
  { id: 3, name: 'Presencial' },
  { id: 4, name: 'Orgánico' },
]

export const mockCountries = [
  { id: 1, name: 'México' },
  { id: 2, name: 'Estados Unidos' },
  { id: 3, name: 'Colombia' },
]

export const mockCities = [
  { id: 1, name: 'Ciudad de México', stateId: 1 },
  { id: 2, name: 'Iztapalapa', stateId: 1 },
  { id: 3, name: 'Xochimilco', stateId: 1 },
  { id: 4, name: 'Tlalpan', stateId: 1 },
  { id: 5, name: 'Naucalpan', stateId: 2 },
  { id: 6, name: 'Toluca', stateId: 2 },
  { id: 7, name: 'Cuernavaca', stateId: 3 },
  { id: 8, name: 'Jiutepec', stateId: 3 },
  { id: 9, name: 'Puebla', stateId: 4 },
  { id: 10, name: 'Tehuacán', stateId: 4 },
  { id: 11, name: 'Guadalajara', stateId: 5 },
  { id: 12, name: 'Zapopan', stateId: 5 },
  { id: 13, name: 'Monterrey', stateId: 6 },
  { id: 14, name: 'San Pedro Garza García', stateId: 6 },
]

// Dashboard mock data — matches chartData computed field keys in AdminIndex.vue
export const mockDashboardStatus = [
  { status: 'Sin información', total: 3 },
  { status: 'Interesado', total: 3 },
  { status: 'Contactado', total: 2 },
  { status: 'Inscrito', total: 1 },
  { status: 'No interesado', total: 1 },
]

export const mockDashboardCycle = [
  { cycle: 'ENE-JUN 2025', total: 8 },
  { cycle: 'AGO-DIC 2025', total: 1 },
  { cycle: 'AGO-DIC 2024', total: 1 },
]

export const mockDashboardCountry = [
  { country: 'México', total: 9 },
  { country: 'Estados Unidos', total: 1 },
]

export const mockDashboardState = [
  { state: 'CDMX', total: 3 },
  { state: 'Estado de México', total: 1 },
  { state: 'Morelos', total: 1 },
  { state: 'Puebla', total: 1 },
  { state: 'Jalisco', total: 1 },
  { state: 'Nuevo León', total: 1 },
  { state: 'Guerrero', total: 1 },
  { state: 'Querétaro', total: 1 },
]

export const mockDashboardCity = [
  { city: 'Iztapalapa', total: 1 },
  { city: 'Naucalpan', total: 1 },
  { city: 'Cuernavaca', total: 1 },
  { city: 'Puebla', total: 1 },
  { city: 'Guadalajara', total: 1 },
  { city: 'Acapulco', total: 1 },
  { city: 'Monterrey', total: 1 },
  { city: 'Xochimilco', total: 1 },
  { city: 'Tlalpan', total: 1 },
  { city: 'Querétaro', total: 1 },
]

export const mockDashboardGrade = [
  { grade: 'Bachillerato', total: 8 },
  { grade: 'Licenciatura trunca', total: 1 },
  { grade: 'Preparatoria', total: 1 },
]

export const mockDashboardSemester = [
  { semester: '1er Semestre', total: 4 },
  { semester: '2do Semestre', total: 3 },
  { semester: '3er Semestre', total: 2 },
  { semester: '4to Semestre', total: 1 },
]

export const mockDashboardScholarship = [
  { scholarship: 'Ninguna', total: 6 },
  { scholarship: 'Beca 25%', total: 2 },
  { scholarship: 'Beca 50%', total: 2 },
]

export const mockDashboardSchoolType = [
  { typeSchool: 'Pública', total: 6 },
  { typeSchool: 'Privada', total: 4 },
]

export const mockDashboardContactMedium = [
  { contactMedium: 'Digital', total: 6 },
  { contactMedium: 'Orgánico', total: 1 },
  { contactMedium: 'Telefónico', total: 1 },
  { contactMedium: 'Presencial', total: 2 },
]

// Map endpoint → mock data
export const MOCK_ROUTES = {
  '/leads':                          { data: mockLeads },
  '/users':                          { data: mockUsers },
  '/campaigns':                      { data: mockCampaigns },
  '/careers':                        { data: mockCareers },
  '/grades':                         { data: mockGrades },
  '/cycles':                         { data: mockCycles },
  '/follow-ups':                     { data: mockFollowUps },
  '/roles':                          { data: mockRoles },
  '/states':                         { data: mockStates },
  '/aset-names':                     { data: mockAsetNames },
  '/contact-medium':                 { data: mockContactMedium },
  '/cities':                         { data: mockCities },
  '/countries':                      { data: mockCountries },
  '/dashboard/status':               { data: mockDashboardStatus },
  '/dashboard/cycle':                { data: mockDashboardCycle },
  '/dashboard/country':              { data: mockDashboardCountry },
  '/dashboard/state':                { data: mockDashboardState },
  '/dashboard/city':                 { data: mockDashboardCity },
  '/dashboard/grade':                { data: mockDashboardGrade },
  '/dashboard/semester':             { data: mockDashboardSemester },
  '/dashboard/scholarship':          { data: mockDashboardScholarship },
  '/dashboard/school-type':          { data: mockDashboardSchoolType },
  '/dashboard/contact-medium':       { data: mockDashboardContactMedium },
  '/dashboard/promoter/status':      { data: mockDashboardStatus },
  '/dashboard/promoter/followup':    { data: mockFollowUps.map(f => ({ followUp: f.name, total: Math.ceil(Math.random() * 3 + 1) })) },
  '/dashboard/promoter/cycle':       { data: mockDashboardCycle },
  '/dashboard/promoter/city':        { data: mockDashboardCity },
  '/dashboard/promoter/program':     { data: mockCareers.map(c => ({ program: c.name, total: 1 })) },
  '/dashboard/promoter/campaign':    { data: mockCampaigns.map(c => ({ campaign: c.name, total: Math.ceil(Math.random() * 3 + 1) })) },
  '/dashboard/promoter/school-type': { data: mockDashboardSchoolType },
  '/dashboard/promoter/semester':    { data: mockDashboardSemester },
  '/dashboard/promoter/scholarship': { data: mockDashboardScholarship },
  '/dashboard/promoter/contact-type':{ data: mockDashboardContactMedium },
}
