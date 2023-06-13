import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { respostasPadroes } from "@/types/respostasPadroes";
import NextCors from 'nextjs-cors';

export const politicaCORS = ( handler : NextApiHandler ) => 
    async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes>) => {
    try {
        
        await NextCors( req, res, {
            origin : '*',
            methods: [ 'GET', 'PUT','POST' ],
            optionsSucessStatus : 200,
        });

        return handler(req, res);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ InternalServerError : 'Erro ao tratar a politica de CORS!' }); 
    }
};