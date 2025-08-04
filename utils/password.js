const crypto = require('crypto');

const generate8CharAlphanumeric = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = crypto.randomBytes(8); // 8 random bytes

    for (let i = 0; i < 8; i++) {
        const index = bytes[i] % charset.length;
        result += charset[index];
    }

    return result;
};

module.exports = generate8CharAlphanumeric;
