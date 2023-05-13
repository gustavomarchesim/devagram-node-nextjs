import { NextApiRequest, NextApiResponse } from 'next';
import { respostasPadroes } from '../../types/respostasPadroes';
import { cadastroRequisicao } from '../../types/cadastroRequisicao';
import { usuarioModel } from '../../models/usuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';

const endpointCadastro = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {
    if(req.method === 'POST'){
        const usuario = req.body as cadastroRequisicao;
        //Faz a validação das informações passadas pelo usuário.
        if(!usuario.nome || usuario.nome.length < 5) {
            return res.status(400).json({erro : 'Nome inválido!'});
        }

        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){
            return res.status(400).json({erro : 'Email inválido!'});
        }

        if(!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({erro : 'Senha inválido!'}); 
        }

        //verifica se o email cadastrado já existe no banco de dados!
        const usuariosDuplicidadeEmail = await usuarioModel.find({email : usuario.email});
        if(usuariosDuplicidadeEmail && usuariosDuplicidadeEmail.length > 0){
            res.status(400).json({erro : 'O email cadastrado ja existe!' });
        };
        //Salva informações no banco de dados
        const usuarioFinal = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        };
        
        await usuarioModel.create(usuarioFinal);
        return res.status(200).json({msg : 'Usuário cadastrado com sucesso!'});
    }
    return res.status(405).json({erro : 'Método informado não é válido!'});
}

export default conectarMongoDB(endpointCadastro);