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
        ...rest
    } = form;

    return {
        ...rest,
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
