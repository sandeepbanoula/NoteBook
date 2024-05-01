const sequelize = require("../../database/sequelize");
const { createNotebook } = require("./NotebookRepository");
const { createUserNotebook } = require("./UserNotebookRepository");

const createNotebookTransaction = async (nbName, nbColor, nbUserId) => {
    try {
        const result = sequelize.transaction(async t => {
            const nb = await createNotebook(nbName, nbColor, nbUserId, t);
            await createUserNotebook(nbUserId, nb.id, "owner", t);
            return nb;
        });
    }
    catch (error) {
        console.log(error);
        return error
    }
}

module.exports = { createNotebookTransaction }