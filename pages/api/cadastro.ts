import { NextApiRequest, NextApiResponse } from 'next';
import { respostasPadroes } from '../../types/respostasPadroes';
import { cadastroRequisicao } from '../../types/cadastroRequisicao';
import { usuarioModel } from '../../models/usuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';

/**
 * Endpoint para cadastro de um usuário.
 * 
 * @param req - Objeto contendo a requisição HTTP recebida.
 * @param res - Objeto que envia a resposta HTTP.
 * @returns - Uma resposta em JSON contendo mensagem de sucesso se o usuário for cadastrado no banco de dados ou não.
 */

const endpointCadastro = async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {
    if(req.method === 'POST'){
        const usuario = req.body as cadastroRequisicao;
        
        // Faz a tratativa das informações dadas pelo usuário e verifica se são válidos.
        if(!usuario.nome || usuario.nome.length < 5) {
            return res.status(400).json({erro : 'Nome inválido!'});
        }

        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){
            return res.status(400).json({erro : 'Email inválido!'});
        }

        if(!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({erro : 'Senha inválido!'}); 
        }

        // Busca no banco de dados por emails criados em duplicidade
        const usuariosDuplicidadeEmail = await usuarioModel.find({email : usuario.email});
        if(usuariosDuplicidadeEmail && usuariosDuplicidadeEmail.length > 0){
            res.status(400).json({erro : 'O email cadastrado ja existe!' });
        };

        // Cria o usuário com a senha encriptada usando o modulo MD5
        const usuarioFinal = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        };

        // Função assincrona que cria o usuário e retorna mensagem de sucesso.
        await usuarioModel.create(usuarioFinal);
        return res.status(200).json({msg : 'Usuário cadastrado com sucesso!'});
    }
    return res.status(405).json({erro : 'Método informado não é válido!'});
}

export default conectarMongoDB(endpointCadastro);