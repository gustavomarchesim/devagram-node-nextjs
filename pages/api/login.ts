import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import {  respostasPadroes } from "../../types/respostasPadroes";
import { usuarioModel } from "../../models/usuarioModel";
import md5 from 'md5';

/**
 * Endpoint para realizar o login de um usuário.
 * 
 * @param req - Objeto contendo a requisição HTTP recebida.
 * @param res - Objeto para enviar a resposta HTTP.
 * @returns Uma resposta JSON contendo uma mensagem de sucesso se o login for bem-sucedido,
 *          ou uma mensagem de erro se o login falhar.
 */

const endpointLogin = async ( req: NextApiRequest, res: NextApiResponse<respostasPadroes> ) => {
    if (req.method === 'POST'){
        const {login, senha} = req.body;
        // Procura no banco de dados pelo email e senha fornecidos
        const usuarioEncontrado = await usuarioModel.find({email: login, senha : md5(senha)});
        if(usuarioEncontrado && usuarioEncontrado.length > 0) {
            const usuarioLogado = usuarioEncontrado[0];
            return res.status(200).json({msg: `Usuário ${usuarioLogado.nome} autenticado com sucesso!`});
        } 
        return res.status(400).json({erro : 'Usuário ou senha inválida!'});
    }
    return res.status(405).json({erro : 'Método informado não é válido!'});
}

export default conectarMongoDB(endpointLogin);