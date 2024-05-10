const { UserNotebook, Notebook, User } = require("../model/model");

const createUserNotebook = async (nbUserId, nbId, nbRole, transaction) => {
    const userNb = await UserNotebook.create({
        user_id: nbUserId,
        notebook_id: nbId,
        role: nbRole,
    }, {
        transaction: transaction
    })
    return userNb;
}

const findCreateUserNotebook = async (nbUserId, nbId, nbRole, transaction, rw) => {
    const [userNotebook, created] = await UserNotebook.findOrCreate({
        where: {
            user_id: nbUserId,
            notebook_id: nbId
        },
        defaults: {
            user_id: nbUserId,
            notebook_id: nbId,
            role: nbRole,
        },
        transaction: transaction,
        raw: rw
    });
    return [userNotebook, created];
}

const selectUserNotebook = async (userId, rw) => {
    const userNb = await UserNotebook.findAll({
        include: [{
            model: Notebook,
            include: [{
                model: User,
                required: true,
                right: true,
                attributes: ["name", "pic"]
            }],
            required: true,
            right: true,
            attributes: ["name", "color", "code", "createdAt"],
        }],
        where: {
            user_id: userId
        },
        attributes: ["role", "notebook_id"],
        raw: rw
    });
    return userNb;
}

module.exports = { createUserNotebook, findCreateUserNotebook, selectUserNotebook }