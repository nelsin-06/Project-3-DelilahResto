const { config } = require('dotenv');

config();

module.exports = {
    SERVER: {
        PORT: process.env.PORT,
    },
    DATABASE: {
        MONGOHOST: process.env.MONGODB_HOST,
        MONGOPASS: process.env.MONGODB_PASS,
        MONOGNAMEDB: process.env.MONGODB_NAME_DATABASE,
    }
};
