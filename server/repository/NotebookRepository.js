const { Notebook, UserNotebook, User } = require("../model/model");
const createId = require("../middleware/idGenerator");

const createNotebook = async (nbName, nbColor, nbUserId, transaction) => {
    const nbCode = createId(5);
    const nb = await Notebook.create({
        name: nbName,
        color: nbColor,
        code: nbCode(),
        owner: nbUserId
    }, { transaction: transaction })

    return nb;
}

const createOwnerNotebook = async (nbName, nbColor, nbUserId) => {
    const nbCode = createId(5);
    const nb = await Notebook.create({
        name: nbName,
        color: nbColor,
        code: nbCode(),
        owner: nbUserId,
        "UserNotebooks": {
            user_id: nbUserId,
            role: "owner",
        }
    }, { include: ["UserNotebooks"] })

    return nb;
}

const selectNotebookByCode = async (attr, nbCode, rw) => {
    const nb = await Notebook.findAll({
        attributes: attr,
        where: {
            code: nbCode
        },
        raw: rw
    });

    return nb;
}

module.exports = { createNotebook, createOwnerNotebook, selectNotebookByCode }