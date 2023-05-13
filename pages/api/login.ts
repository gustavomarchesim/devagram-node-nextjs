import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import {  respostasPadroes } from "../../types/respostasPadroes";
import { usuarioModel } from "../../models/usuarioModel";
import md5 from 'md5';

/**
 * This is a TypeScript function that handles a login endpoint, checking if the provided login and
 * password match a user in the database and returning an appropriate response.
 * 
 * @param req The `req` parameter is an object that represents the incoming HTTP request in a Next.js
 * API route. It contains information about the request, such as the HTTP method, headers, query
 * parameters, and request body.
 * @param res The "res" parameter is an instance of the NextApiResponse class, which is used to send
 * the HTTP response back to the client. It is used to set the status code, headers, and body of the
 * response. In this case, it is of type "NextApiResponse<respostasPad
 * 
 * @return The endpointLogin function is returning a response to the client based on the HTTP method
 * used in the request and the validity of the login credentials provided in the request body. If the
 * method is POST and the login credentials are valid, a success message with the user's name is
 * returned with a status code of 200. If the login credentials are invalid, an error message is
 * returned with a status code of
 */
const endpointLogin = async ( req: NextApiRequest, res: NextApiResponse<respostasPadroes> ) => {
    if (req.method === 'POST'){
        const {login, senha} = req.body;

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