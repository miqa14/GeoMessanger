const multer = require('multer')
const randomBytes = require('random-bytes')

const allowedTypes = ['image/png','image/jpg','image/jpeg']

const fileFilter = (request, file, callback)=>{
    
    console.log(file,'this is flle filter function')
    
    if(allowedTypes.includes(file.mimetype)){
        callback(null, true)
    }else{
        callback(null, false)
    }
}

const storage = multer.diskStorage({
    

    async filename(request, file, callback){
        const strArr = file.originalname.split('.')
        console.log(strArr,'this is starry')
        const format = strArr[strArr.length - 1]
        console.log(format,"this is format")

        randomBytes(12, async (error,buffer)=>{
            if(error){
                return false
            }

            const dinamicStr = buffer.toString('hex')
            const dinamicFileName = `${dinamicStr}.${format}`
            callback(null, dinamicFileName)
        })
    },

    destination(request, file, callback){
        callback(null, 'public/image/uploads')
    }
})



module.exports = multer({storage,fileFilter})