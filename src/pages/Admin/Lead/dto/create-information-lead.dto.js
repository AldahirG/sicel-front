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
            dateContact,
            scholarship,
            semester,
            cycle,
            reference,
            information: {
                name,
                genre,
                careerInterest,
                formerSchool,
                typeSchool,
                enrollmentStatus,
                followUp
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
                paternalSurname,
                maternalSurname
            }
        },
        meta: {
            timeline = []
        } = {}
    } = data;

    // Mapeo de timeline
    const timelines = timeline.map(t => ({
        timelineId: t.id,
        timelineTitle: t.title,
        timelineDescription: t.description,
        timelineTimeableId: t.timeableId,
        timelineTimeableModel: t.timeableModel,
        timelineLeadId: t.leadId,
        timelineCreateAt: t.createAt,
        timelineUpdateAt: t.updateAt,
    }));

    return {
        gradeId,
        gradeName,
        gradeAvailable,
        gradeCreateAt,
        gradeUpdateAt,
        dateContact,
        scholarship,
        semester,
        cycle,
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
        paternalSurname,
        maternalSurname,
        timelines,
    };
};