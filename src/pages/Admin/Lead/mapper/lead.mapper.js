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
    program,
    intern,
    ...rest
  } = form;

  return {
    ...rest,
    ...(semester ? { semester } : {}),
    ...(scholarship ? { scholarship } : {}),
    ...(program ? { program } : {}),
    ...(intern ? { intern } : {}),
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
