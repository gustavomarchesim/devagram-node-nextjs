import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import { respostasPadroes } from "../types/respostasPadroes";

/**
 * Função de middleware para conectar ao banco de dados MongoDB antes de lidar com a solicitação.
 * 
 * @param handler - O manipulador da API Next.js que será executado após a conexão bem-sucedida com o banco de dados.
 * @returns Uma função assíncrona que conecta ao banco de dados e executa o manipulador da API.
 */

export const conectarMongoDB = (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<respostasPadroes | any[]>) => {

    // Verificar se a conexão com o banco de dados já foi estabelecida
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    // Obter a string de conexão do banco de dados a partir das variáveis de ambiente
    const { DB_CONEXAO_STRING } = process.env;
    
    // Caso a variável de ambiente esteja vazia, retorna um erro ao usuário.
    if (!DB_CONEXAO_STRING) {
      return res.status(500).json({ erro: 'Env de configuração do banco não informado!' });
    }

    // Lidar com os eventos de conexão e erro do Mongoose
    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', () => console.log('Ocorreu um erro ao conectar no banco de dados'));

    // Conectar ao banco de dados MongoDB
    await mongoose.connect(DB_CONEXAO_STRING);

    // Executar o manipulador da API
    return handler(req, res);
}
