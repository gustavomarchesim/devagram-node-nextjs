import { NextApiRequest, NextApiResponse } from 'next';
import { respostasPadroes } from '../../types/respostasPadroes';
import { cadastroRequisicao } from '../../types/cadastroRequisicao';
import { usuarioModel } from '../../models/usuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { upload, uploadImagemCosmic } from '../../services/uploadImagensCosmic';
import md5 from 'md5';
import nc from 'next-connect';

/**
 * Endpoint para cadastrar um usuário.
 *
 * @param {NextApiRequest} req - O objeto de requisição do Next.js.
 * @param {NextApiResponse<respostasPadroes>} res - O objeto de resposta do Next.js.
 * @returns {Promise<void>} - Retorna a resposta JSON com o resultado do cadastro do usuário.
 */

const handler = nc()
    .use(upload.single('file'))
    .post( async ( req : NextApiRequest, res : NextApiResponse<respostasPadroes> ) => {

      try {
         const usuario = req.body as cadastroRequisicao;
    
        // Validação do campo 'nome'.
      	if(!usuario.nome || usuario.nome.length < 5) {
                return res.status(400).json({BadRequest : 'Nome inválido!'});
        	};
         // Validação do campo 'email'.
   		if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')){
                return res.status(400).json({BadRequest : 'Email inválido!'});
         };
      	// Validação do campo 'senha'.
         if(!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({BadRequest : 'Senha inválido!'}); 
         };
         // Verifica se o email já esta cadastrado
         const usuariosDuplicidadeEmail = await usuarioModel.find({email : usuario.email});
         if(usuariosDuplicidadeEmail && usuariosDuplicidadeEmail.length > 0){
                return res.status(400).json({BadRequest : 'O email cadastrado ja existe!' });
         };      

      	//Envia a imagem do Multer para o Cosmic
         const image = await uploadImagemCosmic(req)

         // Salva o usuário no banco de dados
         const usuarioFinal = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha),
            avatar : image?.media?.url
         };

         await usuarioModel.create(usuarioFinal);
         return res.status(200).json({OK : 'Usuário cadastrado com sucesso!'});
         
      } catch(e) {
         console.log(e);
         return res.status(500).json({InternalServerError : 'Falha ao cadastrar usuário!'});
      }
});

//Configuração para que não seja feita a transformação do arquivo para JSON
export const config = {
	api : {
		bodyParser : false
	}
};

export default conectarMongoDB(handler);
