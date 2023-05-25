import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { respostasPadroes } from "@/types/respostasPadroes";
import type { NextApiRequest, NextApiResponse } from "next";

const usuarioEndPoint = (req : NextApiRequest, res : NextApiResponse<respostasPadroes>) => {
    return res.status(200).json({msg : "Usuário conectado com sucesso"});
};

export default validarTokenJWT(usuarioEndPoint);