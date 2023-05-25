import type { NextApiResponse } from 'next';
import { respostasPadroes } from "../../types/respostasPadroes";
import { upload, uploadImagemCosmic } from "../../services/uploadImagensCosmic";
import nc from 'next-connect';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { publicacaoModel } from '@/models/publicacaoModel';
import { usuarioModel } from '@/models/usuarioModel';


const handler = nc()
    .use(upload.single('file'))
    .post(async ( req : any, res : NextApiResponse<respostasPadroes> ) => {

        try {

            //Busca na query da requisição o userID
            const { userId } = req.query;

            //Procura o userID do usuario para poder validar
            const usuario  = await usuarioModel.findById(userId);

            // Valida a existencia do usuário
            if(!usuario){
                return res.status(400).json ({erro : 'Usuário não encontrado!'});
            };

            // Verifica se o usuário tem uma requisição ou não
            if(!req || !req.body){
                return res.status(400).json ({erro : 'Parametros de entrada não informados!'});
            };

            //Busca a descrição no corpo da requisição
            const {descricao} = req?.body;

            //Valida a existencia da descrição
            if(!descricao || descricao.length < 2) {
                return res.status(400).json ({erro : 'Descrição obrigatória!'});
            };

            //Verifica a existencia da imagem, buscando tanto pelo nome quanto por ela propriamente
            if(!req.file || !req.file.originalname){
                return res.status(400).json ({erro : 'Imagem obrigatória!'});
            };

            //Faz upload da imagem
            const image = await uploadImagemCosmic(req);
            
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                file : image.media.url,
                data : new Date()
            }

            await publicacaoModel.create(publicacao);
            return res.status(200).json ({msg : 'Publicação efetuada com sucesso!'});
            
        } catch (e) {
            console.log(e)
            return res.status(500).json({erro : 'Erro ao fazer publicação!'});
        };

    });

export const config = {
    api : {
         bodyParser : false
    }
};
    
export default validarTokenJWT(conectarMongoDB(handler)) ;
