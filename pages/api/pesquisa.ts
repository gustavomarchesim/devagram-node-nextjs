import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/usuarioModel";
import { respostasPadroes } from "@/types/respostasPadroes";

// Função de endpoint para pesquisa de usuários
const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostasPadroes | any[]>) => {

  try {
    if (req.method === 'GET') {
      // Verifica se o método da requisição é GET

      if (req?.query?.id) {
        // Se existir o parâmetro de consulta "id"
        const UsuarioID = await usuarioModel.findById(req.query.id);
        // Busca um usuário específico com base no ID fornecido

        if (!UsuarioID) {
          // Se o usuário não for encontrado
          return res.status(400).json({ BadRequest : 'Usuário não encontrado!' });
          // Retorna uma resposta de erro com código 400 (BadRequest) informando que o usuário não foi encontrado
        }
        return res.status(200).json(UsuarioID);
        // Retorna uma resposta de sucesso com código 200 (OK) e as informações do usuário encontrado
      } else {
        const { filtro } = req?.query;
        // Extrai o parâmetro de consulta "filtro" da requisição

        if (!filtro || filtro.length < 2) {
          // Verifica se o filtro não existe ou tem menos de 2 caracteres
          return res.status(400).json({ BadRequest : 'A busca deve conter ao menos 2 caracteres!' });
          // Retorna uma resposta de erro com código 400 (BadRequest) informando que a busca deve conter pelo menos 2 caracteres
        }

        const busca = await usuarioModel.find({
          $or: [
            { nome: { $regex: filtro, $options: 'i' } },
            { email: { $regex: filtro, $options: 'i' } }
          ]
        });
        // Executa uma busca no banco de dados com base no filtro informado
        // O filtro é definido para buscar usuários com o campo "nome" ou "email" correspondendo ao filtro de forma case-insensitive

        busca.forEach(usuario => {
          usuario.senha = null;
        });
        // Remove a senha de cada usuário encontrado para fins de segurança

        return res.status(200).json(busca);
        // Retorna uma resposta de sucesso com código 200 (OK) e os usuários encontrados
      }
    }

    return res.status(405).json({ MethodNotAllowed: 'Método informado não é válido' });
    // Se o método da requisição não for GET, retorna uma resposta de erro com código 405 (MethodNotAllowed)
    // informando que o método informado não é válido
  } catch (e) {
    console.log(e);
    return res.status(500).json({ InternalServerError: 'Erro ao buscar usuário!' });//<== Retorna uma resposta de erro com código 500 (InternalServerError) informando que ocorreu um erro ao buscar o usuário
  }
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));
// Exporta a função pesquisaEndpoint como padrão e encadeia as funções de middleware validarTokenJWT e conectarMongoDB
// Isso significa que os middlewares serão executados antes da função pesquisaEndpoint, adicionando funcionalidades adicionais
