import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { respostasPadroes } from "@/types/respostasPadroes";
import { publicacaoModel } from "@/models/publicacaoModel";
import { SeguidorModel } from "@/models/usuarioSeguidorModel";

const feedEndPoint = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes | any> ) => {
    try {
      if (req.method === 'GET') {
          if (req?.query?.userId) {
          const usuario = await usuarioModel.findById(req?.query?.userId);
          
          if (!usuario) {
            return res.status(400).json({ BadRequest :'Não foi possivel validar o usuário!' });
          };

          const publicacoes = await publicacaoModel
          .find({idUsuario : usuario._id})
          .sort({data : -1});

          return res.status(200).json(publicacoes);
      } else {

        const { userId } = req.query;
        const usuarioLogado = await usuarioModel.findById(userId);

        if(!usuarioLogado){
          return res.status(400).json({ BadRequest : 'Usuário não encontrado!' });
        }

        const seguidores = await SeguidorModel.find({ usuarioId : usuarioLogado._id });
        const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);

        const publicacoes = await publicacaoModel.find({
          $or : [
            { idUsuario : usuarioLogado._id },
            { idUsuario : seguidoresIds }
          ]
        }).sort({data : -1});

        const result = [ ];
        for (const publicacao of publicacoes) {
            const usuarioDaPublicacao = await usuarioModel.findById(publicacao.idUsuario);
            if(usuarioDaPublicacao){
              const final = {...publicacao._doc, usuario : {
                  nome : usuarioDaPublicacao.nome,
                  avatar : usuarioDaPublicacao.avatar
              }};
              result.push(final);
            }
        }
        return res.status(200).json(result);
      };
    };
  } catch (e) {
    console.log(e);
    return res.status(500).json({ OK : 'Ocorreu um erro ao acessar o feed!' })
  }
   return res.status(405).json({ MethodNotAllowed :'Método inválido!'});
}
export default validarTokenJWT(conectarMongoDB(feedEndPoint));
