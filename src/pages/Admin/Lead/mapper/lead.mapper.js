export const LeadResource = (form) => {
  const {
    name,
    genre,
    careerInterest,
    formerSchool,
    typeSchool,
    enrollmentStatus,
    followUpId,
    type,
    nameReference,
    dataSource,
    email,
    phone,
    semester,
    scholarship,
    ...rest
  } = form;

  return {
    ...rest,
    ...(semester ? { semester } : {}),        // solo agrega si tiene valor
    ...(scholarship ? { scholarship } : {}),
    information: {
      name,
      genre,
      careerInterest,
      formerSchool,
      typeSchool,
      enrollmentStatus,
      followUpId,
    },
    reference: {
      type,
      name: nameReference,
      dataSource,
    },
    email: Array.isArray(email) ? email : [email],
    phone: Array.isArray(phone) ? phone : [phone],
  };
};
