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

db.people.updateMany({race: "Night Elf"}, {$set: {residence_id: ObjectId("5ba4baf6477234039dc7cc31")}})

db.people.update({name: "Jaina Proudmoore"}, {$set: {residence_id: ObjectId("5ba4baf6477234039dc7cc32")}})
