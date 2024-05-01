const { UserNotebook } = require("../model/model");

const createUserNotebook = async (nbUserId, nbId, nbRole, transaction) => {
    const userNb = await UserNotebook.create({
        user_id: nbUserId,
        notebook_id: nbId,
        role: nbRole,
    },{
        transaction: transaction
    })
    return userNb;
}

module.exports = { createUserNotebook }