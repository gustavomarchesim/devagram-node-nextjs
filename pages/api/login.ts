import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import {  respostasPadroes } from "../../types/respostasPadroes";

const endpointLogin = ( req: NextApiRequest, res: NextApiResponse<respostasPadroes> ) => {
    if (req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admin' && senha === 'admin2123') {
            return res.status(200).json({msg: 'Usuário autenticado com sucesso!'});
        } 
        return res.status(400).json({erro : 'Usuário ou senha inválida!'});
    }
    return res.status(405).json({erro : 'Método informado não é válido!'});
}

export default conectarMongoDB(endpointLogin);