const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});

module.exports = upload;  // Export upload directly, not as an object
