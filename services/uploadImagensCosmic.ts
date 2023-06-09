import multer from "multer";
import cosmicjs from "cosmicjs";

const { 
        CHAVE_GRAVACAO_AVATARES, 
        CHAVE_GRAVACAO_PUBLICACOES, 
        BUCKET_AVATARES, 
        BUCKET_PUBLICACOES  
    } = process.env;

const cosmic = cosmicjs();
const bucketAvatares = cosmic.bucket({
    slug : BUCKET_AVATARES ,
    write_key : CHAVE_GRAVACAO_AVATARES
});

const bucketPublicaoes = cosmic.bucket({
    slug : BUCKET_PUBLICACOES,
    write_key : CHAVE_GRAVACAO_PUBLICACOES
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImagemCosmic = async (req : any) => {
        if(req?.file?.originalname){

            if(!req?.file?.originalname.includes('.png') &&
               !req?.file?.originalname.includes('.jpg') &&
               !req?.file?.originalname.includes('.jpeg')){
               throw new Error('Extensão de imagem inválida');
            };

            const media_object = {
                originalname : req.file.originalname,
                buffer : req.file.buffer
            };
            
        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicaoes.addMedia({media : media_object});            
        } else {
            return await bucketAvatares.addMedia({media : media_object});
        };
    };
};

export {upload, uploadImagemCosmic};