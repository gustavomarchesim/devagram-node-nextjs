import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { respostasPadroes } from "@/types/respostasPadroes";
import { upload, uploadImagemCosmic } from "../../services/uploadImagensCosmic";
import nc from "next-connect";


const handler = nc()
    .use(upload.single('file'))
    .put(async ( req : any, res : NextApiResponse<respostasPadroes> | any) => {

        try {
            
            const { userId } = req?.query;
            const usuario = await usuarioModel.findById(userId);

            if(!usuario){
                return res.status(400).json({ erro : 'Usuário não encontrado!' });
            }

            const { nome } = req?.body;

            if(nome && nome.length > 2){
                usuario.nome = nome;
            };

            const { file } = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar =  image.media.url;
                }
            };

            await usuarioModel
                .findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status(200).json({ msg: 'Usuário atualizado com sucesso!' });
        } catch (e) {
            console.log(e)
            return res.status(400).json({ erro : 'Não foi possível atualizar usuário!' });
        }
    })
    .get(async (req : NextApiRequest, res : NextApiResponse<respostasPadroes | any>) => {

        try {
    
            const { userId } = req?.query;
    
            const usuario = await usuarioModel.findById(userId);
            usuario.senha = null;
            return res.status(200).json(usuario);
    
        } catch (e) {
            console.log(e);
        };
        return res.status(400).json({ erro : 'Erro ao obter dados do usuário!' });
    });
    
export const config = {
    api : {
         bodyParser : false
    }
};

export default validarTokenJWT(conectarMongoDB(handler));