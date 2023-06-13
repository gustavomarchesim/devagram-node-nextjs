import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { respostasPadroes } from "@/types/respostasPadroes";
import { usuarioModel } from "@/models/usuarioModel";
import { publicacaoModel } from "@/models/publicacaoModel";
import { politicaCORS } from "@/middlewares/politicaCORS";

const comentarioEndpoint = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {
    try {
        if(req.method === 'PUT'){

            const { userId, id } = req.query;

            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({ BadRequest : 'Usuário não encontrado!' });
            };

            const publicacao = await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({ BadRequest : 'Publicação não encontrada!' });
            };

            if(!req.body || !req.body.comentario || req.body.comentario.length < 2 ){
                return res.status(400).json({ BadRequest : 'Comentário inválido!' });
            };

            const comentario = {
                usuarioId : usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            };

            publicacao.comentarios.push(comentario);
            await publicacaoModel.findByIdAndUpdate({ _id : publicacao._id }, publicacao);
            return res.status(200).json({ OK : 'Comentário adicionado com sucesso!' });
        };
        return res.status(405).json({ MethodNotAllowed : 'Método informado inválido!' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ InternalServerError : 'Erro ao adquirir comentários!' });
    }
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(comentarioEndpoint)));