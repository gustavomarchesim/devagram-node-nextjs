import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { respostasPadroes } from "@/types/respostasPadroes";
import { publicacaoModel } from "@/models/publicacaoModel";

const feedEndPoint = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes | any> ) => {
    try {
      if (req.method === 'GET') {

        if (req?.query?.userId) {
          const usuario = await usuarioModel.findById(req?.query?.userId);
          
          if (!usuario) {
            return res.status(400).json({ erro :'Não foi possivel validar o usuário!' });
          };

          const publicacoes = await publicacaoModel
          .find({idUsuario : usuario._id})
          .sort({data : -1});

          return res.status(200).json(publicacoes);
      }
    }
  } catch (e) {
    console.log(e);
  }
   return res.status(405).json({ erro :'Método inválido!'});
}
export default validarTokenJWT(conectarMongoDB(feedEndPoint));
