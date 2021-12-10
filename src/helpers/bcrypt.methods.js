const bcrypt = require("bcryptjs");
const config = require('../config');
const saltN = Number.parseInt(config.JWT.SALT_BCRIPT, 10);

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltN);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

const matchPassword = async (passwordBody, passwordDB) => {
    return await bcrypt.compare(passwordBody, passwordDB);
};

module.exports = { matchPassword, encryptPassword }; 