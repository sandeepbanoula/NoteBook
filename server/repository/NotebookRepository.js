const { Notebook } = require("../model/model");
const createId = require("../middleware/idGenerator");

const createNotebook = async (nbName, nbColor, nbUserId, transaction) => {
    const nbCode = createId(5);
    const nb = await Notebook.create({
        name: nbName,
        color: nbColor,
        code: nbCode(),
        owner: nbUserId
    },{transaction: transaction})

    return nb;
}

module.exports = { createNotebook }