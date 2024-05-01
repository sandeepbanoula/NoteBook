const { init } = require("@paralleldrive/cuid2");

const createId = (len) => init({
    length: len,
    fingerprint: process.env.CUID_FINGERPRINT,
});

module.exports = createId;