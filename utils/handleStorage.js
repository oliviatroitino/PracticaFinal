const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req, file, callback){ // pasan argumentos automaticamente
        const pathStorage = __dirname+"/../storage"
        callback(null, pathStorage) // error y destination
    },
    /* filename:function(req, file, callback){ 
        const ext = file.originalname.split(".").pop() // el ultimo valor
        const filename = "file-"+Date.now()+"."+ext
        callback(null, filename)
    } */
})

const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        files: 1
    }
})

const memory = multer.memoryStorage()
const uploadMiddlewareMemory = multer({storage: memory})

module.exports = { uploadMiddleware, uploadMiddlewareMemory }