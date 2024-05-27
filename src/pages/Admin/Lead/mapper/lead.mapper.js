export const LeadResource = (form) => {
    const {
        name,
        genre,
        careerInterest,
        formerSchool,
        typeSchool,
        enrollmentStatus,
        followUpId,
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
        email: Array.isArray(email) ? email : [email],
        phone: Array.isArray(phone) ? phone : [phone],
    };
};
