import { NextApiRequest, NextApiResponse } from 'next';
import { respostasPadroes } from '../../types/respostasPadroes';
import { cadastroRequisicao } from '../../types/cadastroRequisicao';

const endpointCadastro = ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {

    if(req.method === 'POST'){
        const usuario = req.body as cadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 5) {
            return res.status(400).json({erro : 'Nome inválido!'});
        }

        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){
            return res.status(400).json({erro : 'Email inválido!'});
        }

        if(!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({erro : 'Senha inválido!'}); 
        }
        return res.status(200).json({msg : 'Dados corretos!'});
    }
    return res.status(405).json({erro : 'Método informado não é válido!'});
}

export default endpointCadastro;