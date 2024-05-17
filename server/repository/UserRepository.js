const { where } = require("sequelize");
const { User } = require("../model/model");

const findOrCreateUser = async (user_gid, data, rw) => {
    return await User.findOrCreate({
        where: {
            g_id: user_gid
        },
        defaults: data,
        raw: rw
    });
}

const selectAllUsers = async (whereOption, rw) => {
    return await User.findAll({
        order: ["name"],
        where: whereOption,
        raw: rw
    });
}

const updateUser = async (updatedData, userId) => {
    return await User.update(updatedData, {
        where: {
            id: userId
        }
    });
}

module.exports = { selectAllUsers, updateUser, findOrCreateUser }