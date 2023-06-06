import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { respostasPadroes } from "@/types/respostasPadroes";
import { usuarioModel } from '@/models/usuarioModel';
import { SeguidorModel } from '@/models/usuarioSeguidorModel';

const seguirEndpoint = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {
    try {
        if(req.method === 'PUT'){ //<== Verifica se o método utilizado é PUT
            const { userId, id } = req?.query; //<== Extrai os valores da query e atribui

            const usuarioLogado = await usuarioModel.findById(userId); //<== Busca no bando de dados uma correspondencia ao id
            if(!usuarioLogado){
                return res.status(400).json({ BadRequest : 'Erro ao buscar usuário!' }); //<== Retorna uma resposta de erro com código 400 (BadRequest) informando que ocorreu um erro ao buscar o usuário
            }; //<== Verifica se o usuário existe
            
            const usuarioASerSeguido = await usuarioModel.findById(id); //<== Busca no bando de dados uma correspondencia ao id
            if(!usuarioASerSeguido){
                return res.status(400).json({ BadRequest : 'Erro ao buscar dados do usuário seguido!' }) //<== Retorna uma resposta de erro com código 400 (BadRequest) informando que ocorreu um erro ao buscar os dados do usuário seguido
            }; //<== Verifica se o usuário existe

            const euJaSigoEsseUsuario = await SeguidorModel
                    .find({usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id}); //<== Busca no bando de dados uma correspondencia ao id

            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){ //<== Verifica se o usuário já segue o usuário alvo
                euJaSigoEsseUsuario.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id})); //<== Deleta o registro no banco de dados

                usuarioLogado.seguindo--; //<== Decrementa o valor de seguidores do usuário logado
                await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado); //<== Atualiza o registro no banco de dados

                usuarioASerSeguido.seguidores--; //<== Decrementa o valor de seguidores do usuário seguido
                await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido); //<== Atualiza o registro no banco de dados

                return res.status(200).json({ OK : 'Usuário deixou de ser seguido com sucesso!' }); //<== Retorna uma resposta de sucesso com código 200 (Ok) informando que o usuário deixou de ser seguido com sucesso
            }else{
                const usuario = { 
                    usuarioId : usuarioLogado._id, //<== Atribui o id do usuário logado
                    usuarioSeguidoId : usuarioASerSeguido._id, //<== Atribui o id do usuário seguido
                };

                await SeguidorModel.create(usuario); //<== Cria um novo registro no banco de dados

                usuarioLogado.seguindo++; //<== Incrementa o valor de seguidores do usuário logado
                await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado); //<== Atualiza o registro no banco de dados

                usuarioASerSeguido.seguidores++; //<== Incrementa o valor de seguidores do usuário seguido
                await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido); //<== Atualiza o registro no banco de dados

                return res.status(200).json({ OK : 'Usuário seguido com sucesso!' }); //<== Retorna uma resposta de sucesso com código 200 (Ok) informando que o usuário foi seguido com sucesso
            };
        };       
        return res.status(405).json({ MethodNotAllowed : 'Método informado inválido!' }); //<== Retorna uma resposta de erro com código 405 (MethodNotAllowed) informando que o método não é válido
    } catch (e) {
        console.log(e);
        return res.status(500).json({ InternalServerError : 'Ocorreu um erro ao seguir o usuário!' }); //<== Retorna uma resposta de erro com código 500 (InternalServerError) informando que ocorreu um erro ao curtir a publicação
    }
}

export default validarTokenJWT(conectarMongoDB(seguirEndpoint)) //<== Executa a função validarTokenJWT passando como parâmetro a função conectarMongoDB passando como parâmetro a função seguirEndpoint