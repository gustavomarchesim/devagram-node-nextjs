import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { respostasPadroes } from "@/types/respostasPadroes";
import type { NextApiRequest, NextApiResponse } from "next";

const usuarioEndPoint = async (req : NextApiRequest, res : NextApiResponse<respostasPadroes | any>) => {

    try {

        const { userId } = req?.query;

        const usuario = await usuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);

    } catch (e) {
        console.log(e);
    };
    return res.status(400).json({ erro : 'Erro ao obter dados do usuário!' });
};

export default validarTokenJWT(conectarMongoDB(usuarioEndPoint));