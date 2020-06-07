import multer from 'multer' 
import path from 'path'
import crypto from 'crypto' //cria hash

export default {
    storage : multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback ) {
            const hash = crypto.randomBytes(6).toString('hex') //por bytes e esta fazendo um casting pra string em hexal
            const fileName = `${hash}-${file.originalname}`
            
            callback(null, fileName)

        }
    }),
}