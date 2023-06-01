import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { respostasPadroes } from "@/types/respostasPadroes";

const pesquisaEndpoint = async( req : NextApiRequest, res : NextApiResponse<respostasPadroes | any[]>) => {

    try {

        if (req.method === 'GET') {
            
            const { filtro } = req?.query;

            if(!filtro || filtro.length < 2){
                return res.status(400).json({ erro : 'A busca deve conter ao menos 2 caracteres!'});
            }

            const busca = await usuarioModel.find({
                $or:[
                    {nome : {$regex : filtro, $options : 'i'}},
                    {email : {$regex : filtro, $options : 'i'}}
                ]});
            

            busca.forEach(usuario =>{
                usuario.senha = null;
            });

            return res.status(200).json(busca);
        }
        return res.status(405).json({ erro: 'Método informado não é válido' });
    } catch(e) {
        console.log(e);
        return res.status(500).json({ erro : 'Erro ao buscar usuário!' });
    }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));