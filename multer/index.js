const multerUpload = require('./multer.upload');
const { checkFile, checkData, setupData } = require ('./multer.middlewares');

module.exports = { multerUpload, checkFile, checkData, setupData };
