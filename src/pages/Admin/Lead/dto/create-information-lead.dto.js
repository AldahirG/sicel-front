export const CreateInformationLeadDto = (data) => {
    const {
        data: {
            grade: {
                id: gradeId,
                name: gradeName,
                available: gradeAvailable,
                createAt: gradeCreateAt,
                updateAt: gradeUpdateAt
            },
            dateContact: dateContact,
            scholarship,
            semester,
            reference,
            information: {
                name: name,
                genre,
                careerInterest,
                formerSchool,
                typeSchool,
                enrollmentStatus,
                followUp: followUp
            },
            campaign,
            asetName: {
                id: asetNameId,
                name: asetNameName
            },
            phones,
            emails,
            address,
            promoter: {
                id: userId,
                name: promoter,
            }
        },
    } = data;

    return {
        gradeId,
        gradeName,
        gradeAvailable,
        gradeCreateAt,
        gradeUpdateAt,
        dateContact,
        scholarship,
        semester,
        reference,
        name,
        genre,
        careerInterest,
        formerSchool,
        typeSchool,
        enrollmentStatus,
        followUp,
        campaign,
        asetNameId,
        asetNameName,
        phones,
        emails,
        address,
        userId,
        promoter,
    };
};
