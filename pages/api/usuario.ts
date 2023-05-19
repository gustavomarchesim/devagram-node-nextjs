import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import type { NextApiRequest, NextApiResponse } from "next";

const usuarioEndPoint = (req : NextApiRequest, res : NextApiResponse) => {
    return res.status(200).json("Usuário conectado com sucesso");
};

export default validarTokenJWT(usuarioEndPoint);