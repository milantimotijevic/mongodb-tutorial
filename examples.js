db.residences.aggregate([
    {
        $lookup: {
            from: "people",
            localField: "_id",
            foreignField: "residence_id",
            as: "people"
        }
    }
]).pretty()