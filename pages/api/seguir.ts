import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { respostasPadroes } from "@/types/respostasPadroes";

const seguirEndpoint = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes>) => {
    try {
        return res.status(405).json({ MethodNotAllowed : 'Método informado inválido!' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ InternalServerError : 'Ocorreu um erro ao seguir o usuário!' });
    }
}

export default validarTokenJWT(conectarMongoDB(seguirEndpoint))